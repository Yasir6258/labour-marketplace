/**
 * Labour.com AI Intelligence Engine
 * Provides AI Chatbot reasoning & AI Fair-Price & Duration estimations
 * tailored specifically for Bangladesh local labor market rates (in ৳ BDT).
 */

export interface PriceEstimateInput {
  serviceType: string;
  division: string;
  district: string;
  scopeSize: string; // e.g. '1-2 Rooms', '3-4 Rooms', 'Small Repair', 'Heavy Shifting'
  urgency: 'Standard' | 'Urgent' | 'Emergency';
}

export interface MultiServiceEstimateInput {
  serviceItems: { category: string; count: number }[];
  division: string;
  scopeSize: string;
  urgency: 'Standard' | 'Urgent' | 'Emergency';
}

export interface PriceEstimateResult {
  recommendedWorkers: { category: string; count: number }[];
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedHours: number;
  aiAdviceEn: string;
  aiAdviceBn: string;
}

// Multi-Role AI Price Estimation Logic Engine
export function calculateMultiServiceAIEstimate(input: MultiServiceEstimateInput): PriceEstimateResult {
  const { serviceItems, urgency } = input;
  
  const categoryRates: Record<string, number> = {
    electrician: 1200,
    plumber: 1100,
    mason: 1300,
    driver: 900,
    cleaner: 800,
    painter: 1050,
    labourer: 950
  };

  let totalDailyBaseCost = 0;
  let totalWorkers = 0;
  const categoriesPresent: string[] = [];

  for (const item of serviceItems) {
    const catLower = item.category.toLowerCase();
    const rate = categoryRates[catLower] || 1000;
    totalDailyBaseCost += rate * item.count;
    totalWorkers += item.count;
    categoriesPresent.push(item.category);
  }

  const multiplier = urgency === 'Emergency' ? 1.3 : urgency === 'Urgent' ? 1.15 : 1.0;
  const minCost = Math.round(totalDailyBaseCost * multiplier);
  const maxCost = Math.round(minCost * 1.25);
  const hours = Math.min(24, Math.max(6, Math.round(totalWorkers * 3.5)));

  let adviceEn = `Calculated fair market estimate for ${totalWorkers} total workers (${categoriesPresent.join(', ')}). Daily rates align with Bangladesh Labor Union standards.`;
  let adviceBn = `মোট ${totalWorkers} জন শ্রমিকের (${categoriesPresent.join(', ')}) জন্য বাংলাদেশ শ্রম কমিশন ও স্থানীয় রেট অনুযায়ী সঠিক এস্টিমেট হিসাব করা হয়েছে।`;

  if (categoriesPresent.some(c => c.toLowerCase() === 'electrician')) {
    adviceBn += " ইলেকট্রিক্যাল কাজের ক্ষেত্রে মেইন সুইচ অফ রাখুন।";
    adviceEn += " Turn off main power switches for electrical safety.";
  }

  return {
    recommendedWorkers: serviceItems,
    estimatedCostMin: minCost,
    estimatedCostMax: maxCost,
    estimatedHours: hours,
    aiAdviceEn: adviceEn,
    aiAdviceBn: adviceBn
  };
}

