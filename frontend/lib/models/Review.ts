import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  id: string;
  brokerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  customerName: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  brokerId: { type: String, required: true },
  bookingId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  customerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
