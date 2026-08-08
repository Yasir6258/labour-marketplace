import { NextResponse } from 'next/server';
import { seedDatabaseIfEmpty } from '@/lib/dbSeed';
import Booking from '@/lib/models/Booking';
import { INITIAL_BOOKINGS } from '@/lib/data/seedData';

export async function GET() {
  await seedDatabaseIfEmpty();
  try {
    const mongoBookings = await Booking.find().lean();
    if (mongoBookings && mongoBookings.length > 0) {
      return NextResponse.json({
        success: true,
        data: mongoBookings
      });
    }
  } catch (e: any) {
    console.warn('MongoDB Booking fetch fallback:', e.message);
  }

  return NextResponse.json({
    success: true,
    data: INITIAL_BOOKINGS
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await seedDatabaseIfEmpty();

    // Support batch sync from DataContext
    if (body.syncBatch && Array.isArray(body.syncBatch)) {
      for (const b of body.syncBatch) {
        try {
          await Booking.findOneAndUpdate(
            { id: b.id },
            { $set: b },
            { upsert: true, new: true }
          );
        } catch (err: any) {
          console.warn('MongoDB Booking sync warning:', err.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Batch synchronized to MongoDB Atlas'
      });
    }

    const { customerId, brokerId, details, workDate, address, customerName, customerPhone, brokerName, workersCount, customAgreedAmount } = body;

    if (!brokerId || !details) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const agreedAmt = customAgreedAmount || 3500;

    const newBooking = {
      id: bookingId,
      customerId: customerId || 'cust_1',
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '01700000000',
      brokerId,
      brokerName: brokerName || 'Labour Service Agency',
      workersCount: workersCount || 2,
      serviceCategory: 'Electrician & Technical',
      customAgreedAmount: agreedAmt,
      finalAmount: agreedAmt,
      advanceDeposit: 500,
      details,
      workDate: workDate || new Date().toISOString().split('T')[0],
      locationDetails: address || 'Dhaka, Bangladesh',
      status: 'Confirmed',
      escrowStatus: 'Held',
      brokerWorkDoneStatus: 'NotSubmitted',
      customerWorkDoneStatus: 'NotSubmitted',
      createdAt: new Date().toISOString()
    };

    try {
      await Booking.create(newBooking);
    } catch (e: any) {
      console.warn('MongoDB Single Booking save warning:', e.message);
    }

    return NextResponse.json({
      success: true,
      bookingId: newBooking.id,
      status: newBooking.status,
      data: newBooking
    });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    );
  }
}
