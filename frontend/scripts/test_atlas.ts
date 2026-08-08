import mongoose from 'mongoose';
import User from '../lib/models/User';
import Broker from '../lib/models/Broker';
import Booking from '../lib/models/Booking';
import Review from '../lib/models/Review';
import { SEED_BROKERS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from '../lib/data/seedData';

const MONGODB_URI = "mongodb+srv://beaconbd000_db_user:labour6258@cluster0.c75rz7i.mongodb.net/labour_db?retryWrites=true&w=majority";
process.env.MONGODB_URI = MONGODB_URI;

async function runTest() {
  console.log('🚀 Connecting to MongoDB Atlas Cloud...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ SUCCESS! Connected to MongoDB Atlas Cloud Database (labour_db)!');

  console.log('🌱 Populating initial collections into MongoDB Atlas Cloud...');

  // 1. Seed Users
  if ((await User.countDocuments()) === 0) {
    await User.insertMany([
      { id: 'usr_admin', name: 'Master Admin 6258', email: 'admin6258@labour.com', role: 'admin', phone: '01711006258' },
      { id: 'usr_cust1', name: 'Rahim Uddin', email: 'rahim@gmail.com', role: 'customer', phone: '01812345678' },
      { id: 'usr_broker1', name: 'Karim Agency', email: 'karim@broker.com', role: 'broker', phone: '01799887766' }
    ]);
  }

  // 2. Seed Brokers
  if ((await Broker.countDocuments()) === 0) {
    await Broker.insertMany(SEED_BROKERS.map(b => ({
      id: b.id,
      name: b.name,
      phone: b.phone,
      rating: b.ratingAvg || 4.8,
      verified: b.verified,
      activeWorkersCount: b.workerCount || 5,
      totalJobsCompleted: b.totalJobsCompleted || 10,
      location: {
        division: b.location.division || 'Dhaka',
        district: b.location.district || 'Dhaka',
        area: b.location.upazila || 'Mirpur'
      },
      services: [
        { category: 'Electrician & Technical', ratePerDay: 1000, availableWorkers: 3 },
        { category: 'Plumber & Sanitary', ratePerDay: 950, availableWorkers: 2 }
      ],
      workersList: (b.workers || []).map(w => ({
        id: w.id,
        name: w.name,
        skillCategory: w.category,
        dailyRate: w.dailyRate || 900,
        phone: '01700000000',
        status: 'Available' as const
      }))
    })));
  }

  // 3. Seed Bookings
  if ((await Booking.countDocuments()) === 0) {
    await Booking.insertMany(INITIAL_BOOKINGS.map(b => ({
      id: b.id,
      brokerId: b.brokerId,
      brokerName: b.brokerName,
      customerId: b.customerId,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      serviceCategory: b.serviceCategory || 'Electrician & Technical',
      serviceCategories: b.serviceCategories || ['Electrician & Technical'],
      workersCount: b.workersCount || 2,
      workDate: b.workDate || '2026-08-10',
      customAgreedAmount: b.customAgreedAmount || b.finalAmount || 3500,
      finalAmount: b.customAgreedAmount || b.finalAmount || 3500,
      advanceDeposit: 500,
      status: b.status || 'Confirmed',
      escrowStatus: b.escrowStatus || 'Held',
      brokerWorkDoneStatus: b.brokerWorkDoneStatus || 'NotSubmitted',
      customerWorkDoneStatus: b.customerWorkDoneStatus || 'NotSubmitted',
      customerRating: b.customerRating,
      customerComment: b.customerComment,
      details: b.details,
      locationDetails: (b as any).locationDetails || 'Dhaka, Bangladesh'
    })));
  }

  // 4. Seed Reviews
  if ((await Review.countDocuments()) === 0) {
    await Review.insertMany(INITIAL_REVIEWS.map(r => ({
      id: r.id,
      brokerId: r.brokerId,
      bookingId: r.bookingId || 'BK-1001',
      rating: r.rating,
      comment: r.comment,
      customerName: r.customerName
    })));
  }

  const userCount = await User.countDocuments();
  const brokerCount = await Broker.countDocuments();
  const bookingCount = await Booking.countDocuments();
  const reviewCount = await Review.countDocuments();

  console.log('--------------------------------------------------');
  console.log('🎉 LIVE MONGODB ATLAS CLOUD DATABASE REPORT:');
  console.log(`- Database Name: labour_db`);
  console.log(`- Collection "users": ${userCount} documents`);
  console.log(`- Collection "brokers": ${brokerCount} documents`);
  console.log(`- Collection "bookings": ${bookingCount} documents`);
  console.log(`- Collection "reviews": ${reviewCount} documents`);
  console.log('--------------------------------------------------');

  await mongoose.disconnect();
  process.exit(0);
}

runTest();