// AI Price Estimation Logic Engine
export function calculateAIPriceEstimate(input: PriceEstimateInput): PriceEstimateResult {
  const { serviceType, scopeSize, urgency } = input;
  let baseRate = 1000;
  let workerBreakdown: { category: string; count: number }[] = [];
  let hours = 8;
  let adviceEn = "";
  let adviceBn = "";

  switch (serviceType.toLowerCase()) {
    case 'electrician':
      baseRate = 1200;
      if (scopeSize.includes('Rooms') || scopeSize.includes('House')) {
        workerBreakdown = [
          { category: 'Electrician', count: 2 },
          { category: 'Labourer', count: 1 }
        ];
        hours = 12;
      } else {
        workerBreakdown = [{ category: 'Electrician', count: 1 }];
        hours = 5;
      }
      adviceEn = "Electrical work requires verified technicians. We recommend turning off main power switches before work starts.";
      adviceBn = "ইলেকট্রিক্যাল কাজের ক্ষেত্রে যাচাইকৃত টেকনিশিয়ান প্রয়োজন। কাজ শুরুর আগে মেইন সুইচ বন্ধ রাখার পরামর্শ দেওয়া হচ্ছে।";
      break;

    case 'plumber':
      baseRate = 1100;
      workerBreakdown = [
        { category: 'Plumber', count: 1 },
        { category: 'Labourer', count: 1 }
      ];
      hours = 6;
      adviceEn = "Includes pipe fitting and water line repair. Material costs (pipes, fittings) are separate from labor daily rates.";
      adviceBn = "পাইপ ফিটিং ও ওয়াটার লাইন মেরামতের কাজ অন্তর্ভুক্ত। মালামালের খরচ (পাইপ, ফিটিং) শ্রমিক মজুরির বাইরে আলাদা হবে।";
      break;

    case 'driver':
      baseRate = 900;
      workerBreakdown = [{ category: 'Driver', count: 1 }];
      hours = 8;
      adviceEn = "Driver rate covers 8 hours of personal/commercial vehicle driving. Overtime hourly rates apply post 8 hours.";
      adviceBn = "ড্রাইভার মজুরি ৮ ঘণ্টার পার্সোনাল বা কমার্শিয়াল গাড়ি ড্রাইভের জন্য প্রযোজ্য। ৮ ঘণ্টার পর ওভারটাইম হিসেব হবে।";
      break;

    case 'mason':
      baseRate = 1300;
      workerBreakdown = [
        { category: 'Mason', count: 2 },
        { category: 'Labourer', count: 2 }
      ];
      hours = 16;
      adviceEn = "Masonry civil works (bricklaying, plastering, tiling). Requires mixing helpers for optimal progress.";
      adviceBn = "রাজমিস্ত্রি নির্মাণ কাজ (ইট গাথুনি, প্লাস্টার, টাইলস)। দ্রুত অগ্রগতির জন্য হেলপার শ্রমিক প্রয়োজন।";
      break;

    case 'cleaner':
      baseRate = 800;
      workerBreakdown = [{ category: 'Cleaner', count: 2 }];
      hours = 6;
      adviceEn = "Deep cleaning service for residential & commercial premises.";
      adviceBn = "বাসাবাড়ি ও বাণিজ্যিক স্পেসের ডিপ ক্লিনিং সার্ভিস।";
      break;

    default: // General Labour / Shifting
      baseRate = 950;
      workerBreakdown = [{ category: 'Labourer', count: 2 }];
      hours = 8;
      adviceEn = "General physical labor for loading, unloading, furniture shifting, and site cleanup.";
      adviceBn = "লোড-আনলোড, আসবাবপত্র শিফটিং এবং সাইট ক্লিনিংয়ের জন্য সাধারণ দৈনিক মজুরির শ্রমিক।";
      break;
  }

  const multiplier = urgency === 'Emergency' ? 1.3 : urgency === 'Urgent' ? 1.15 : 1.0;
  const totalWorkers = workerBreakdown.reduce((sum, w) => sum + w.count, 0);
  const minCost = Math.round(totalWorkers * baseRate * multiplier);
  const maxCost = Math.round(minCost * 1.25);

  return {
    recommendedWorkers: workerBreakdown,
    estimatedCostMin: minCost,
    estimatedCostMax: maxCost,
    estimatedHours: hours,
    aiAdviceEn: adviceEn,
    aiAdviceBn: adviceBn
  };
}

