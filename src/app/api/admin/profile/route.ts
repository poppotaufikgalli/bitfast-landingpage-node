import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'bitfast-jwt-super-secret-key-1234567890-qwertyuiop'
);

// Helper to verify admin session
async function verifySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function GET(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(session);
}

export async function PUT(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = session;
        const { email } = await request.json();

        const users = await query('SELECT * FROM users WHERE id = ?', [id]) as any[];
        if (users.length === 0) {
            return NextResponse.json(
                { success: false, message: 'User tidak ditemukan.' },
                { status: 401 }
            );

        }

        await query('UPDATE users SET email = ? WHERE id = ?', [email, id]) as any[];

        return NextResponse.json({
            success: true,
            message: 'Email berhasil diupdate.',
        });
    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
