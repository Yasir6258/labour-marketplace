const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Broker = require('./models/Broker');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Root status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Labour.com Express Backend API',
    database: 'MongoDB Atlas Cloud',
    liveDocs: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login'],
      brokers: ['GET /api/brokers', 'GET /api/brokers/:id', 'POST /api/brokers'],
      bookings: ['GET /api/bookings', 'POST /api/bookings', 'PUT /api/bookings/:id'],
      reviews: ['GET /api/reviews', 'POST /api/reviews']
    }
  });
});

// Seed data if database is fresh
const INITIAL_BROKERS = [
  {
    id: 'b1',
    name: 'Mirpur Labour & Technical Service',
    phone: '+880 1711-889922',
    rating: 4.8,
    verified: true,
    activeWorkersCount: 9,
    totalJobsCompleted: 156,
    location: { division: 'Dhaka', district: 'Dhaka', area: 'Mirpur' },
    services: [
      { category: 'Electrician', ratePerDay: 1000, availableWorkers: 3 },
      { category: 'Plumber', ratePerDay: 1050, availableWorkers: 2 },
      { category: 'Mason', ratePerDay: 1200, availableWorkers: 2 },
      { category: 'Labourer', ratePerDay: 600, availableWorkers: 2 }
    ]
  },
  {
    id: 'b2',
    name: 'Agrabad Manpower & Builders Agency',
    phone: '+880 1812-334455',
    rating: 4.9,
    verified: true,
    activeWorkersCount: 14,
    totalJobsCompleted: 240,
    location: { division: 'Chittagong', district: 'Chittagong', area: 'Agrabad' },
    services: [
      { category: 'Electrician', ratePerDay: 950, availableWorkers: 4 },
      { category: 'Plumber', ratePerDay: 1000, availableWorkers: 3 },
      { category: 'Carpenter', ratePerDay: 1100, availableWorkers: 3 },
      { category: 'Driver', ratePerDay: 1200, availableWorkers: 4 }
    ]
  },
  {
    id: 'b3',
    name: 'Uttara Expert Technical Trades',
    phone: '+880 1913-445566',
    rating: 4.7,
    verified: true,
    activeWorkersCount: 8,
    totalJobsCompleted: 98,
    location: { division: 'Dhaka', district: 'Dhaka', area: 'Uttara' },
    services: [
      { category: 'Painter', ratePerDay: 900, availableWorkers: 3 },
      { category: 'Welder', ratePerDay: 1300, availableWorkers: 2 },
      { category: 'Labourer', ratePerDay: 650, availableWorkers: 3 }
    ]
  }
];

// Seed on startup if collection is empty
Broker.countDocuments().then(count => {
  if (count === 0) {
    Broker.insertMany(INITIAL_BROKERS)
      .then(() => console.log('✅ Seeded initial brokers in MongoDB Atlas'))
      .catch(err => console.error('Seeding error:', err));
  }
});

// Users Auth API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, role, phone } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { id: `u_${Date.now()}`, name, email, role: role || 'customer', phone: phone || '' } },
      { upsert: true, new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        id: `u_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'customer'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Brokers API
app.get('/api/brokers', async (req, res) => {
  try {
    const brokers = await Broker.find();
    res.json({ success: true, data: brokers.length > 0 ? brokers : INITIAL_BROKERS });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/brokers/:id', async (req, res) => {
  try {
    const broker = await Broker.findOne({ id: req.params.id }) || INITIAL_BROKERS.find(b => b.id === req.params.id);
    if (!broker) return res.status(404).json({ success: false, message: 'Broker not found' });
    res.json({ success: true, data: broker });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/brokers', async (req, res) => {
  try {
    const broker = await Broker.create(req.body);
    res.json({ success: true, data: broker });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Bookings API
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    if (req.body.syncBatch && Array.isArray(req.body.syncBatch)) {
      for (const b of req.body.syncBatch) {
        await Booking.findOneAndUpdate({ id: b.id }, { $set: b }, { upsert: true, new: true });
      }
      return res.json({ success: true, message: 'Batch synchronized' });
    }
    const booking = await Booking.create(req.body);
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Reviews API
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
  console.log(`🚀 Express Backend Server running on port ${PORT}`);
});
