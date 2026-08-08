import { DivisionName } from '../types';

export interface DistrictData {
  name: string;
  nameBn: string;
  upazilas: { name: string; nameBn: string }[];
}

export interface DivisionData {
  division: DivisionName;
  divisionBn: string;
  districts: DistrictData[];
}

export const BANGLADESH_LOCATIONS: DivisionData[] = [
  {
    division: 'Dhaka',
    divisionBn: 'ঢাকা',
    districts: [
      {
        name: 'Dhaka',
        nameBn: 'ঢাকা',
        upazilas: [
          { name: 'Mirpur', nameBn: 'মিরপুর' },
          { name: 'Uttara', nameBn: 'উত্তরা' },
          { name: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
          { name: 'Gulshan', nameBn: 'গুলশান' },
          { name: 'Savar', nameBn: 'সাভার' },
          { name: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
          { name: 'Dhamrai', nameBn: 'ধামরাই' }
        ]
      },
      {
        name: 'Gazipur',
        nameBn: 'গাজীপুর',
        upazilas: [
          { name: 'Sreepur', nameBn: 'শ্রীপুর' },
          { name: 'Kaliakair', nameBn: 'কালিয়াকৈড়' },
          { name: 'Kapasia', nameBn: 'কপাসিয়া' },
          { name: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর' }
        ]
      },
      {
        name: 'Faridpur',
        nameBn: 'ফরিদপুর',
        upazilas: [
          { name: 'Sadarpur', nameBn: 'সদরপুর' },
          { name: 'Bhanga', nameBn: 'ভাঙ্গা' },
          { name: 'Faridpur Sadar', nameBn: 'ফরিদপুর সদর' },
          { name: 'Boalmari', nameBn: 'বোয়ালমারী' }
        ]
      },
      {
        name: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        upazilas: [
          { name: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' },
          { name: 'Sonargaon', nameBn: 'সোনারগাঁ' },
          { name: 'Rupganj', nameBn: 'রূপগঞ্জ' },
          { name: 'Araihazar', nameBn: 'আড়াইহাজার' }
        ]
      }
    ]
  },
  {
    division: 'Chittagong',
    divisionBn: 'চট্টগ্রাম',
    districts: [
      {
        name: 'Chittagong',
        nameBn: 'চট্টগ্রাম',
        upazilas: [
          { name: 'Pahartali', nameBn: 'পাহাড়তলী' },
          { name: 'Patenga', nameBn: 'পতেঙ্গা' },
          { name: 'Hathazari', nameBn: 'হাটহাজারী' },
          { name: 'Patiya', nameBn: 'পটিয়া' },
          { name: 'Sitakunda', nameBn: 'সীতাকুণ্ড' }
        ]
      },
      {
        name: 'Cumilla',
        nameBn: 'কুমিল্লা',
        upazilas: [
          { name: 'Burichang', nameBn: 'বুড়িচং' },
          { name: 'Chandina', nameBn: 'চান্দিনা' },
          { name: 'Daudkandi', nameBn: 'দাউদকান্দি' },
          { name: 'Cumilla Sadar', nameBn: 'কুমিল্লা সদর' }
        ]
      },
      {
        name: 'Cox\'s Bazar',
        nameBn: 'কক্সবাজার',
        upazilas: [
          { name: 'Teknaf', nameBn: 'টেকনাফ' },
          { name: 'Ukhiya', nameBn: 'উখিয়া' },
          { name: 'Chakaria', nameBn: 'চকরিয়া' },
          { name: 'Ramu', nameBn: 'রামু' }
        ]
      }
    ]
  },
  {
    division: 'Sylhet',
    divisionBn: 'সিলেট',
    districts: [
      {
        name: 'Sylhet',
        nameBn: 'সিলেট',
        upazilas: [
          { name: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
          { name: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
          { name: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
          { name: 'Fenchuganj', nameBn: 'ফেঞ্চুগঞ্জ' }
        ]
      },
      {
        name: 'Moulvibazar',
        nameBn: 'মৌলভীবাজার',
        upazilas: [
          { name: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
          { name: 'Kulaura', nameBn: 'কুলাউড়া' },
          { name: 'Kamalganj', nameBn: 'কমলগঞ্জ' }
        ]
      }
    ]
  },
  {
    division: 'Khulna',
    divisionBn: 'খুলনা',
    districts: [
      {
        name: 'Khulna',
        nameBn: 'খুলনা',
        upazilas: [
          { name: 'Dumuria', nameBn: 'ডুমুরিয়া' },
          { name: 'Rupsha', nameBn: 'রূপসা' },
          { name: 'Batiaghata', nameBn: 'বাটিয়াঘাটা' },
          { name: 'Phultala', nameBn: 'ফুলতলা' }
        ]
      },
      {
        name: 'Jhenaidah',
        nameBn: 'ঝিনাইদহ',
        upazilas: [
          { name: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
          { name: 'Shailkupa', nameBn: 'শৈলকূপা' },
          { name: 'Kotchandpur', nameBn: 'কোটচাঁদপুর' }
        ]
      }
    ]
  },
  {
    division: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    districts: [
      {
        name: 'Rajshahi',
        nameBn: 'রাজশাহী',
        upazilas: [
          { name: 'Boalia', nameBn: 'বোয়ালিয়া' },
          { name: 'Rajpara', nameBn: 'রাজপাড়া' },
          { name: 'Paba', nameBn: 'পবা' },
          { name: 'Godagari', nameBn: 'গোদা গাড়ী' }
        ]
      },
      {
        name: 'Bogra',
        nameBn: 'বগুড়া',
        upazilas: [
          { name: 'Sajahanpur', nameBn: 'শাহজাহানপুর' },
          { name: 'Sherpur', nameBn: 'শেরপুর' },
          { name: 'Shibganj', nameBn: 'শিবগঞ্জ' }
        ]
      }
    ]
  },
  {
    division: 'Barisal',
    divisionBn: 'বরিশাল',
    districts: [
      {
        name: 'Barisal',
        nameBn: 'বরিশাল',
        upazilas: [
          { name: 'Babuganj', nameBn: 'বাবুগঞ্জ' },
          { name: 'Wazirpur', nameBn: 'উজীরপুর' },
          { name: 'Bakerganj', nameBn: 'বাকেরগঞ্জ' },
          { name: 'Gournadi', nameBn: 'গৌরনদী' }
        ]
      },
      {
        name: 'Patuakhali',
        nameBn: 'পটুয়াখালী',
        upazilas: [
          { name: 'Kuakata', nameBn: 'কুয়াকাটা' },
          { name: 'Galachipa', nameBn: 'গলাচিপা' },
          { name: 'Bauphal', nameBn: 'বাউফল' }
        ]
      }
    ]
  },
  {
    division: 'Rangpur',
    divisionBn: 'রংপুর',
    districts: [
      {
        name: 'Rangpur',
        nameBn: 'রংপুর',
        upazilas: [
          { name: 'Pirganj', nameBn: 'পীরগঞ্জ' },
          { name: 'Mithapukur', nameBn: 'মিঠাপুকুর' },
          { name: 'Badarganj', nameBn: 'বদরগঞ্জ' },
          { name: 'Rangpur Sadar', nameBn: 'রংপুর সদর' }
        ]
      },
      {
        name: 'Dinajpur',
        nameBn: 'দিনাজপুর',
        upazilas: [
          { name: 'Birampur', nameBn: 'বিরামপুর' },
          { name: 'Fulbari', nameBn: 'ফুলবাড়ী' },
          { name: 'Parbatipur', nameBn: 'পার্বতীপুর' }
        ]
      }
    ]
  },
  {
    division: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    districts: [
      {
        name: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        upazilas: [
          { name: 'Muktagacha', nameBn: 'মুক্তাগাছা' },
          { name: 'Bhaluka', nameBn: 'ভালুকা' },
          { name: 'Trishal', nameBn: 'ত্রিশাল' }
        ]
      },
      {
        name: 'Jamalpur',
        nameBn: 'জামালপুর',
        upazilas: [
          { name: 'Sarbebari', nameBn: 'সরিষাবাড়ী' },
          { name: 'Islampur', nameBn: 'ইসলামপুর' }
        ]
      }
    ]
  }
];
