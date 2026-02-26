import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'
import { isBookingWindowOpen, isBatchDay, isValidBookingDate, getCurrentLocalTime } from '@/lib/utils'
import { startOfDay, parseISO } from 'date-fns'

// Scenario C: Releasing a Seat
export async function POST(req: Request) {
    try {
        const user = await getUserSession()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        if (!isBookingWindowOpen()) {
            return NextResponse.json({ error: 'Booking window opens at 3 PM strictly.' }, { status: 400 })
        }

        const { date } = await req.json()
        const targetDate = startOfDay(parseISO(date))
        const today = startOfDay(getCurrentLocalTime())

        if (targetDate.getTime() < today.getTime()) {
            return NextResponse.json({ error: 'Cannot release past dates.' }, { status: 400 })
        }

        if (!isBatchDay(user.batch, targetDate)) {
            return NextResponse.json({ error: 'Can only release your batch designated days.' }, { status: 400 })
        }

        await prisma.booking.upsert({
            where: { userId_date: { userId: user.id, date: targetDate } },
            update: { type: 'RELEASED' },
            create: { userId: user.id, date: targetDate, type: 'RELEASED' }
        })

        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
