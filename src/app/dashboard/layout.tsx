import { getUserSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getUserSession()
    if (!user) redirect('/login')

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-sm pl-2 pr-2">
                            <CalendarDays className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 hidden sm:block">Seat Allocation Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
                            <p className="text-xs text-indigo-600 font-medium mt-1">Batch {user.batch}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                            {user.name.charAt(0)}
                        </div>
                        <Link href="/api/logout" prefetch={false} className="ml-1 text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100">
                            <LogOut className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1 container max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}
