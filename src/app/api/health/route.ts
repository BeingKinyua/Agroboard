import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    system: 'Agro-Deliveries Ke. BOS',
    framework: 'Next.js App Router',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}
