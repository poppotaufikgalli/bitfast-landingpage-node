import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bitfast-jwt-super-secret-key-1234567890-qwertyuiop'
);

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json();

    // Handle logout action
    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0),
      });
      return response;
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // Get user
    const users = await query('SELECT * FROM users WHERE email = ?', [email]) as any[];
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Kredensial login tidak cocok.' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Kredensial login tidak cocok.' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await new SignJWT({ id: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: { id: user.id, name: user.name, email: user.email }
    });

    // Set cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7200, // 2 hours
    });

    return response;
  } catch (error) {
    console.error('Error in admin auth API:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
export async function GET() {
  // Check if admin is currently authenticated by verifying their cookie
  return NextResponse.json({ authenticated: true });
}
