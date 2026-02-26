"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Login failed')
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-100 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-cyan-100 rounded-full blur-[100px] opacity-50 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <Card className="w-full max-w-md z-10 shadow-2xl border-white/50 bg-white/80 backdrop-blur-xl">
                <CardHeader className="space-y-2 text-center pb-8 pt-8">
                    <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
                    <CardDescription className="text-base text-slate-500">
                        Enter your credentials to access the portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <Input
                                type="text"
                                placeholder="b1@wissen01"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white/50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 bg-white/50 focus:bg-white transition-colors"
                            />
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in to account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center pb-8 pt-2">
                    <p className="text-sm text-slate-500">
                        For support, contact HR or IT department.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
