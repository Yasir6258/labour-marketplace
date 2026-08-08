import { NextResponse } from 'next/server';
import { seedDatabaseIfEmpty } from '@/lib/dbSeed';
import User from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email required' },
        { status: 400 }
      );
    }

    await seedDatabaseIfEmpty();

    const userId = `u_${Date.now()}`;
    const token = `token_${Math.random().toString(36).substring(2)}`;
    const userRole = role || 'customer';

    try {
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            id: userId,
            name,
            email,
            role: userRole,
            phone: phone || ''
          }
        },
        { upsert: true, new: true }
      );
    } catch (_e) {}

    return NextResponse.json({
      success: true,
      userId,
      token,
      user: {
        id: userId,
        name,
        email,
        role: userRole
      }
    });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 400 }
    );
  }
}
