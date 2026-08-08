import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, type, amount, paymentMethod } = body;

    if (!bookingId || !type || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing payment details' },
        { status: 400 }
      );
    }

    const paymentId = `P-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      paymentId,
      bookingId,
      type,
      amount,
      currency: 'BDT',
      status: 'Paid',
      paymentMethod: paymentMethod || 'bKash',
      timestamp: new Date().toISOString()
    });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Payment processing error' },
      { status: 400 }
    );
  }
}
