export type UserRole = 'admin' | 'broker' | 'customer';

export type DivisionName = 
  | 'Dhaka' 
  | 'Chittagong' 
  | 'Sylhet' 
  | 'Khulna' 
  | 'Rajshahi' 
  | 'Barisal' 
  | 'Rangpur' 
  | 'Mymensingh';

export interface Location {
  division: DivisionName;
  district: string;
  upazila: string;
}

export interface Worker {
  id: string;
  brokerId: string;
  name: string;
  category: string;
  phone?: string;
  hourlyRate: number; // in BDT (৳)
  dailyRate: number;  // in BDT (৳)
  experienceYears: number;
  available: boolean;
  rating?: number;
  avatarSvg?: string;
}

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  iconName: string;
  descriptionEn: string;
  descriptionBn: string;
}

export type AccountStatus = 'active' | 'warned' | 'restricted';

export interface BrokerProfile {
  id: string;
  userId: string;
  name: string;
  nameBn?: string;
  photoUrl?: string;
  avatarSvg?: string;
  location: Location;
  phone: string;
  email: string;
  verified: boolean;
  servicesOffered: string[]; // Category IDs or names
  workerCount: number;
  workers: Worker[];
  ratingAvg: number;
  reviewCount: number;
  bioEn?: string;
  bioBn?: string;
  joinedDate: string;
  totalJobsCompleted: number;
  status: AccountStatus;
  warningMessage?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: Location;
  profilePhoto?: string;
  brokerId?: string; // If user is a broker
  status?: AccountStatus;
  warningMessage?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type DepositMode = 'refundable' | 'fee';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  brokerId: string;
  brokerName: string;
  brokerLocation: string;
  serviceCategory: string;
  serviceCategories?: string[]; // Multiple service categories selection
  serviceBreakdown?: { category: string; count: number }[]; // Per-service worker quantity breakdown
  workersCount: number;
  details: string;
  workDate: string;
  address: string;
  status: BookingStatus;
  depositPaid: boolean;
  depositAmount: number; // 500 BDT
  depositMode: DepositMode;
  depositRefunded: boolean;
  refundIssuedBy?: 'Broker' | 'LabourPlatform' | 'None'; // Who issued the ৳500 refund
  customerConfirmedDeal?: boolean; // Customer accepted broker's offer
  customerRejectedDeal?: boolean;  // Customer disliked/rejected broker's offer
  customAgreedAmount?: number;     // Customer specified agreed rate (e.g. ৳3,500)
  paymentRequestStatus?: 'NotRequested' | 'RequestedToAdmin' | 'ApprovedByAdmin' | 'PaidByCustomer';
  finalAmount?: number;            // e.g. 3500 negotiated total
  finalPaid: boolean;
  escrowStatus: 'Held' | 'Refunded' | 'ReleasedToBroker' | 'PendingFinalPayment';
  brokerWorkDoneStatus?: 'NotSubmitted' | 'Requested';
  customerWorkDoneStatus?: 'NotSubmitted' | 'Confirmed';
  customerRating?: number;
  customerComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  brokerId: string;
  type: 'deposit' | 'final';
  amount: number;
  currency: 'BDT';
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'Bank';
  transactionId: string;
  status: 'Paid' | 'Refunded' | 'Released';
  timestamp: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  brokerId: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Favorite {
  id: string;
  customerId: string;
  brokerId: string;
}

export interface PlatformMetrics {
  totalBrokers: number;
  totalCustomers: number;
  totalWorkers: number;
  totalBookings: number;
  escrowVolumeBDT: number;
  bookingsByDivision: Record<DivisionName, number>;
  depositMode: DepositMode;
}
