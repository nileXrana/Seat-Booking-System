"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format, parseISO, isPast, isToday, startOfDay, addDays } from 'date-fns'
import { Clock, CheckCircle2, XCircle, AlertCircle, Loader2, CalendarDays } from 'lucide-react'
import { isBatchDay } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type DayData = {
    date: string
    myBooking: string | null
    floatingBooked: number
    released: number
    designatedBooked: number
}

type User = {
    id: string
    name: string
    batch: string
}

export default function ClientDashboard({ user, daysData, serverTimeMs }: { user: User, daysData: DayData[], serverTimeMs: number }) {
    const router = useRouter()
    const [time, setTime] = useState(new Date(serverTimeMs))
    const [loadingDate, setLoadingDate] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date(Date.now() - (Date.now() - serverTimeMs)))
            // Actually simpler: just use local time supplemented by initial offset.
            // Assuming client time is reasonably accurate, we just use it, 
            // or we just tick +1s from server time:
        }, 1000)
        return () => clearInterval(timer)
    }, [serverTimeMs])

    useEffect(() => {
        const tick = setInterval(() => {
            setTime(prev => new Date(prev.getTime() + 1000))
        }, 1000)
        return () => clearInterval(tick)
    }, [])

    const isWindowOpen = time.getHours() >= 15
    const todayStart = startOfDay(time)

    const handleAction = async (dateStr: string, action: 'book' | 'release') => {
        if (!isWindowOpen) return
        setLoadingDate(dateStr)
        setErrorMsg('')
        try {
            const res = await fetch(`/api/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateStr })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            router.refresh()
        } catch (e: any) {
            setErrorMsg(e.message)
        } finally {
            setLoadingDate(null)
        }
    }

    const isOneDayAdvance = (targetD: Date) => {
        const diffMs = targetD.getTime() - todayStart.getTime()
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
        const isFridayToMonday = targetD.getDay() === 1 && todayStart.getDay() === 5 && diffDays === 3
        return diffDays === 1 || isFridayToMonday
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Status Bar */}
            <Card className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white border-0 shadow-lg">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-indigo-100" />
                        <div>
                            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Current Time</p>
                            <p className="text-2xl font-bold tracking-tight">{format(time, 'hh:mm:ss a')}</p>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-center">
                        {isWindowOpen ? (
                            <p className="font-semibold text-white flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                                Booking Window is Open
                            </p>
                        ) : (
                            <p className="font-semibold text-indigo-50 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-300" />
                                Next Window Opens at 3:00 PM
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg text-red-700 shadow-sm flex items-center gap-3">
                    <XCircle className="h-5 w-5" />
                    <p className="font-medium">{errorMsg}</p>
                </div>
            )}

            {/* Week Strips */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-indigo-500" />
                        Booking Schedule
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {daysData.map((day) => {
                            const d = parseISO(day.date)
                            const isPastDate = d.getTime() < todayStart.getTime()
                            const isTodayDate = d.getTime() === todayStart.getTime()
                            const batchDay = isBatchDay(user.batch, d)
                            const loading = loadingDate === day.date

                            // Floating specific logic
                            const floatingAvailable = 10 + day.released - day.floatingBooked
                            const oneDayAdv = isOneDayAdvance(d)

                            return (
                                <Card key={day.date} className={`relative overflow-hidden transition-all duration-200 ${isPastDate ? 'opacity-50 bg-slate-50' : 'hover:shadow-md hover:border-indigo-200'} ${isTodayDate ? 'border-indigo-400 ring-1 ring-indigo-400' : ''}`}>
                                    {isTodayDate && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg">Today</div>}
                                    <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{format(d, 'EEE')}</p>
                                            <p className="text-2xl font-bold text-slate-900">{format(d, 'MMM d')}</p>
                                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                                                {batchDay ? 'Designated Day' : 'Floating Day'}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mt-auto pt-4 border-t border-slate-100">
                                            {isPastDate ? (
                                                <p className="text-sm font-medium text-slate-400 text-center py-2">Date Passed</p>
                                            ) : (
                                                <>
                                                    {/* Info Display */}
                                                    {!batchDay && (
                                                        <div className="flex justify-between items-center text-xs font-medium">
                                                            <span className="text-slate-500">Floating Left:</span>
                                                            <span className={floatingAvailable > 0 ? "text-emerald-600 max-w-full truncate pl-2" : "text-red-500 max-w-full truncate pl-2"}>{floatingAvailable} / {10 + day.released}</span>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    {batchDay ? (
                                                        // DESIGNATED LOGIC
                                                        day.myBooking === 'DESIGNATED' ? (
                                                            <Button disabled={!isWindowOpen || loading} onClick={() => handleAction(day.date, 'release')} variant="destructive" className="w-full">
                                                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                                Release Seat
                                                            </Button>
                                                        ) : day.myBooking === 'RELEASED' ? (
                                                            <Button disabled={!isWindowOpen || loading} onClick={() => handleAction(day.date, 'book')} variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                                Reclaim Seat
                                                            </Button>
                                                        ) : (
                                                            <Button disabled={!isWindowOpen || loading} onClick={() => handleAction(day.date, 'book')} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                                Book Designated
                                                            </Button>
                                                        )
                                                    ) : (
                                                        // FLOATING LOGIC
                                                        day.myBooking === 'FLOATING' ? (
                                                            <Button disabled variant="outline" className="w-full bg-emerald-50 text-emerald-700 border-emerald-200 opacity-100">
                                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Booked
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                disabled={!isWindowOpen || !oneDayAdv || floatingAvailable <= 0 || loading}
                                                                onClick={() => handleAction(day.date, 'book')}
                                                                className="w-full bg-cyan-600 hover:bg-cyan-700"
                                                            >
                                                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :
                                                                    (!oneDayAdv ? 'Not yet open' : floatingAvailable <= 0 ? 'Full' : 'Book Floating')}
                                                            </Button>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}
