import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_length: process.env.ADMIN_PASSWORD?.length ?? 0,
    NODE_ENV: process.env.NODE_ENV,
  });
}
