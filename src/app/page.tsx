import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarDays } from 'lucide-react'

export default function Home() {
    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50">
            <div className="absolute inset-0 z-0 h-full w-full bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            <div className="z-10 container max-w-5xl mx-auto px-6 relative flex flex-col items-center text-center space-y-8">
                <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-800 backdrop-blur-sm shadow-sm">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span className="font-medium">Daily Office Seat Booking</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                    Reserve your space <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">with confidence</span>
                </h1>

                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                    A seamless, fast, and fair allocation system for hybrid teams.
                    Manage your designated cluster days and floating bookings smoothly.
                </p>

                <div className="flex items-center gap-4 mt-8">
                    <Link href="/login">
                        <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
                            Login to Portal
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
