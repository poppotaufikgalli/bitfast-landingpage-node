import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, package_id } = body;

    const errors: Record<string, string[]> = {};

    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.name = ['Nama lengkap wajib diisi.'];
    } else if (name.length > 255) {
      errors.name = ['Nama lengkap maksimal 255 karakter.'];
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.email = ['Alamat email wajib diisi.'];
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = ['Format email tidak valid.'];
      } else if (email.length > 255) {
        errors.email = ['Alamat email maksimal 255 karakter.'];
      }
    }

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      errors.phone = ['Nomor WhatsApp / HP wajib diisi.'];
    } else if (phone.length > 20) {
      errors.phone = ['Nomor WhatsApp / HP maksimal 20 karakter.'];
    }

    if (!address || typeof address !== 'string' || address.trim() === '') {
      errors.address = ['Alamat pemasangan lengkap wajib diisi.'];
    } else if (address.length > 1000) {
      errors.address = ['Alamat pemasangan lengkap maksimal 1000 karakter.'];
    }

    let parsedPackageId = null;
    if (package_id) {
      parsedPackageId = parseInt(package_id);
      if (isNaN(parsedPackageId)) {
        errors.package_id = ['Paket yang Anda pilih tidak valid.'];
      } else {
        // Validate package exists
        const packages = await query('SELECT id FROM packages WHERE id = ?', [parsedPackageId]) as any[];
        if (packages.length === 0) {
          errors.package_id = ['Paket yang Anda pilih tidak valid.'];
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 422 }
      );
    }

    // Insert lead
    await query(
      'INSERT INTO registrations (package_id, name, email, phone, address, status) VALUES (?, ?, ?, ?, ?, ?)',
      [parsedPackageId, name.trim(), email.trim(), phone.trim(), address.trim(), 'pending']
    );

    return NextResponse.json({
      success: true,
      message: 'Terima kasih! Pendaftaran Anda telah kami terima. Tim teknisi Bitfast akan segera menghubungi Anda untuk jadwal survei lokasi.'
    });
  } catch (error) {
    console.error('Error in register-lead API:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
