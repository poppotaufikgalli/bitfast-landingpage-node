import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
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

export async function GET(
  request: Request,
  context: { params: Promise<{ entity: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { entity } = await context.params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (entity === 'packages') {
      if (id) {
        const pkgs = await query('SELECT * FROM packages WHERE id = ?', [id]) as any[];
        return NextResponse.json(pkgs[0] || null);
      }
      const pkgs = await query('SELECT * FROM packages ORDER BY id DESC');
      return NextResponse.json(pkgs);
    }

    if (entity === 'testimonials') {
      if (id) {
        const testis = await query('SELECT * FROM testimonials WHERE id = ?', [id]) as any[];
        return NextResponse.json(testis[0] || null);
      }
      const testis = await query('SELECT * FROM testimonials ORDER BY id DESC');
      return NextResponse.json(testis);
    }

    if (entity === 'posts') {
      if (id) {
        const posts = await query('SELECT * FROM posts WHERE id = ?', [id]) as any[];
        return NextResponse.json(posts[0] || null);
      }
      const posts = await query(`
        SELECT posts.*, users.name as author_name 
        FROM posts 
        LEFT JOIN users ON posts.user_id = users.id 
        ORDER BY posts.id DESC
      `);
      return NextResponse.json(posts);
    }

    if (entity === 'registrations') {
      if (id) {
        const reg = await query(`
          SELECT registrations.*, packages.name as package_name 
          FROM registrations 
          LEFT JOIN packages ON registrations.package_id = packages.id 
          WHERE registrations.id = ?
        `, [id]) as any[];
        return NextResponse.json(reg[0] || null);
      }
      const regs = await query(`
        SELECT registrations.*, packages.name as package_name 
        FROM registrations 
        LEFT JOIN packages ON registrations.package_id = packages.id 
        ORDER BY registrations.id DESC
      `);
      return NextResponse.json(regs);
    }

    return NextResponse.json({ success: false, message: 'Entity not found' }, { status: 404 });
  } catch (error) {
    console.error(`Error GETting ${entity}:`, error);
    return NextResponse.json({ success: false, message: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ entity: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { entity } = await context.params;
  const body = await request.json();

  try {
    if (entity === 'packages') {
      const { name, slug, speed, price, category, features, is_popular, is_active } = body;
      const featuresJSON = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
      
      const result = await query(
        'INSERT INTO packages (name, slug, speed, price, category, features, is_popular, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, slug, speed, price, category, featuresJSON, is_popular ? 1 : 0, is_active ? 1 : 0]
      ) as any;
      
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (entity === 'testimonials') {
      const { name, role_or_company, rating, content, avatar, is_featured, is_active } = body;
      
      const result = await query(
        'INSERT INTO testimonials (name, role_or_company, rating, content, avatar, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, role_or_company, rating || 5, content, avatar || null, is_featured ? 1 : 0, is_active ? 1 : 0]
      ) as any;
      
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (entity === 'posts') {
      const { title, slug, excerpt, content, cover_image, is_published } = body;
      const publishedAt = is_published ? new Date() : null;
      
      const result = await query(
        'INSERT INTO posts (user_id, title, slug, excerpt, content, cover_image, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [session.id, title, slug, excerpt, content, cover_image || null, is_published ? 1 : 0, publishedAt]
      ) as any;
      
      return NextResponse.json({ success: true, id: result.insertId });
    }

    return NextResponse.json({ success: false, message: 'Creation not supported for this entity' }, { status: 400 });
  } catch (error) {
    console.error(`Error POSTing ${entity}:`, error);
    return NextResponse.json({ success: false, message: 'Database operation failed' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ entity: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { entity } = await context.params;
  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
  }

  try {
    if (entity === 'packages') {
      const { name, slug, speed, price, category, features, is_popular, is_active } = data;
      const featuresJSON = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([]);
      
      await query(
        'UPDATE packages SET name = ?, slug = ?, speed = ?, price = ?, category = ?, features = ?, is_popular = ?, is_active = ? WHERE id = ?',
        [name, slug, speed, price, category, featuresJSON, is_popular ? 1 : 0, is_active ? 1 : 0, id]
      );
      
      return NextResponse.json({ success: true });
    }

    if (entity === 'testimonials') {
      const { name, role_or_company, rating, content, avatar, is_featured, is_active } = data;
      
      await query(
        'UPDATE testimonials SET name = ?, role_or_company = ?, rating = ?, content = ?, avatar = ?, is_featured = ?, is_active = ? WHERE id = ?',
        [name, role_or_company, rating || 5, content, avatar || null, is_featured ? 1 : 0, is_active ? 1 : 0, id]
      );
      
      return NextResponse.json({ success: true });
    }

    if (entity === 'posts') {
      const { title, slug, excerpt, content, cover_image, is_published } = data;
      
      // Determine published_at logic:
      // If we are publishing it now, set published_at. Otherwise keep original or null.
      const existing = await query('SELECT is_published, published_at FROM posts WHERE id = ?', [id]) as any[];
      let publishedAt = existing[0]?.published_at;
      if (is_published && !existing[0]?.is_published) {
        publishedAt = new Date();
      } else if (!is_published) {
        publishedAt = null;
      }

      await query(
        'UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, is_published = ?, published_at = ? WHERE id = ?',
        [title, slug, excerpt, content, cover_image || null, is_published ? 1 : 0, publishedAt, id]
      );
      
      return NextResponse.json({ success: true });
    }

    if (entity === 'registrations') {
      const { status, notes } = data;
      
      await query(
        'UPDATE registrations SET status = ?, notes = ? WHERE id = ?',
        [status, notes, id]
      );
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Update not supported for this entity' }, { status: 400 });
  } catch (error) {
    console.error(`Error PUTting ${entity}:`, error);
    return NextResponse.json({ success: false, message: 'Database operation failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ entity: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { entity } = await context.params;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
  }

  try {
    await query(`DELETE FROM \`${entity}\` WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error DELETING ${entity}:`, error);
    return NextResponse.json({ success: false, message: 'Database delete failed' }, { status: 500 });
  }
}
