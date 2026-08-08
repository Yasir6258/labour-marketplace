'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrokerProfile, Booking, Review, Worker, DepositMode } from '../types';
import { SEED_BROKERS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from '../data/seedData';

interface DataContextType {
  brokers: BrokerProfile[];
  bookings: Booking[];
  reviews: Review[];
  favorites: string[];
  depositMode: DepositMode;
  setDepositMode: (mode: DepositMode) => void;

  // Broker worker management
  addWorker: (brokerId: string, worker: Omit<Worker, 'id' | 'brokerId'>) => void;
  deleteWorker: (brokerId: string, workerId: string) => void;
  updateBrokerProfile: (brokerId: string, profileData: Partial<BrokerProfile>) => void;

  // Admin moderation actions
  issueWarning: (brokerId: string, message: string) => void;
  restrictAccount: (brokerId: string) => void;
  unrestrictAccount: (brokerId: string) => void;

  // Booking lifecycle
  createBooking: (bookingInput: {
    brokerId: string;
    brokerName: string;
    brokerLocation: string;
    serviceCategory: string;
    serviceCategories?: string[];
    serviceBreakdown?: { category: string; count: number }[];
    workersCount: number;
    details: string;
    workDate: string;
    address: string;
    customerName: string;
    customerPhone: string;
  }) => Booking;

  payDeposit: (bookingId: string, paymentMethod: string) => void;
  confirmBookingByBroker: (bookingId: string) => void;
  rejectBookingByCustomer: (bookingId: string) => void;
  setAgreedAmountByCustomer: (bookingId: string, amount: number) => void;
  requestPaymentByBroker: (bookingId: string) => void;
  approvePaymentRequestByAdmin: (bookingId: string) => void;
  payFinalEscrow: (bookingId: string, finalAmount: number, paymentMethod: string) => void;
  submitBrokerWorkDone: (bookingId: string) => void;
  submitCustomerWorkDoneWithReview: (bookingId: string, rating: number, comment: string) => void;
  releaseEscrowPayoutByAdmin: (bookingId: string) => void;
  completeJob: (bookingId: string) => void;

  // Reviews & Favorites
  addReview: (brokerId: string, bookingId: string, rating: number, comment: string, customerName: string) => void;
  toggleFavorite: (brokerId: string) => void;
  isFavorite: (brokerId: string) => boolean;

  // Broker Agency Registration
  addBrokerAgency: (input: {
    name: string;
    phone: string;
    email: string;
    division: string;
    district: string;
    upazila: string;
    servicesOffered: string[];
    workerCount: number;
  }) => BrokerProfile;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brokers, setBrokers] = useState<BrokerProfile[]>(SEED_BROKERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [depositMode, setDepositModeState] = useState<DepositMode>('refundable');

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const savedBrokers = localStorage.getItem('labour_brokers_v4');
      if (savedBrokers) setBrokers(JSON.parse(savedBrokers));

      const savedBookings = localStorage.getItem('labour_bookings');
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedReviews = localStorage.getItem('labour_reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));

      const savedFavs = localStorage.getItem('labour_favs_v2');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedMode = localStorage.getItem('labour_deposit_mode') as DepositMode;
      if (savedMode) setDepositModeState(savedMode);
    } catch (e) {
      console.error('Failed loading saved state', e);
    }
  }, []);

  const saveState = (
    newBrokers = brokers, 
    newBookings = bookings, 
    newReviews = reviews, 
    newFavs = favorites,
    newMode = depositMode
  ) => {
    localStorage.setItem('labour_brokers_v4', JSON.stringify(newBrokers));
    localStorage.setItem('labour_bookings', JSON.stringify(newBookings));
    localStorage.setItem('labour_reviews', JSON.stringify(newReviews));
    localStorage.setItem('labour_favs_v2', JSON.stringify(newFavs));
    localStorage.setItem('labour_deposit_mode', newMode);

    // Asynchronously sync live updates to MongoDB Atlas Cloud database
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${apiBase}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncBatch: newBookings })
      }).catch(err => console.warn('MongoDB Atlas live sync notice:', err));
    } catch (_e) {}
  };

  const setDepositMode = (mode: DepositMode) => {
    setDepositModeState(mode);
    saveState(brokers, bookings, reviews, favorites, mode);
  };

  const addWorker = (brokerId: string, workerData: Omit<Worker, 'id' | 'brokerId'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: `w_${Date.now()}`,
      brokerId
    };

    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        const updatedWorkers = [newWorker, ...b.workers];
        return {
          ...b,
          workers: updatedWorkers,
          workerCount: updatedWorkers.length
        };
      }
      return b;
    });

    setBrokers(updatedBrokers);
    saveState(updatedBrokers);
  };

  const deleteWorker = (brokerId: string, workerId: string) => {
    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        const updatedWorkers = b.workers.filter(w => w.id !== workerId);
        return {
          ...b,
          workers: updatedWorkers,
          workerCount: updatedWorkers.length
        };
      }
      return b;
    });

    setBrokers(updatedBrokers);
    saveState(updatedBrokers);
  };

  const updateBrokerProfile = (brokerId: string, profileData: Partial<BrokerProfile>) => {
    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          ...profileData
        };
      }
      return b;
    });

    setBrokers(updatedBrokers);
    saveState(updatedBrokers);
  };

  // Admin Actions: Issue Warning
  const issueWarning = (brokerId: string, message: string) => {
    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          status: 'warned' as const,
          warningMessage: message
        };
      }
      return b;
    });
    setBrokers(updatedBrokers);
    saveState(updatedBrokers);
  };

  // Admin Actions: Restrict Account
  const restrictAccount = (brokerId: string) => {
    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          status: 'restricted' as const
        };
      }
      return b;
    });
    setBrokers(updatedBrokers);
    saveState(updatedBrokers);
  };

  // Admin Actions: Unrestrict Account
  const unrestrictAccount = (brokerId: string) => {
    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          status: 'active' as const,
          warningMessage: undefined
        };
      }
      return b;
    });
    setBrokers(updatedBrokers);
    saveState(updatedBrokers);
  };

  const createBooking = (input: {
    brokerId: string;
    brokerName: string;
    brokerLocation: string;
    serviceCategory: string;
    serviceCategories?: string[];
    serviceBreakdown?: { category: string; count: number }[];
    workersCount: number;
    details: string;
    workDate: string;
    address: string;
    customerName: string;
    customerPhone: string;
  }): Booking => {
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'cust_1',
      customerName: input.customerName || 'Tanvir Hossain',
      customerPhone: input.customerPhone || '+880 1700-112233',
      brokerId: input.brokerId,
      brokerName: input.brokerName,
      brokerLocation: input.brokerLocation,
      serviceCategory: input.serviceCategory,
      serviceCategories: input.serviceCategories || [input.serviceCategory],
      serviceBreakdown: input.serviceBreakdown,
      workersCount: input.workersCount,
      details: input.details,
      workDate: input.workDate,
      address: input.address,
      status: 'Pending',
      depositPaid: true,
      depositAmount: 500,
      depositMode: depositMode,
      depositRefunded: false,
      refundIssuedBy: 'None',
      paymentRequestStatus: 'NotRequested',
      finalPaid: false,
      escrowStatus: 'Held',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveState(brokers, updated);
    return newBooking;
  };

  const payDeposit = (bookingId: string, _paymentMethod: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          depositPaid: true,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  // Scenario A: Customer accepts deal & Broker confirms -> Broker refunds ৳500
  const confirmBookingByBroker = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Confirmed' as const,
          depositRefunded: true,
          refundIssuedBy: 'Broker' as const,
          customerConfirmedDeal: true,
          escrowStatus: 'PendingFinalPayment' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  // Scenario B: Customer dislikes broker -> Labour.com Platform refunds ৳500
  const rejectBookingByCustomer = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Cancelled' as const,
          depositRefunded: true,
          refundIssuedBy: 'LabourPlatform' as const,
          customerRejectedDeal: true,
          escrowStatus: 'Refunded' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  const addBrokerAgency = (input: {
    name: string;
    phone: string;
    email: string;
    division: string;
    district: string;
    upazila: string;
    servicesOffered: string[];
    workerCount: number;
  }): BrokerProfile => {
    const newId = `b_${Date.now()}`;
    const mockWorkers = Array.from({ length: input.workerCount || 5 }, (_, i) => ({
      id: `w_${newId}_${i + 1}`,
      brokerId: newId,
      name: `Worker ${i + 1} (${input.name.split(' ')[0]})`,
      role: input.servicesOffered[i % input.servicesOffered.length] || 'Labourer',
      category: input.servicesOffered[i % input.servicesOffered.length] || 'Labourer',
      experienceYears: Math.floor(2 + Math.random() * 8),
      hourlyRate: 150 + Math.floor(Math.random() * 100),
      dailyRate: 900 + Math.floor(Math.random() * 500),
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      completedJobs: Math.floor(10 + Math.random() * 40),
      available: true
    }));

    const newBroker: BrokerProfile = {
      id: newId,
      userId: newId,
      name: input.name,
      phone: input.phone,
      email: input.email,
      location: {
        division: input.division as any,
        district: input.district,
        upazila: input.upazila || 'Sadar'
      },
      status: 'active',
      verified: false, // REQ: New brokers start unverified until achievement
      servicesOffered: input.servicesOffered || ['Labourer', 'Electrician', 'Plumber', 'Mason', 'Driver'],
      workers: mockWorkers,
      workerCount: mockWorkers.length,
      ratingAvg: 4.8,
      reviewCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      totalJobsCompleted: 0
    };

    const updated = [newBroker, ...brokers];
    setBrokers(updated);
    saveState(updated, bookings);
    return newBroker;
  };

  const setAgreedAmountByCustomer = (bookingId: string, amount: number) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          customAgreedAmount: amount,
          finalAmount: amount,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  const requestPaymentByBroker = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentRequestStatus: 'RequestedToAdmin' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  const approvePaymentRequestByAdmin = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentRequestStatus: 'ApprovedByAdmin' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  const payFinalEscrow = (bookingId: string, finalAmount: number, _paymentMethod: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          finalAmount,
          finalPaid: true,
          escrowStatus: 'Held' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  const addReview = (
    brokerId: string, 
    bookingId: string, 
    rating: number, 
    comment: string, 
    customerName: string
  ) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      customerId: 'cust_1',
      customerName,
      brokerId,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    const brokerRevs = updatedReviews.filter(r => r.brokerId === brokerId);
    const avg = brokerRevs.reduce((acc, curr) => acc + curr.rating, 0) / brokerRevs.length;

    const updatedBrokers = brokers.map(b => {
      if (b.id === brokerId) {
        return {
          ...b,
          ratingAvg: Number(avg.toFixed(1)),
          reviewCount: brokerRevs.length
        };
      }
      return b;
    });

    setBrokers(updatedBrokers);
    saveState(updatedBrokers, bookings, updatedReviews);
  };

  const submitBrokerWorkDone = (bookingId: string) => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          brokerWorkDoneStatus: 'Requested' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });
    setBookings(updated);
    saveState(brokers, updated);
  };

  const submitCustomerWorkDoneWithReview = (bookingId: string, rating: number, comment: string) => {
    let targetBrokerId: string | null = null;
    let custName = 'Customer';

    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        targetBrokerId = b.brokerId;
        custName = b.customerName;
        return {
          ...b,
          customerWorkDoneStatus: 'Confirmed' as const,
          customerRating: rating,
          customerComment: comment,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });

    setBookings(updated);

    if (targetBrokerId) {
      addReview(targetBrokerId, bookingId, rating, comment, custName);
    } else {
      saveState(brokers, updated);
    }
  };

  const releaseEscrowPayoutByAdmin = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    // STRICT DUAL COMPLETION GUARD: Block payout unless BOTH requests are confirmed
    if (target.brokerWorkDoneStatus !== 'Requested' || target.customerWorkDoneStatus !== 'Confirmed') {
      alert('🔒 Payment Release Locked! Admin cannot disburse funds until BOTH Broker and Customer submit work done confirmation.');
      return;
    }

    completeJob(bookingId);
  };

  const completeJob = (bookingId: string) => {
    let targetBrokerId: string | null = null;

    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        targetBrokerId = b.brokerId;
        return {
          ...b,
          status: 'Completed' as const,
          escrowStatus: 'ReleasedToBroker' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    });

    setBookings(updated);

    // Increment broker's totalJobsCompleted and check verification unlock
    if (targetBrokerId) {
      const updatedBrokers = brokers.map(br => {
        if (br.id === targetBrokerId) {
          const newTotal = (br.totalJobsCompleted || 0) + 1;
          const meetsRating = (br.ratingAvg || 4.8) >= 4.5;
          const meetsWorkers = (br.workers?.length || 0) >= 3;
          const isVerifiedNow = br.verified || (newTotal >= 5 && meetsRating && meetsWorkers);

          return {
            ...br,
            totalJobsCompleted: newTotal,
            verified: isVerifiedNow
          };
        }
        return br;
      });

      setBrokers(updatedBrokers);
      saveState(updatedBrokers, updated);
    } else {
      saveState(brokers, updated);
    }
  };

  const toggleFavorite = (brokerId: string) => {
    let updatedFavs: string[];
    if (favorites.includes(brokerId)) {
      updatedFavs = favorites.filter(id => id !== brokerId);
    } else {
      updatedFavs = [...favorites, brokerId];
    }
    setFavorites(updatedFavs);
    saveState(brokers, bookings, reviews, updatedFavs);
  };

  const isFavorite = (brokerId: string) => favorites.includes(brokerId);

  return (
    <DataContext.Provider
      value={{
        brokers,
        bookings,
        reviews,
        favorites,
        depositMode,
        setDepositMode,
        addWorker,
        deleteWorker,
        updateBrokerProfile,
        issueWarning,
        restrictAccount,
        unrestrictAccount,
        createBooking,
        payDeposit,
        confirmBookingByBroker,
        rejectBookingByCustomer,
        setAgreedAmountByCustomer,
        requestPaymentByBroker,
        approvePaymentRequestByAdmin,
        payFinalEscrow,
        submitBrokerWorkDone,
        submitCustomerWorkDoneWithReview,
        releaseEscrowPayoutByAdmin,
        completeJob,
        addReview,
        toggleFavorite,
        isFavorite,
        addBrokerAgency
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
