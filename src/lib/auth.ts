import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecret')

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1w')
        .sign(secret)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch (err) {
        return null
    }
}

export async function getUserSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    return await verifyToken(token) as { id: string, name: string, email: string, batch: string } | null
}
