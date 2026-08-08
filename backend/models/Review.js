const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  brokerId: { type: String, required: true },
  bookingId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  customerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
