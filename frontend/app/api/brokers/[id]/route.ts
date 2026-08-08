import { NextResponse } from 'next/server';
import { SEED_BROKERS } from '@/lib/data/seedData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const broker = SEED_BROKERS.find(b => b.id === id);

  if (!broker) {
    return NextResponse.json(
      { success: false, message: 'Broker not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: broker
  });
}
