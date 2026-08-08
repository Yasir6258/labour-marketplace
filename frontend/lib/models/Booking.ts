import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  id: string;
  brokerId: string;
  brokerName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceCategory?: string;
  serviceCategories?: string[];
  workersCount: number;
  workDate: string;
  customAgreedAmount: number;
  finalAmount: number;
  advanceDeposit: number;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  escrowStatus: 'Held' | 'ReleasedToBroker' | 'Refunded' | 'PendingFinalPayment';
  brokerWorkDoneStatus: 'NotSubmitted' | 'Requested';
  customerWorkDoneStatus: 'NotSubmitted' | 'Confirmed';
  customerRating?: number;
  customerComment?: string;
  details?: string;
  locationDetails?: string;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  brokerId: { type: String, required: true },
  brokerName: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  serviceCategory: { type: String },
  serviceCategories: [{ type: String }],
  workersCount: { type: Number, required: true },
  workDate: { type: String, required: true },
  customAgreedAmount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  advanceDeposit: { type: Number, default: 500 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'], default: 'Confirmed' },
  escrowStatus: { type: String, enum: ['Held', 'ReleasedToBroker', 'Refunded', 'PendingFinalPayment'], default: 'Held' },
  brokerWorkDoneStatus: { type: String, enum: ['NotSubmitted', 'Requested'], default: 'NotSubmitted' },
  customerWorkDoneStatus: { type: String, enum: ['NotSubmitted', 'Confirmed'], default: 'NotSubmitted' },
  customerRating: { type: Number },
  customerComment: { type: String },
  details: { type: String },
  locationDetails: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
