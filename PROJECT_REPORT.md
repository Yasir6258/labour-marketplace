# LABOUR.COM – SKILLED LABOUR MARKETPLACE PLATFORM

---

## Chapter 1 – Introduction

### 1.1 Background
In developing nations like Bangladesh, the informal manual and technical labour sector employs millions of skilled artisans, electricians, plumbers, masons, carpenters, painters, and general construction workers. Despite the high demand from households, contractors, and businesses, hiring daily-wage labour remains heavily disorganized. Traditional hiring relies on informal street corners ("Labour Haat") or unverified local intermediaries. This results in wage exploitation for workers, lack of safety compliance, zero accountability for work quality, and significant transaction friction for customers. The **Labour.com Marketplace Platform** bridges this gap by offering a transparent, digitalized, multi-broker marketplace connecting customers with verified labour agencies across all 8 administrative divisions of Bangladesh.

### 1.2 Problem Statement
Finding verified, skilled, and reliable daily or contractual labourers on demand is extremely difficult for individuals and enterprises. Existing informal practices suffer from several critical shortcomings:
1. **Lack of Transparency & Wage Gouging:** Customers often encounter arbitrary price inflation, while labourers are frequently underpaid by unregistered intermediaries.
2. **Absence of Quality & Safety Accountability:** No formal mechanisms exist to track worker credibility, skill certifications, or safety adherence.
3. **High Financial Risk & Payment Disputes:** Informal cash transactions leave both parties vulnerable to unfulfilled jobs, sudden cancellations, or non-payment.
4. **Geographical Inefficiencies:** Customers outside metropolitan areas struggle to discover organized labor pools in their respective districts and upazilas.

The **Labour.com Skilled Labour Marketplace** addresses these challenges by providing a modern web platform featuring verified broker profiles with blue-tick trust badges, standard daily market rates, multi-worker selection, a fixed ৳500 dual-escrow deposit guarantee, dynamic bilingual support (Bengali & English), and AI-driven project budgeting and automated legal contract generation.

### 1.3 Objectives
● Connect customers with verified labour agencies across all 8 divisions of Bangladesh  
● Provide dynamic multi-worker booking with transparent daily rate calculations  
● Implement a ৳500 deposit escrow system to protect both customers and service providers  
● Generate AI-powered project cost estimations and automated digital labour contracts  
● Deliver a smart AI assistant chatbot and automated dispute/fraud prevention guard  
● Enable full bilingual localization (English ⇄ বাংলা) for national accessibility  
● Provide dedicated Role-Based Access Control (RBAC) dashboards for Admins, Brokers, and Customers  

### 1.4 Scope
● User Authentication & Role-Based Access Control (Admin, Broker, Customer)  
● 8-Division Geolocation Filtering & 8 Trade Categories Search  
● Agency / Broker Profile Showcase & Worker Card Lists  
● Multi-Worker Dynamic Booking Workflow  
● Multi-Channel Digital Payment Gateway (bKash, Nagad, Rocket, Card)  
● AI Cost Estimator & Automated Digital Contract Generator  
● Smart AI Chatbot Assistant & Fraud Dispute Guard  
● Agency Blue-Tick Auto-Verification Engine  
● Customer Reviews, Star Ratings & Admin Moderation  
● Cloud Deployment on Netlify (Frontend) and Render (Backend)  

---

## Chapter 2 – Software Requirement Specification

Software Requirement Specification (SRS) defines the functional and non-functional requirements of the **Labour.com Marketplace Platform**. It describes what the system should do, including user authentication, agency listings, multi-worker booking flows, payment processing, AI integration, and administrative controls. The SRS serves as a blueprint for developers, designers, and testers throughout the project. It ensures that all stakeholders have a clear understanding of the project's goals and expected features. A well-prepared SRS helps reduce development errors and improves software quality.

