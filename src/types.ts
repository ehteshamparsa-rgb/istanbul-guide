export type TravelStyle = 'Cultural & Historical' | 'Food & Culinary' | 'Shopping & Bazaars' | 'Nature & Bosphorus' | 'Nightlife & Entertainment' | 'Family Friendly' | 'Religious Tourism' | 'Art & Galleries' | 'Hidden Gems' | 'Luxury & Wellness' | 'Photography Spots' | 'Adventure & Outdoors';
export type AccommodationArea = 'Sultanahmet' | 'Taksim/Beyoglu' | 'Besiktas' | 'Kadikoy' | 'Sisli' | 'Uskudar';
export type TravelerType = 'Solo' | 'Couple' | 'Family with kids' | 'Group';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type Language = 'en' | 'tr' | 'de' | 'fa' | 'ar' | 'fr';

export interface UserPreferences {
  days: number;
  budget: number;
  travelStyle: TravelStyle[];
  accommodationArea: string;
  travelers: TravelerType;
  season: Season;
  interests: string[];
  userLocation?: { lat: number; lng: number };
  language: Language;
}

export interface Activity {
  name: string;
  location: string;
  description: string;
  priceRange: string;
  tips?: string;
  transport?: string;
  costUSD: number;
  rating?: string;
}

export interface DayItinerary {
  day: number;
  theme: string;
  morning: Activity;
  lunch: Activity;
  afternoon: Activity;
  sunset: Activity;
  dinner: Activity;
  evening: Activity;
  totalCostUSD: number;
}

export interface ItineraryResponse {
  itinerary: DayItinerary[];
  essentialTips: string[];
  neighborhoodGuide: string;
  gettingAround: string;
  budgetBreakdown: string;
  costTable: { category: string; averageCost: string; tips: string }[];
  localPhrases: { phrase: string; meaning: string }[];
  emergencyContacts: { name: string; number: string }[];
  donts: string[];
}
