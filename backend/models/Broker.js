const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  skillCategory: { type: String, required: true },
  dailyRate: { type: Number, required: true },
  phone: { type: String, default: '' },
  status: { type: String, enum: ['Available', 'Assigned'], default: 'Available' }
});

const BrokerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  verified: { type: Boolean, default: true },
  activeWorkersCount: { type: Number, default: 5 },
  totalJobsCompleted: { type: Number, default: 10 },
  location: {
    division: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String, required: true }
  },
  services: [{
    category: { type: String, required: true },
    ratePerDay: { type: Number, required: true },
    availableWorkers: { type: Number, default: 1 }
  }],
  workersList: [WorkerSchema],
  status: { type: String, enum: ['active', 'warned', 'restricted'], default: 'active' },
  warningMessage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Broker || mongoose.model('Broker', BrokerSchema);