### Functional Requirements
● User Registration & Role Selection (Customer, Broker, Admin)  
● Secure Login & JWT-based Session Management  
● Role-Based Dashboard Routing & Authorization  
● 8-Division & 64-District Geolocation Filtering  
● 8 Trade Categories Navigation with Standard Market Rates  
● Broker Profile Management & Worker Team Showcase  
● Multi-Worker Category Increment Booking Modal  
● Automatic ৳500 Deposit Escrow Calculation  
● Simulated Multi-Channel Payment Processing (bKash, Nagad, Rocket, Card)  
● AI Project Budget & Scope Estimation  
● AI Digital Labour Contract Generator  
● AI Chatbot Customer Support Assistant  
● AI Fraud Guard & Booking Anomaly Detector  
● Customer Feedback, Star Ratings & Review Submission  
● Admin Agency Moderation, Blue-Tick Verification & Compliance Warnings  
● 1-Click English ⇄ Bengali Bilingual Switch  

### Non-Functional Requirements
● Responsive UI across Mobile, Tablet, and Desktop  
● Fast Response Time (< 200ms API latency)  
● Secure Authentication & Password Hashing (bcrypt)  
● Dual Escrow Financial Integrity & Safety  
● Scalable Decoupled Architecture (Next.js + Express REST API)  
● High Availability (99.9% uptime on Netlify & Render)  
● Data Integrity & Schema Validation via Mongoose ODM  
● Clean Codebase & Maintainability with TypeScript & Modular Architecture  

### User Stories
**Example 1 (Customer):**  
*As a customer, I want to search for verified electrical and masonry agencies in Chittagong division and book 2 electricians with a secured ৳500 deposit so that I can get guaranteed on-time home wiring.*

**Example 2 (Broker / Agency):**  
*As a labour agency broker, I want to showcase my verified worker roster, daily wage rates, and trade specialties so that I can receive direct hiring orders and manage team schedules.*

**Example 3 (Admin):**  
*As a platform administrator, I want to monitor all active bookings, audit escrow deposits, verify broker blue-tick credentials, and issue warnings to policy-violating agencies.*

### Business Rules
● Customers must pay a fixed ৳500 deposit into platform escrow to confirm a multi-worker booking.  
● Agencies automatically qualify for a "Verified Blue-Tick Badge" upon completing ≥ 5 jobs with an average rating ≥ 4.5 and managing ≥ 3 workers.  
● Bookings can only transition through authorized sequential states: `requested` ➔ `accepted` ➔ `in_progress` ➔ `completed` / `cancelled`.  
● Customers can only review and rate agencies after a booking status reaches `completed`.  
● All financial transactions and contract generations are logged with immutable audit timestamps.  

---

## Chapter 3 – System Design

System Design describes the overall structure and architecture of the **Labour.com Marketplace Platform**. It illustrates how the frontend, backend, database, and AI service interact to deliver the required functionalities. The design includes system architecture, database schema, API structure, and UML diagrams to ensure a scalable, secure, and maintainable application. A well-designed system improves performance, simplifies future enhancements, and supports efficient software development.

### Technology Stack

#### Frontend
● Next.js (App Router Architecture)  
● TypeScript  
● Vanilla CSS & Custom Design System Tokens  
● Lucide React Icons  
● React Context API (State Management: `AuthContext`, `LanguageContext`, `DataContext`)  
● Fetch API / REST Client  

#### Backend
● Node.js  
● Express.js (RESTful API Microservice)  
● CORS & Helmet Security Middleware  
● JSON Web Token (JWT) & bcrypt.js  

#### Database
● MongoDB Atlas (Cloud NoSQL Database)  
● Mongoose ODM (Schema Validation & Models)  

#### AI & Intelligent Services
● AI Labour Rate Estimation Engine  
● AI Legal Labour Contract Generator  
● Rule-Based AI Chatbot Assistant  
● AI Fraud Guard & Booking Anomaly Analysis  

---

### System Architecture

```
User (Browser / Mobile)
        ↓
Next.js Frontend (Netlify CDN / SSR)
        ↓
Express.js REST API (Render Cloud Service)
        ↓
JWT & Role-Based Access Control (RBAC)
        ↓
AI Services (Estimator, Contract Gen, Fraud Guard)
        ↓
MongoDB Atlas Cloud Database (Mongoose ODM)
```

---