// AI Chatbot NLP Knowledge Base & Response Engine (Role-Aware for Customers & Brokers)
export function getAIChatbotResponse(userMessage: string, language: 'en' | 'bn', role?: string): string {
  const msg = userMessage.toLowerCase();

  // BROKER-SPECIFIC AI ASSISTANT RESPONSES
  if (role === 'broker') {
    // Verification Badge Queries
    if (msg.includes('verify') || msg.includes('badge') || msg.includes('ভেরিফাইড') || msg.includes('ব্যাজ') || msg.includes('achievement') || msg.includes('অর্জন')) {
      if (language === 'bn') {
        return "🏆 **ব্রোকার এচিভমেন্ট ও ভেরিফাইড ব্যাজ নির্দেশনা:**\n\nনতুন ব্রোকারদের ভেরিফাইড হতে ৩টি লক্ষ্য পূরণ করতে হয়:\n১. সর্বনিম্ন ৫টি গ্রাহক জব সফলভাবে সম্পন্ন করা (কমপ্লিট জব)\n২. গ্রাহকদের কাছ থেকে গড়ে ৪.৫+ রেটিং বজায় রাখা\n৩. ক্যাটালগে অন্তত ৩ জন সক্রিয় শ্রমিক যুক্ত রাখা\n\nআপনার ড্যাশবোর্ডে লাইভ এচিভমেন্ট ট্র্যাকার দেখে অগ্রগতি জানুন!";
      }
      return "🏆 **Broker Verification & Badge Guidance:**\n\nTo unlock the Official Verified Agency Badge:\n1. Complete a minimum of 5 customer job orders.\n2. Maintain a 4.5+ average client rating.\n3. Maintain at least 3 active workers in your catalog.\n\nCheck your live Achievement Tracker inside your Broker Dashboard!";
    }

    // Payment Request & Payout Queries
    if (msg.includes('payout') || msg.includes('request') || msg.includes('admin') || msg.includes('পেআউট') || msg.includes('টাকা পাব') || msg.includes('পেমেন্ট রিকোয়েস্ট')) {
      if (language === 'bn') {
        return "💰 **এডমিন পেমেন্ট রিকোয়েস্ট ও পেআউট সুবিধা:**\n\n১. কাস্টমার কাজের মজুরি সেভ করার পর ড্যাশবোর্ডে **'Submit Payment Request to Admin'** বাটনে ক্লিক করুন।\n২. লেবার.কম এডমিন এপ্রুভ করলে কাস্টমার এসক্রোতে জমা দেবেন।\n৩. কাজ সম্পূর্ণ হলে কাস্টমার কনফার্ম করার সাথে সাথে পেআউট ব্রোকারের নিকট রিলিজ হবে।";
      }
      return "💰 **Payment Request & Payout Guidance:**\n\n1. Once customer saves the agreed job rate, click **'Submit Payment Request to Admin'** on your dashboard.\n2. Upon Admin approval, customer deposits funds into Escrow.\n3. Funds are released to broker immediately after customer confirms job completion.";
    }

    // Worker Management Queries
    if (msg.includes('worker') || msg.includes('add') || msg.includes('labor') || msg.includes('শ্রমিক') || msg.includes('যুক্ত') || msg.includes('যোগ')) {
      if (language === 'bn') {
        return "👷 **এজেন্সিতে শ্রমিক যুক্ত করার পদ্ধতি:**\n\nব্রোকার ড্যাশবোর্ডের **'Workers'** ট্যাবে যান এবং **'+ Add New Worker'** বাটনে ক্লিক করুন। শ্রমিকের নাম, স্কিল (ইলেকট্রিশিয়ান, প্লাম্বার ইত্যাদি), দৈনিক মজুরি ও অভিজ্ঞতা দিয়ে ক্যাটালগে যোগ করুন!";
      }
      return "👷 **Managing Workforce Catalog:**\n\nGo to the **'Workers'** tab in your Broker Dashboard and click **'+ Add New Worker'**. Enter the worker's name, skill category, daily wage rate in BDT, and experience!";
    }

    // ৳500 Refund Compliance Queries
    if (msg.includes('500') || msg.includes('refund') || msg.includes('রিফান্ড') || msg.includes('ফেরত') || msg.includes('deposit')) {
      if (language === 'bn') {
        return "⚖️ **ব্রোকারদের জন্য ৳৫০০ রিফান্ড নিয়ম:**\n\nবুকিং অর্ডার পাওয়ার ২৪ ঘণ্টার মধ্যে কাস্টমারকে কল দিন। ডিল কনফার্ম হলে **'Confirm Deal & Refund ৳500 Deposit'** বাটনে ক্লিক করে কাস্টমারকে ৫০০ টাকা ফেরত দিন। এতে ব্রোকার রেটিং ও ভেরিফাইড ব্যাজ অগ্রগতি দ্রুত বাড়ে!";
      }
      return "⚖️ **৳500 Refund Rule for Brokers:**\n\nCall customer within 24 hours of receiving a booking order. Once terms are agreed, click **'Confirm Deal & Refund ৳500 Deposit'** to issue the refund. This boosts your agency rating and verification progress!";
    }

    // Default Broker AI Response
    if (language === 'bn') {
      return "🤖 **ব্রোকার অপারেশনস এআই অ্যাসিস্ট্যান্ট:**\n\nআমি ব্রোকার এজেন্সি পরিচালনায় আপনাকে সাহায্য করতে পারি:\n- ভেরিফাইড ব্যাজ পাওয়ার শর্ত জানতে বলুন\n- এডমিন পেমেন্ট রিকোয়েস্ট পাঠাতে সাহায্য নিন\n- নতুন শ্রমিক যোগ করার নিয়ম জানুন\n- ৳৫০০ রিফান্ড পলিসি নিশ্চিত করুন";
    }
    return "🤖 **Broker Operations AI Assistant:**\n\nI can assist you with your Broker Agency operations:\n- Unlocking the Verified Agency Badge\n- Submitting Payment Requests to Admin for Escrow\n- Adding & managing workers in your catalog\n- ৳500 Refund compliance rules";
  }

  // CUSTOMER & GUEST AI RESPONSES
  // Refund / 500 TK policy queries
  if (msg.includes('500') || msg.includes('refund') || msg.includes('ফেরত') || msg.includes('টাকা') || msg.includes('deposit')) {
    if (language === 'bn') {
      return "🤖 **লেবার.কম ৫০০ টাকা ডিপোজিট ও রিফান্ড নীতি:**\n\n১. ব্রোকার বুকিং নিশ্চিত করার জন্য আপনাকে ৫০০ টাকা অগ্রিম জমা দিতে হবে।\n২. আগামী ২৪ ঘণ্টার মধ্যে ব্রোকার সরাসরি কল দিয়ে কাজের বিস্তারিত আলোচনা করবেন।\n৩. **আপনি ব্রোকার বুকড করেন বা না করেন — আপনার ৫০০ টাকা ১০০% গ্যারান্টিসহ ফেরত দেওয়া হবে!** (ব্রোকার কনফার্ম করলে ব্রোকার ফেরত দিবে, আর ডিল রিজেক্ট করলে লেবার.কম ফেরত দিবে)।";
    }
    return "🤖 **Labour.com ৳500 Deposit & 100% Refund Guarantee Policy:**\n\n1. A ৳500 advance deposit is required to initiate broker confirmation.\n2. Within 24 hours, the broker calls you directly to negotiate job terms & rates.\n3. **Whether you book the broker or not — your ৳500 deposit is 100% GUARANTEED TO BE REFUNDED!** (If broker confirms, broker refunds; if you reject, Labour.com refunds directly).";
  }

  // Price & Rate Estimation Queries
  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('দাম') || msg.includes('মজুরি') || msg.includes('কত')) {
    if (language === 'bn') {
      return "💡 **লেবার.কম এআই প্রাইস এস্টিমেট সাহায্য:**\n\nবাংলাদেশে দৈনিক শ্রমিক মজুরি গড়ে ৳৮০০ থেকে ৳১,৫০০ টাকা (ক্যাটাগরি অনুযায়ী):\n- 👷 সাধারণ লেবার: ৳৮০০ - ৳১,০০০ /দিন\n- ⚡ ইলেকট্রিশিয়ান: ৳১,২০০ - ৳১,৫০০ /দিন\n- 🚰 প্লাম্বার: ৳১,১০০ - ৳১,৪০০ /দিন\n- 🧱 রাজমিস্ত্রি: ৳১,২০০ - ৳১,৬০০ /দিন\n\nআমাদের **AI Price Estimator** টুলটি ব্যবহার করে সঠিক বাজেট ও শ্রমিক সংখ্যা জেনে নিন!";
    }
    return "💡 **Labour.com AI Price Estimation Helper:**\n\nAverage daily rates in Bangladesh range from ৳800 to ৳1,500 BDT based on skill:\n- 👷 General Labourer: ৳800 - ৳1,000 /day\n- ⚡ Electrician: ৳1,200 - ৳1,500 /day\n- 🚰 Plumber: ৳1,100 - ৳1,400 /day\n- 🧱 Mason: ৳1,200 - ৳1,600 /day\n\nUse our top navbar **AI Price Estimator** tool for exact project budgeting!";
  }

  // Location / Division Queries
  if (msg.includes('dhaka') || msg.includes('chittagong') || msg.includes('mirpur') || msg.includes('sylhet') || msg.includes('ঢাকা') || msg.includes('চট্টগ্রাম') || msg.includes('মিরপুর')) {
    if (language === 'bn') {
      return "📍 **এআই লোকেশন সার্চ:**\n\nআমাদের কাছে ঢাকা, চট্টগ্রাম, সিলেট, খুলনা, রাজশাহী, বরিশাল, রংপুর ও ময়মনসিংহের যাচাইকৃত ব্রোকার এজেন্সি রয়েছে। আপনি হোমপেজের লোকেশন ফিল্টার ব্যবহার করে আপনার নিকটস্থ ব্রোকার খুঁজে বুক করতে পারেন!";
    }
    return "📍 **AI Location Finder:**\n\nWe have verified broker agencies across all 8 Divisions of Bangladesh (Dhaka, Chattogram, Sylhet, Khulna, Rajshahi, Barisal, Rangpur, Mymensingh). Use our homepage filter to instantly find nearby brokers!";
  }

  // Escrow & Payment Queries
  if (msg.includes('escrow') || msg.includes('payment') || msg.includes('bkash') || msg.includes('nagad') || msg.includes('পেমেন্ট') || msg.includes('বিকাশ')) {
    if (language === 'bn') {
      return "🛡️ **এসক্রো নিরাপত্তা সিকিউরিটি:**\n\nকাজের ফাইনাল পেমেন্ট লেবার.কম এসক্রো অ্যাকাউন্টে নিরাপদে জমা থাকে। কাজ সম্পূর্ণ শেষ হলে কাস্টমার কনফার্ম করার পরেই কেবল ব্রোকারের কাছে টাকা রিলিজ করা হয়। এতে কাস্টমার ও শ্রমিক উভয়ের টাকাই সম্পূর্ণ নিরাপদ!";
    }
    return "🛡️ **Labour.com Escrow Protection:**\n\nYour final payment is held safely in Labour.com Escrow. Funds are released to the broker ONLY AFTER you confirm that the job is 100% completed to your satisfaction!";
  }

  // Default Fallback
  if (language === 'bn') {
    return "🤖 **লেবার.কম এআই অ্যাসিস্ট্যান্ট:**\n\nআমি আপনাকে যেভাবে সাহায্য করতে পারি:\n- ৳৫০০ টাকা রিফান্ড গ্যারান্টি নীতি জানতে বলুন\n- কাজ অনুযায়ী শ্রমিক মজুরি ও খরচ অনুমান করতে বলুন\n- নিকটস্থ ব্রোকার এজেন্সি খুঁজে নিতে বলুন\n- এসক্রো পেমেন্ট সিকিউরিটি বুঝতে বলুন";
  }

  return "🤖 **Labour.com AI Assistant:**\n\nI can assist you with:\n- Understanding the ৳500 100% Refund Deposit Policy\n- Estimating fair labor rates in ৳ BDT for your project\n- Finding verified brokers in your District/Upazila\n- Explaining Escrow Payment Security";
}
