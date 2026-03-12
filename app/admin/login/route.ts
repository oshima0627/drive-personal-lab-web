import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const pw = formData.get('pw') as string;

  if (pw && pw === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.redirect(new URL('/admin', req.url));
    res.cookies.set('admin_authed', 'true', { httpOnly: true, maxAge: 60 * 60 * 8 });
    return res;
  }

  const res = NextResponse.redirect(new URL('/admin?error=1', req.url));
  return res;
}