### Database Collections / Tables
● **Users:** User credentials, profile names, emails, roles (`customer`, `broker`, `admin`), timestamps.  
● **Brokers:** Agency names, phone numbers, divisions, districts, address, experience, rating, worker lists, blue-tick verification status.  
● **Bookings:** Customer ID, broker ID, required trades & worker counts, booking date, address, deposit amount (৳500), total estimated wage, status (`requested`, `accepted`, `in_progress`, `completed`, `cancelled`), escrow details.  
● **Reviews:** Booking ID, broker ID, customer name, rating (1-5 stars), review comment, timestamp.  

---

### ER & Schema Diagram

```
+------------------+         1 : N         +-------------------+
|      USERS       | --------------------> |     BOOKINGS      |
|------------------|                       |-------------------|
| _id (PK)         |                       | _id (PK)          |
| name             |                       | customerId (FK)   |
| email            |                       | brokerId (FK)     |
| password         |                       | tradeDetails []   |
| role             |                       | date, address     |
| phone            |                       | depositPaid (500) |
+------------------+                       | status            |
         | 1                               +-------------------+
         |                                           | 1
         | 1                                         |
         v                                           v 1
+------------------+         1 : N         +-------------------+
|     BROKERS      | --------------------> |      REVIEWS      |
|------------------|                       |-------------------|
| _id (PK)         |                       | _id (PK)          |
| userId (FK)      |                       | brokerId (FK)     |
| agencyName       |                       | customerName      |
| division         |                       | rating (1-5)      |
| district         |                       | comment           |
| workers []       |                       | createdAt         |
| isVerified       |                       +-------------------+
| rating           |
+------------------+
```

---

### UML Diagrams
● **Use Case Diagram:** Customer (Search, Book, Pay, Review), Broker (Manage Workers, Accept/Decline Bookings), Admin (Verify Agencies, Audit Escrow, Moderate System).  
● **Class Diagram:** Class models for User, Broker, Worker, Booking, Payment, Review, and AIService.  
● **Activity Diagram:** Step-by-step workflow from searching workers, configuring team sizes, paying ৳500 deposit, job execution, to rating submission.  
● **Sequence Diagram:** Interaction lifecycle between Customer Browser ➔ Next.js Client ➔ Express API ➔ MongoDB Atlas ➔ Escrow Gateway.  

---

## Chapter 4 – System Implementation

System Implementation explains how the **Labour.com Marketplace Platform** is developed using the selected technologies and software architecture. It covers the implementation of the frontend, backend, database, authentication, and AI integration to ensure all system requirements are met. This phase transforms the system design into a fully functional web application with secure, scalable, and user-friendly features. Proper implementation ensures reliable performance, maintainability, and successful deployment.

### Frontend Modules
● **Responsive Landing Page:** Search bar, division selectors, trade categories, verified agency cards.  
● **Authentication Pages:** Dual-role login and registration (`/auth/login`, `/auth/register`).  
● **Role-Specific Dashboards:**  
  - Admin Dashboard (`/dashboard/admin`): Metrics, verification toggles, warning dispatch.  
  - Broker Dashboard (`/dashboard/broker`): Booking request management, worker availability.  
  - Customer Dashboard (`/dashboard/customer`): Booking status tracking, receipt invoices.  
● **Agency Profile Client (`/brokers/[id]`):** Worker roster cards, daily pricing chips, bookmark toggle.  
● **Interactive Modals:**  
  - Multi-Worker Booking Modal (`BookingModal.tsx`)  
  - Simulated bKash/Nagad/Rocket Payment Modal (`PaymentModal.tsx`)  
  - Customer Review & Star Rating Modal (`ReviewModal.tsx`)  
  - AI Cost Estimator Modal (`AIEstimatorModal.tsx`)  
  - AI Digital Contract Generator Modal (`AIContractModal.tsx`)  
  - Smart Assistant Chatbot Widget (`AIChatbot.tsx`)  

---

### Backend REST APIs
● `POST /api/auth/register` – Register customer or broker account  
● `POST /api/auth/login` – Authenticate user and issue signed JWT session  
● `GET  /api/brokers` – Fetch all agencies with optional division/trade query filters  
● `GET  /api/brokers/:id` – Fetch single broker profile and worker roster  
● `POST /api/bookings` – Create new multi-worker booking with ৳500 deposit  
● `GET  /api/bookings` – Retrieve role-filtered bookings for dashboard  
● `POST /api/payments` – Process simulated digital payments (bKash/Nagad/Card)  
● `POST /api/reviews` – Submit agency rating and feedback  
● `GET  /api/reviews` – Retrieve agency reviews and calculate average rating score  

