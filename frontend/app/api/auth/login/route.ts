import { NextResponse } from 'next/server';
import { seedDatabaseIfEmpty } from '@/lib/dbSeed';
import User from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email required' },
        { status: 400 }
      );
    }

    // Connect & Seed MongoDB Atlas if URI exists
    await seedDatabaseIfEmpty();

    const token = `token_${Math.random().toString(36).substring(2)}`;
    const role = email.includes('admin') ? 'admin' : email.includes('broker') ? 'broker' : 'customer';
    const userId = `u_${Date.now()}`;
    const userName = email.split('@')[0];

    try {
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        await User.create({ id: userId, name: userName, email, role });
      }
    } catch (_e) {}

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        name: userName,
        email,
        role
      }
    });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 400 }
    );
  }
}
