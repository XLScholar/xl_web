import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const ALLOWED_FILES: Record<string, string> = {
  profile: 'profile.json',
  research: 'research.json',
  tags: 'tags.json',
  chips: 'chip-gallery.json',
  photos: 'photo-gallery.json',
  news: 'news.json',
  publications: 'publications.json',
  posts: 'posts.json',
};

function isDevOrAuthorized(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') return true;
  const secret = process.env.EDIT_SECRET;
  if (!secret) return false;
  return request.headers.get('x-edit-secret') === secret;
}

export async function POST(request: NextRequest) {
  if (!isDevOrAuthorized(request)) {
    return NextResponse.json(
      { error: 'Save is only available in development or with EDIT_SECRET.' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const saved: string[] = [];

    for (const [key, filename] of Object.entries(ALLOWED_FILES)) {
      if (body[key] !== undefined) {
        const filePath = path.join(DATA_DIR, filename);
        fs.writeFileSync(filePath, JSON.stringify(body[key], null, 2) + '\n', 'utf8');
        saved.push(filename);
      }
    }

    if (saved.length === 0) {
      return NextResponse.json({ error: 'No valid content keys provided.' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const files = Object.fromEntries(
    Object.entries(ALLOWED_FILES).map(([key, filename]) => {
      const filePath = path.join(DATA_DIR, filename);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return [key, data];
    })
  );
  return NextResponse.json(files);
}
