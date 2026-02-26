import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'
import { isBookingWindowOpen, isBatchDay, isValidBookingDate, getCurrentLocalTime } from '@/lib/utils'
import { startOfDay, parseISO } from 'date-fns'

export async function POST(req: Request) {
    try {
        const user = await getUserSession()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        if (!isBookingWindowOpen()) {
            return NextResponse.json({ error: 'Booking window opens at 3 PM strictly.' }, { status: 400 })
        }

        const { date } = await req.json()
        if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 })

        const targetDate = startOfDay(parseISO(date))
        if (!isValidBookingDate(targetDate)) {
            return NextResponse.json({ error: 'Cannot book on weekends.' }, { status: 400 })
        }

        const today = startOfDay(getCurrentLocalTime())

        // Validate target date is not in the past
        if (targetDate.getTime() < today.getTime()) {
            return NextResponse.json({ error: 'Cannot book for past dates.' }, { status: 400 })
        }

        const batchDay = isBatchDay(user.batch, targetDate)

        if (batchDay) {
            // Scenario A: DESIGNATED
            // Just check if we already have it. If released earlier, we reclaim it.
            await prisma.booking.upsert({
                where: { userId_date: { userId: user.id, date: targetDate } },
                update: { type: 'DESIGNATED' },
                create: { userId: user.id, date: targetDate, type: 'DESIGNATED' }
            })
            return NextResponse.json({ success: true, type: 'DESIGNATED' })
        } else {
            // Scenario B: FLOATING
            // Check restriction: 1 day in advance.
            const diffMs = targetDate.getTime() - today.getTime()
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

            const isFridayToMonday = targetDate.getDay() === 1 && today.getDay() === 5 && diffDays === 3
            if (diffDays !== 1 && !isFridayToMonday) {
                return NextResponse.json({ error: 'Can only book floating seats strictly 1 working day in advance.' }, { status: 400 })
            }

            // Check capacity
            const releasedCount = await prisma.booking.count({ where: { date: targetDate, type: 'RELEASED' } })
            const floatingCount = await prisma.booking.count({ where: { date: targetDate, type: 'FLOATING' } })

            const available = 10 + releasedCount - floatingCount
            if (available <= 0) {
                return NextResponse.json({ error: 'No floating seats available for this date.' }, { status: 400 })
            }

            // Check if user already booked it (maybe they released it? Unlikely for floating, but safely upsert)
            await prisma.booking.upsert({
                where: { userId_date: { userId: user.id, date: targetDate } },
                update: { type: 'FLOATING' },
                create: { userId: user.id, date: targetDate, type: 'FLOATING' }
            })

            return NextResponse.json({ success: true, type: 'FLOATING' })
        }
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
