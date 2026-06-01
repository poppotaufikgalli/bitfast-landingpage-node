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

    //const { entity } = await context.params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        //const { id } = session;
        if (id) {
            const users = await query('SELECT * FROM users WHERE id = ?', [id]) as any[];
            return NextResponse.json(users[0] || null);
        }

        const users = await query(`
        SELECT users.*, users.name as author_name 
        FROM users 
        ORDER BY users.id DESC
      `);
        return NextResponse.json(users);

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, email, password } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]) as any[];
        return NextResponse.json({
            success: true,
            message: 'User berhasil ditambahkan.',
        });
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = session;
        const { name, email, password } = await request.json();

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

export async function DELETE(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = session;
        const { userId } = await request.json();
        console.log(userId);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User tidak ditemukan.' },
                { status: 401 }
            );
        }

        if (id == userId) {
            return NextResponse.json(
                { success: false, message: 'User tidak dapat menghapus dirinya sendiri.' },
                { status: 401 }
            );
        }

        await query('DELETE FROM users WHERE id = ?', [userId]) as any[];
        return NextResponse.json({
            success: true,
            message: 'User berhasil dihapus.',
        });
    } catch (error) {
        console.error("User deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
