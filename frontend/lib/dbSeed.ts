import dbConnect from './mongodb';
import User from './models/User';
import Broker from './models/Broker';
import Booking from './models/Booking';
import Review from './models/Review';
import { SEED_BROKERS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from './data/seedData';

export async function seedDatabaseIfEmpty() {
  try {
    const conn = await dbConnect();
    if (!conn) return;

    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany([
        { id: 'usr_admin', name: 'Master Admin 6258', email: 'admin6258@labour.com', role: 'admin', phone: '01711006258' },
        { id: 'usr_cust1', name: 'Rahim Uddin', email: 'rahim@gmail.com', role: 'customer', phone: '01812345678' },
        { id: 'usr_broker1', name: 'Karim Agency', email: 'karim@broker.com', role: 'broker', phone: '01799887766' }
      ]);
      console.log('🌱 Seeded default MongoDB Users');
    }

    // 2. Seed Brokers
    const brokerCount = await Broker.countDocuments();
    if (brokerCount === 0) {
      const brokerDocs = SEED_BROKERS.map(b => ({
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
      }));
      await Broker.insertMany(brokerDocs);
      console.log('🌱 Seeded default MongoDB Brokers');
    }

    // 3. Seed Bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      const bookingDocs = INITIAL_BOOKINGS.map(b => ({
        id: b.id,
        brokerId: b.brokerId,
        brokerName: b.brokerName,
        customerId: b.customerId,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        serviceCategory: b.serviceCategory || (b.serviceCategories ? b.serviceCategories.join(', ') : 'Electrician'),
        serviceCategories: b.serviceCategories || [b.serviceCategory || 'Electrician'],
        workersCount: b.workersCount,
        workDate: b.workDate,
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
      }));
      await Booking.insertMany(bookingDocs);
      console.log('🌱 Seeded default MongoDB Bookings');
    }

    // 4. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      const reviewDocs = INITIAL_REVIEWS.map(r => ({
        id: r.id,
        brokerId: r.brokerId,
        bookingId: r.bookingId || 'BK-1001',
        rating: r.rating,
        comment: r.comment,
        customerName: r.customerName
      }));
      await Review.insertMany(reviewDocs);
      console.log('🌱 Seeded default MongoDB Reviews');
    }
  } catch (err: any) {
    console.warn('⚠️ MongoDB Seed Notice:', err.message);
  }
}
