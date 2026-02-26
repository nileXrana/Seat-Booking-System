import { getUserSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ClientDashboard from './ClientDashboard'
import { startOfDay, addDays } from 'date-fns'
import { getCurrentLocalTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const user = await getUserSession()
    if (!user) redirect('/login')

    const today = startOfDay(getCurrentLocalTime())

    const days = []
    let current = today
    while (current.getDay() !== 1) {
        current = addDays(current, -1)
    }

    for (let i = 0; i < 14; i++) {
        const d = addDays(current, i)
        if (d.getDay() >= 1 && d.getDay() <= 5) {
            days.push(d)
        }
    }

    const startDate = days[0]
    const endDate = days[days.length - 1]

    const userBookingsResp = await prisma.booking.findMany({
        where: { userId: user.id, date: { gte: startDate, lte: endDate } }
    })

    const allBookings = await prisma.booking.groupBy({
        by: ['date', 'type'],
        where: { date: { gte: startDate, lte: endDate } },
        _count: { id: true }
    })

    const statusMap = days.map(d => {
        const dStr = d.toISOString()
        const myBooking = userBookingsResp.find((b: any) => b.date.getTime() === d.getTime())

        let floatingBooked = 0
        let released = 0
        let designatedBooked = 0

        allBookings.forEach((g: any) => {
            if (g.date.getTime() === d.getTime()) {
                if (g.type === 'FLOATING') floatingBooked = g._count.id
                if (g.type === 'RELEASED') released = g._count.id
                if (g.type === 'DESIGNATED') designatedBooked = g._count.id
            }
        })

        return {
            date: dStr,
            myBooking: myBooking ? myBooking.type : null,
            floatingBooked,
            released,
            designatedBooked
        }
    })

    // To serialize properly to client
    return <ClientDashboard user={user} daysData={statusMap} serverTimeMs={getCurrentLocalTime().getTime()} />
}
