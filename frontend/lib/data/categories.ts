import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'labourer',
    nameEn: 'General Labourer',
    nameBn: 'সাধারণ শ্রমিক',
    iconName: 'HardHat',
    descriptionEn: 'Daily wage construction, loading, unloading and site work.',
    descriptionBn: 'দৈনিক মজুরিতে নির্মাণ, লোডিং, আনলোডিং ও সাইট কাজ।'
  },
  {
    id: 'electrician',
    nameEn: 'Electrician',
    nameBn: 'ইলেকট্রিশিয়ান',
    iconName: 'Zap',
    descriptionEn: 'Wiring, circuit repairs, solar panel, and appliance setup.',
    descriptionBn: 'ওয়্যারিং, সার্কিট মেরামত, সোলার প্যানেল ও বৈদ্যুতিক যন্ত্র সেটআপ।'
  },
  {
    id: 'plumber',
    nameEn: 'Plumber',
    nameBn: 'প্লাম্বার / স্যানিটারি মিস্ত্রি',
    iconName: 'Wrench',
    descriptionEn: 'Pipe fitting, leak repairs, bathroom & tank installations.',
    descriptionBn: 'পাইপ ফিটিং, ফুটো মেরামত, বাথরুম ও ট্যাঙ্ক ইনস্টলেশন।'
  },
  {
    id: 'cleaner',
    nameEn: 'Cleaner',
    nameBn: 'ক্লিনার / পরিচ্ছন্নতাকর্মী',
    iconName: 'Sparkles',
    descriptionEn: 'House, office, deep cleaning and commercial sanitation.',
    descriptionBn: 'বাসাবাড়ি, অফিস, ডিপ ক্লিনিং ও বাণিজ্যিক পরিচ্ছন্নতা।'
  },
  {
    id: 'delivery',
    nameEn: 'Delivery Rider',
    nameBn: 'ডেলিভারি রাইডার',
    iconName: 'Truck',
    descriptionEn: 'Local parcels, goods transport, and express delivery riders.',
    descriptionBn: 'স্থানীয় পার্সেল, পণ্য পরিবহন ও এক্সপ্রেস ডেলিভারি।'
  },
  {
    id: 'carpenter',
    nameEn: 'Carpenter',
    nameBn: 'কাঠমিস্ত্রি',
    iconName: 'Hammer',
    descriptionEn: 'Furniture making, doors, cabinets, and wood restoration.',
    descriptionBn: 'ফার্নিচার তৈরি, দরজা, ক্যাবিনেট ও কাঠের কাজ।'
  },
  {
    id: 'welder',
    nameEn: 'Welder',
    nameBn: 'ওয়েল্ডার / গ্রিল মিস্ত্রি',
    iconName: 'Flame',
    descriptionEn: 'Metal welding, iron gate, window grills, and structure fabrication.',
    descriptionBn: 'মেটাল ওয়েল্ডিং, গেট, জানালার গ্রিল ও মেটাল কাজ।'
  },
  {
    id: 'mason',
    nameEn: 'Mason (Raj Mistri)',
    nameBn: 'রাজমিস্ত্রি',
    iconName: 'Building',
    descriptionEn: 'Bricklaying, plastering, tiling, and foundation masonry.',
    descriptionBn: 'ইটের গাঁথুনি, প্লাস্টার, টাইলস ও ফাউন্ডেশন কাজ।'
  },
  {
    id: 'painter',
    nameEn: 'Painter',
    nameBn: 'রং মিস্ত্রি',
    iconName: 'Paintbrush',
    descriptionEn: 'Interior and exterior home wall painting and weatherproofing.',
    descriptionBn: 'বাসার ভেতরের ও বাইরের দেয়াল পেইন্টিং।'
  },
  {
    id: 'ac-tech',
    nameEn: 'AC Technician',
    nameBn: 'এসি টেকনিশিয়ান',
    iconName: 'Wind',
    descriptionEn: 'Air conditioner installation, gas refill, and servicing.',
    descriptionBn: 'এসি ইনস্টলেশন, গ্যাস রিফিল ও সার্ভিসিং।'
  },
  {
    id: 'gardener',
    nameEn: 'Gardener',
    nameBn: 'মালি / বাগানকর্মী',
    iconName: 'Trees',
    descriptionEn: 'Lawn maintenance, tree pruning, rooftop garden management.',
    descriptionBn: 'বাগান রক্ষণাবেক্ষণ, গাছ ছাঁটাই ও ছাদ বাগান পরিচর্যা।'
  },
  {
    id: 'mechanic',
    nameEn: 'Mechanic',
    nameBn: 'মেকানিক / মোটর মিস্ত্রি',
    iconName: 'Cog',
    descriptionEn: 'Vehicle repair, auto-rickshaw servicing, engine maintenance.',
    descriptionBn: 'যানবাহন ও ইঞ্জিন সার্ভিসিং।'
  }
];
