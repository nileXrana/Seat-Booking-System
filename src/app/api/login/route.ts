import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = await signToken({
            id: user.id,
            name: user.name,
            email: user.email,
            batch: user.batch
        })

        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, batch: user.batch } })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
