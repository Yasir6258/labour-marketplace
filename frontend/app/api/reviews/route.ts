import { NextResponse } from 'next/server';
import { INITIAL_REVIEWS } from '@/lib/data/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brokerId = searchParams.get('brokerId');

  let list = INITIAL_REVIEWS;
  if (brokerId) {
    list = list.filter(r => r.brokerId === brokerId);
  }

  return NextResponse.json({
    success: true,
    data: list
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, brokerId, rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, message: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    const reviewId = `rev_${Date.now()}`;

    return NextResponse.json({
      success: true,
      reviewId,
      bookingId,
      brokerId,
      rating,
      comment
    });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Failed creating review' },
      { status: 400 }
    );
  }
}
