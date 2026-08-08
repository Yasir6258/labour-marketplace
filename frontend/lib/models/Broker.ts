import mongoose, { Schema, Document } from 'mongoose';

export interface IBroker extends Document {
  id: string;
  name: string;
  phone: string;
  nidPassport: string;
  tradeLicenseNumber?: string;
  rating: number;
  verified: boolean;
  activeWorkersCount: number;
  totalJobsCompleted: number;
  location: {
    division: string;
    district: string;
    area: string;
  };
  services: {
    category: string;
    ratePerDay: number;
    availableWorkers: number;
  }[];
  workersList: {
    id: string;
    name: string;
    skillCategory: string;
    dailyRate: number;
    phone: string;
    status: 'Available' | 'Assigned' | 'OnLeave';
  }[];
  createdAt: Date;
}

const BrokerSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  nidPassport: { type: String, default: '' },
  tradeLicenseNumber: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  verified: { type: Boolean, default: false },
  activeWorkersCount: { type: Number, default: 0 },
  totalJobsCompleted: { type: Number, default: 0 },
  location: {
    division: { type: String, default: 'Dhaka' },
    district: { type: String, default: 'Dhaka' },
    area: { type: String, default: 'Mirpur' }
  },
  services: [
    {
      category: { type: String, required: true },
      ratePerDay: { type: Number, required: true },
      availableWorkers: { type: Number, required: true }
    }
  ],
  workersList: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      skillCategory: { type: String, required: true },
      dailyRate: { type: Number, required: true },
      phone: { type: String, default: '' },
      status: { type: String, enum: ['Available', 'Assigned', 'OnLeave'], default: 'Available' }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Broker || mongoose.model<IBroker>('Broker', BrokerSchema);