---

### Core Code Implementations & Snippets

#### 1. AI Labour Cost Estimator & Contract Generator
The core algorithmic intelligence for project wage estimation and automated digital contract generation resides in `frontend/lib/ai/aiService.ts`.

```typescript
// File: frontend/lib/ai/aiService.ts
export interface CostEstimateParams {
  category: string;
  workerCount: number;
  durationDays: number;
  division: string;
  projectComplexity: 'Simple' | 'Standard' | 'Complex';
}

export function calculateAIEstimate(params: CostEstimateParams) {
  const baseRates: Record<string, number> = {
    Electrician: 900,
    Plumber: 850,
    Mason: 950,
    Carpenter: 800,
    Painter: 750,
    Welder: 1000,
    Driver: 700,
    Labourer: 600,
  };

  const dailyRate = baseRates[params.category] || 700;
  const complexityMultiplier = 
    params.projectComplexity === 'Complex' ? 1.25 : 
    params.projectComplexity === 'Simple' ? 0.9 : 1.0;

  const estimatedTotal = Math.round(
    dailyRate * params.workerCount * params.durationDays * complexityMultiplier
  );
  const deposit = 500;
  const balance = estimatedTotal - deposit;

  return {
    dailyRate,
    estimatedTotal,
    deposit,
    balance,
    estimatedHours: params.durationDays * 8,
  };
}
```

---

#### 2. Multi-Worker Booking Modal & ৳500 Escrow Logic
Handling dynamic multi-category worker allocations and automatic ৳500 deposit calculation in `frontend/components/modals/BookingModal.tsx`:

```tsx
// File: frontend/components/modals/BookingModal.tsx
const handleWorkerCountChange = (trade: string, delta: number) => {
  setSelectedTrades(prev => {
    const current = prev[trade] || 0;
    const updated = Math.max(0, current + delta);
    return { ...prev, [trade]: updated };
  });
};

const totalWorkerCount = Object.values(selectedTrades).reduce((a, b) => a + b, 0);
const fixedDepositBDT = 500;

const handleConfirmBooking = async () => {
  const payload = {
    brokerId: broker._id,
    customerId: user?.id,
    trades: selectedTrades,
    totalWorkers: totalWorkerCount,
    bookingDate,
    locationAddress,
    depositAmount: fixedDepositBDT,
    status: 'requested',
  };
  await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};
```

---

#### 3. Role-Based Access Control (RBAC) Authentication
User session management and role-based permissions are enforced via React Context in `frontend/lib/context/AuthContext.tsx`:

```typescript
// File: frontend/lib/context/AuthContext.tsx
export type UserRole = 'customer' | 'broker' | 'admin';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Dynamic role-based redirection
    if (userData.role === 'admin') router.push('/dashboard/admin');
    else if (userData.role === 'broker') router.push('/dashboard/broker');
    else router.push('/dashboard/customer');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

#### 4. Express Server & Cloud Security Pipeline
The backend microservice pipeline in `backend/server.js` configured with Helmet, CORS, and MongoDB Atlas connectivity:

```javascript
// File: backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Cloud Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas Connected successfully'))
  .catch(err => console.error('DB Connection Error:', err));

// API Route Mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/brokers', require('./routes/brokers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

#### 5. Bilingual Localization (English ⇄ বাংলা)
Dynamic bilingual switching across UI components using dictionary tokens in `frontend/lib/i18n/translations.ts`:

```typescript
// File: frontend/lib/i18n/translations.ts
export const translations = {
  en: {
    heroTitle: "Find Verified Skilled Labour in Bangladesh",
    heroSubtitle: "Book verified electricians, plumbers, masons and workers with ৳500 escrow protection.",
    searchBtn: "Search Agencies",
    depositNotice: "Fixed ৳500 deposit required to secure booking.",
  },
  bn: {
    heroTitle: "বাংলাদেশে বিশ্বস্ত ও দক্ষ শ্রমিক খুঁজে নিন",
    heroSubtitle: "৳৫০০ জামানত সুরক্ষায় যাচাইকৃত ইলেকট্রিশিয়ান, প্লাম্বার ও রাজমিস্ত্রি বুক করুন।",
    searchBtn: "এজেন্সি খুঁজুন",
    depositNotice: "বুকিং নিশ্চিত করতে নির্ধারিত ৳৫০০ জামানত প্রযোজ্য।",
  }
};
```

