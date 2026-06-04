import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { jwtVerify } from 'jose';
import { url } from "inspector";

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

    try {
        const urlParam = new URL(request.url).searchParams;
        const jns = urlParam.get("jns");

        if (!jns) {
            return NextResponse.json({ error: "Missing parameter jns" }, { status: 400 });
        }

        const sql = `SELECT * FROM konfigs WHERE jns = ?`;
        const result = await query(sql, [jns]) as any[];
        return NextResponse.json(result);
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
        const urlParam = new URL(request.url).searchParams;
        const jns = urlParam.get("jns");

        if (!jns) {
            return NextResponse.json({ error: "Missing parameter jns" }, { status: 400 });
        }

        const body = await request.json();
        const { judul, content } = body;

        const sql = `INSERT INTO konfigs (jns, judul, content) VALUES (?, ?, ?)`;
        const result = await query(sql, [jns, judul, content]) as any;
        return NextResponse.json({ success: true, id: result.insertId });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const urlParam = new URL(request.url).searchParams;
        const jns = urlParam.get("jns");

        if (!jns) {
            return NextResponse.json({ error: "Missing parameter jns" }, { status: 400 });
        }

        const body = await request.json();
        const { id, judul, content } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const sql = `UPDATE konfigs SET judul = ?, content = ? WHERE id = ?`;
        const result = await query(sql, [judul, content, id]) as any;
        return NextResponse.json({ success: true, id: result.insertId });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await verifySession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

        const urlParam = new URL(request.url).searchParams;
        const id = urlParam.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Data Konfig tidak ditemukan.' },
                { status: 401 }
            );
        }

        await query('DELETE FROM konfigs WHERE id = ?', [id]) as any[];
        return NextResponse.json({
            success: true,
            message: 'Konfig berhasil dihapus.',
        });
    } catch (error) {
        console.error("User deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}