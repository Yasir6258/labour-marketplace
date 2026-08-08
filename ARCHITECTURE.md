# Labour.com - Full-Stack Architecture Directory Structure

This project follows the official **Next.js 16 App Router Full-Stack Architecture**, where **Frontend (UI)** and **Backend (API Routes & Database Models)** are modularly structured within a single unified workspace.

---

## 🎨 1. FRONTEND LAYER (UI Pages & Components)

```
tools P20/
├── app/                        # Next.js App Router (Frontend Pages)
│   ├── page.tsx                # Home Page (Search, Categories, Featured Brokers)
│   ├── auth/                   # Authentication UI Pages
│   │   ├── login/page.tsx      # Multi-Role Login Interface
│   │   └── register/page.tsx   # User Registration Interface
│   ├── brokers/
│   │   └── [id]/page.tsx       # Broker Profile & Worker Inventory Detail Page
│   ├── dashboard/              # Role-Based Dashboard Portals
│   │   ├── admin/page.tsx      # Master Admin Dashboard (Dual Approvals & Finance)
│   │   ├── broker/page.tsx     # Broker Agency Dashboard (Roster & Rates)
│   │   └── customer/page.tsx   # Customer Portal (Bookings & Refund Policy)
│   └── globals.css             # Tailwind CSS & Dark Glassmorphism Styling System
│
├── components/                 # React UI Components
│   ├── cards/                  # Broker & Worker Profile Cards
│   ├── navigation/             # Navbar & Footer Components
│   ├── modals/                 # BookingModal, ReviewModal, PaymentModal
│   └── ai/                     # AI Assistant, Estimator & Contract Modals
│
└── lib/context/                # React State Management & Context Providers
    ├── DataContext.tsx         # Realtime Booking & MongoDB Sync State
    ├── AuthContext.tsx         # Authentication & User Role State
    └── LanguageContext.tsx     # Bilingual (Bangla/English) Translation State
```

---

## 🍃 2. BACKEND LAYER (API Routes, Database Models & Controllers)

```
tools P20/
├── app/api/                    # RESTful Backend API Endpoints
│   ├── auth/
│   │   ├── register/route.ts   # User Registration MongoDB Sync API
│   │   └── login/route.ts      # User Authentication API
│   ├── bookings/route.ts       # Booking Creation, Update & Sync API
│   ├── brokers/                # Broker Data & Individual Roster APIs
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── reviews/route.ts        # Customer Rating & Review Handler API
│   └── payments/route.ts       # Escrow Payment Disbursement API
│
├── lib/models/                 # MongoDB Mongoose Data Schemas & Models
│   ├── User.ts                 # User Schema (Admin, Broker, Customer)
│   ├── Broker.ts               # Broker Agency & Worker Roster Schema
│   ├── Booking.ts              # Booking, Escrow & Dual Approval Schema
│   └── Review.ts               # Star Rating & Review Schema
│
└── lib/                        # Backend Database Connection & Seeders
    ├── mongodb.ts              # MongoDB Atlas Cloud Connection Singleton
    └── dbSeed.ts               # Database Initial Seeder
```

---

## 🛠️ 3. CONFIGURATION & SCRIPTS

```
tools P20/
├── .env.local                  # Environment Variables (MongoDB Atlas Connection URI)
├── .env.example                # Environment Template for Deployment
├── scripts/test_atlas.ts       # Live MongoDB Connection Test Script
├── next.config.ts              # Next.js Framework Configuration
├── package.json                # Project Dependencies & Scripts
└── tsconfig.json               # TypeScript Compiler Configuration
```
