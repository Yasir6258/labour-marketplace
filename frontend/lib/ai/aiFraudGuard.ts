/**
 * Labour.com AI Fraud & Off-Platform Bypass Guard Engine
 * Analyzes booking details, notes, and broker/customer interactions
 * to calculate AI Risk Scores and detect off-platform payment bypasses.
 */

export interface AIFraudAnalysisResult {
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High';
  detectedFlags: string[];
  recommendationEn: string;
  recommendationBn: string;
}

export function analyzeBookingAIFraudRisk(text: string, amount?: number): AIFraudAnalysisResult {
  let score = 5; // Base low risk
  const flags: string[] = [];
  const lowerText = (text || '').toLowerCase();

  // Pattern 1: Phone numbers embedded in job notes
  const phonePattern = /(01[3-9]\d{8}|\+8801[3-9]\d{8})/g;
  if (phonePattern.test(text)) {
    score += 35;
    flags.push('Raw phone number detected in public job notes');
  }

  // Pattern 2: Bypass keywords in English or Bangla
  const bypassKeywords = [
    'cash outside',
    'direct payment',
    'call me direct',
    'bypass',
    'no commission',
    'ডাইরেক্ট',
    'বাইপাস',
    'সাইট ছাড়া',
    'ক্যাশ বাহিরে',
    'সরাসরি টাকা'
  ];

  for (const kw of bypassKeywords) {
    if (lowerText.includes(kw)) {
      score += 45;
      flags.push(`Off-platform bypass phrase detected: "${kw}"`);
    }
  }

  // Pattern 3: Suspiciously low pricing discrepancy
  if (amount && amount > 0 && amount < 400) {
    score += 20;
    flags.push('Unusually low job rate discrepancy (< ৳400 BDT)');
  }

  // Cap score
  score = Math.min(98, Math.max(5, score));

  let level: 'Low' | 'Medium' | 'High' = 'Low';
  if (score >= 70) {
    level = 'High';
  } else if (score >= 35) {
    level = 'Medium';
  }

  let recEn = "Transaction is compliant and protected by Labour.com Escrow.";
  let recBn = "লেনদেনটি সম্পূর্ণ বৈধ এবং লেবার.কম এসক্রো দ্বারা সুরক্ষিত।";

  if (level === 'High') {
    recEn = "CRITICAL: High risk of off-platform bypass detected. Admin should inspect transaction and issue official warning if confirmed.";
    recBn = "জরুরি সতর্কবার্তা: প্ল্যাটফর্মের বাইরে লেনদেনের উচ্চ ঝুঁকি সনাক্ত হয়েছে। এডমিনকে তদন্তের পরামর্শ দেওয়া হচ্ছে।";
  } else if (level === 'Medium') {
    recEn = "WARNING: Potential contact sharing in notes. Monitor broker confirmation status.";
    recBn = "সতর্কতা: প্রভাবে যোগাযোগ নম্বর শেয়ারের ঝুঁকি আছে। পরিস্থিতি পর্যবেক্ষণ করুন।";
  }

  return {
    riskScore: score,
    riskLevel: level,
    detectedFlags: flags.length > 0 ? flags : ['No risk factors detected'],
    recommendationEn: recEn,
    recommendationBn: recBn
  };
}