---

## Chapter 5 – Security, Testing & Deployment

Security, Testing & Deployment ensures that the **Labour.com Marketplace Platform** is secure, reliable, and ready for real-world use. Security features such as JWT authentication, password hashing, dual escrow protection, input validation, and HTTP security headers protect the application from common vulnerabilities. Testing verifies system functionality, API performance, and data consistency. Finally, the application is deployed on cloud platforms, making it accessible, scalable, and easy to maintain.

### Security
● **JWT Authentication:** Secure signed tokens for authenticated API sessions.  
● **Password Hashing:** Bcrypt cryptographic hashing with salt rounds.  
● **Role-Based Authorization:** Strict route guards separating Admin, Broker, and Customer privileges.  
● **Dual-Escrow Guarantee:** Transparent ৳500 deposit locking mechanism preventing unilateral fund misappropriation.  
● **HTTP Protection:** Helmet security headers and CORS domain whitelisting.  
● **Input Validation & Sanitization:** Strict payload validation preventing NoSQL injection.  
● **Environment Variable Protection:** Sensitive credentials (Atlas URI, JWT Secret) secured in cloud configs.  

### Testing
● **Tools:** Jest, Supertest, React Testing Library  
● **Coverage:**  
  - Unit Tests for AI Estimation & Contract Algorithms  
  - REST API Route Tests (Auth, Brokers, Bookings, Payments)  
  - RBAC Middleware & Dashboard Route Guard Tests  
  - Multi-Worker Counter & Escrow Deposit Calculation Tests  
● **Target Coverage:** **85%**  

### Deployment

#### Frontend
● **Platform:** **Netlify**  
● **Configuration:** `netlify.toml` with `@netlify/plugin-nextjs` and Global Edge CDN caching.  

#### Backend
● **Platform:** **Render**  
● **Configuration:** `render.yaml` infrastructure-as-code deploying Node.js Express server on Port 10000.  

#### Database
● **Platform:** **MongoDB Atlas** (Cloud Replica Set Database).  

---

## Chapter 6 – Conclusion

The **Labour.com Marketplace Platform** modernizes the manual and skilled labour industry in Bangladesh by transforming informal street-side hiring into an organized, transparent, and verified digital ecosystem. By integrating 8-division geolocation search, dynamic multi-worker booking, a ৳500 dual-escrow deposit model, full bilingual accessibility (Bangla & English), and AI-driven budgeting and automated labour contracts, the platform protects both clients and hardworking labourers. The decoupled Next.js and Express architecture ensures high scalability, security, and top-tier user experience.

### Future Work
● **Native Mobile Application:** Developing React Native Android and iOS mobile apps.  
● **GPS Real-Time Worker Tracking:** Live location tracking for onsite labour dispatch.  
● **Biometric & Government NID Verification:** Automated NID API integration for instant agency KYC.  
● **Smart Contract Blockchain Escrow:** Decentralized smart contracts for automated milestone release.  
● **Bangla Voice-Based Search:** Voice recognition for non-tech-savvy users and labourers.  
● **Worker Insurance Protection:** Integrated micro-insurance coverage for accidental workplace hazards.  

---

## References

1. **Next.js Documentation:** https://nextjs.org/docs  
2. **Express.js API Reference:** https://expressjs.com/  
3. **MongoDB Atlas & Mongoose ODM:** https://mongoosejs.com/  
4. **JWT (JSON Web Tokens) Standard:** https://jwt.io/  
5. **Netlify Deployment Documentation:** https://docs.netlify.com/  
6. **Render Cloud Platform Guide:** https://render.com/docs  
7. **React Context & Hooks Guide:** https://react.dev/  
8. **Bangladesh Bureau of Statistics (Labour Force Survey):** http://www.bbs.gov.bd/  
