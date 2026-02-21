import React, { useState } from 'react';
import { UserPreferences, TravelStyle, AccommodationArea, TravelerType, Season, Language } from '../types';
import { motion } from 'motion/react';
import { MapPin, Wallet, Users, Calendar, Heart, Check, Navigation, Coffee, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { LocationAutocomplete } from './LocationAutocomplete';
import { translations } from '../lib/translations';

interface ItineraryFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_KEYS = [
  'mosques', 'museums', 'streetFood', 'boatTours', 'turkishBath',
  'bazaars', 'rooftopBars', 'localNeighborhoods', 'ottomanHistory', 'byzantineHistory',
  'modernArt', 'coffeeCulture', 'wineTasting', 'liveMusic', 'sufiMusic',
  'antiqueHunting', 'cycling', 'running', 'yoga', 'cookingClasses'
];

const TRAVEL_STYLES_KEYS = [
  'culturalHistorical',
  'foodCulinary',
  'shoppingBazaars',
  'natureBosphorus',
  'nightlifeEntertainment',
  'familyFriendly',
  'religiousTourism',
  'artGalleries',
  'hiddenGems',
  'luxuryWellness',
  'photographySpots',
  'adventureOutdoors'
];

export function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const [prefs, setPrefs] = useState<UserPreferences>({
    days: 3,
    budget: 100,
    travelStyle: ['Cultural & Historical'],
    accommodationArea: 'Sultanahmet',
    travelers: 'Couple',
    season: 'Spring',
    interests: [],
    language: 'en',
  });
  const [locating, setLocating] = useState(false);

  const t = translations[prefs.language];

  // Helper to get translated string for a key
  const getTranslatedInterest = (key: string) => t[key] || key;
  const getTranslatedStyle = (key: string) => t[key] || key;

  // We store the ENGLISH keys in the state for the API, but display translated labels
  // Mapping back and forth is needed if we want to store the "value" as the English string
  // but display the translated string.
  // Actually, the API expects the English strings as defined in types.ts for TravelStyle.
  // For interests, it's just a string array, but let's keep them consistent.

  // Let's create a mapping for TravelStyle values to translation keys
  const styleKeyMap: Record<string, string> = {
    'Cultural & Historical': 'culturalHistorical',
    'Food & Culinary': 'foodCulinary',
    'Shopping & Bazaars': 'shoppingBazaars',
    'Nature & Bosphorus': 'natureBosphorus',
    'Nightlife & Entertainment': 'nightlifeEntertainment',
    'Family Friendly': 'familyFriendly',
    'Religious Tourism': 'religiousTourism',
    'Art & Galleries': 'artGalleries',
    'Hidden Gems': 'hiddenGems',
    'Luxury & Wellness': 'luxuryWellness',
    'Photography Spots': 'photographySpots',
    'Adventure & Outdoors': 'adventureOutdoors'
  };

  // And for interests (which are just strings in the type, but we want to translate them)
  const interestKeyMap: Record<string, string> = {
    'Mosques': 'mosques',
    'Museums': 'museums',
    'Street Food': 'streetFood',
    'Boat Tours': 'boatTours',
    'Turkish Bath (Hamam)': 'turkishBath',
    'Bazaars': 'bazaars',
    'Rooftop Bars': 'rooftopBars',
    'Local Neighborhoods': 'localNeighborhoods',
    'Ottoman History': 'ottomanHistory',
    'Byzantine History': 'byzantineHistory',
    'Modern Art': 'modernArt',
    'Coffee Culture': 'coffeeCulture',
    'Wine Tasting': 'wineTasting',
    'Live Music': 'liveMusic',
    'Sufi Music': 'sufiMusic',
    'Antique Hunting': 'antiqueHunting',
    'Cycling': 'cycling',
    'Running': 'running',
    'Yoga': 'yoga',
    'Cooking Classes': 'cookingClasses'
  };

  const getBudgetGuidance = (amount: number) => {
    if (amount < 50) return { text: t.budgetBackpacker, color: "text-emerald-600" };
    if (amount < 150) return { text: t.budgetMid, color: "text-blue-600" };
    return { text: t.budgetLuxury, color: "text-purple-600" };
  };

  const budgetGuidance = getBudgetGuidance(prefs.budget);

  const handleInterestToggle = (interest: string) => {
    setPrefs(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleTravelStyleToggle = (style: TravelStyle) => {
    setPrefs(prev => {
      if (prev.travelStyle.includes(style)) {
        // Prevent deselecting the last style to ensure at least one is selected
        if (prev.travelStyle.length === 1) return prev;
        return { ...prev, travelStyle: prev.travelStyle.filter(s => s !== style) };
      } else {
        return { ...prev, travelStyle: [...prev.travelStyle, style] };
      }
    });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPrefs(prev => ({
          ...prev,
          accommodationArea: 'Current Location',
          userLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
        setLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
    >
      {/* Language Selector Bar */}
      <div className="bg-slate-100 p-3 flex justify-center border-b border-slate-200">
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200">
          {(['en', 'tr', 'de', 'fa', 'ar', 'fr'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setPrefs({ ...prefs, language: lang })}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
                prefs.language === lang
                  ? "bg-[#1a237e] text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              {lang === 'en' && '🇺🇸 EN'}
              {lang === 'tr' && '🇹🇷 TR'}
              {lang === 'de' && '🇩🇪 DE'}
              {lang === 'fa' && '🇮🇷 FA'}
              {lang === 'ar' && '🇸🇦 AR'}
              {lang === 'fr' && '🇫🇷 FR'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a237e] p-8 text-center relative overflow-hidden">
        {/* Tulip Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pattern-tulip text-white"></div>
        <div className="absolute top-0 right-0 p-4 opacity-20">
            <Coffee className="w-24 h-24 text-amber-400" />
        </div>
        
        <h2 className="text-3xl font-serif font-bold text-white relative z-10" dir={prefs.language === 'fa' || prefs.language === 'ar' ? 'rtl' : 'ltr'}>{t.startAdventure}</h2>
        <p className="text-teal-200 text-sm mt-2 relative z-10 font-medium tracking-wide">{t.customizeExperience}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8" dir={prefs.language === 'fa' || prefs.language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Days */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <label className="block text-sm font-bold text-[#1a237e] mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-teal-500" /> {t.howLongStay}
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={prefs.days}
              onChange={(e) => setPrefs({ ...prefs, days: Math.max(1, parseInt(e.target.value) || 0) })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-bold text-lg text-slate-700"
              placeholder={t.enterDays}
            />
            <div className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400 font-medium", prefs.language === 'fa' || prefs.language === 'ar' ? "left-4" : "right-4")}>{t.days}</div>
          </div>
        </div>

        {/* Budget & Travelers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1a237e] mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-teal-500" /> {t.dailyBudget}
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                value={prefs.budget}
                onChange={(e) => setPrefs({ ...prefs, budget: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-bold text-lg text-slate-700"
                placeholder="e.g. 100"
              />
              <div className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400 font-medium", prefs.language === 'fa' || prefs.language === 'ar' ? "left-4" : "right-4")}>{t.perDay}</div>
            </div>
            <p className={clsx("text-xs mt-2 font-medium transition-colors", budgetGuidance.color)}>
              {budgetGuidance.text}
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1a237e] mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Users className="w-4 h-4 text-teal-500" /> {t.whoTraveling}
            </label>
            <div className="relative">
              <select
                value={prefs.travelers}
                onChange={(e) => setPrefs({ ...prefs, travelers: e.target.value as TravelerType })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none font-medium text-slate-700"
              >
                <option value="Solo">{t.solo}</option>
                <option value="Couple">{t.couple}</option>
                <option value="Family with kids">{t.family}</option>
                <option value="Group">{t.group}</option>
              </select>
              <div className={clsx("absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-400", prefs.language === 'fa' || prefs.language === 'ar' ? "left-4" : "right-4")}>▼</div>
            </div>
          </div>
        </div>

        {/* Area & Season */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1a237e] mb-2 flex items-center gap-2 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-teal-500" /> {t.whereStaying}
            </label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <LocationAutocomplete
                  value={prefs.accommodationArea}
                  onChange={(val, latLng) => {
                    setPrefs({ 
                      ...prefs, 
                      accommodationArea: val,
                      userLocation: latLng 
                    });
                  }}
                  placeholder={t.searchLocation}
                />
              </div>
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locating}
                className="p-4 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-100 transition-colors border border-teal-200 shrink-0"
                title={t.useLocation}
              >
                {locating ? <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" /> : <Navigation className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1a237e] mb-2 flex items-center gap-2 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-teal-500" /> {t.season}
            </label>
            <div className="relative">
              <select
                value={prefs.season}
                onChange={(e) => setPrefs({ ...prefs, season: e.target.value as Season })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none font-medium text-slate-700"
              >
                <option value="Spring">{t.spring}</option>
                <option value="Summer">{t.summer}</option>
                <option value="Autumn">{t.autumn}</option>
                <option value="Winter">{t.winter}</option>
              </select>
              <div className={clsx("absolute top-1/2 -translate-y-1/2 pointer-events-none text-slate-400", prefs.language === 'fa' || prefs.language === 'ar' ? "left-4" : "right-4")}>▼</div>
            </div>
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-bold text-[#1a237e] mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Heart className="w-4 h-4 text-teal-500" /> {t.travelVibe}
          </label>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(styleKeyMap) as TravelStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleTravelStyleToggle(style)}
                className={clsx(
                  "px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 border flex items-center gap-2",
                  prefs.travelStyle.includes(style)
                    ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-200 transform scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600"
                )}
              >
                {t[styleKeyMap[style]]}
                {prefs.travelStyle.includes(style) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-bold text-[#1a237e] mb-4 uppercase tracking-wider">{t.interests}</label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(interestKeyMap).map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={clsx(
                  "px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 border flex items-center gap-2",
                  prefs.interests.includes(interest)
                    ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-200 transform scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600"
                )}
              >
                {t[interestKeyMap[interest]]}
                {prefs.interests.includes(interest) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-gradient-to-r from-[#1a237e] to-[#0d47a1] text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="relative z-10">{t.generating}</span>
            </>
          ) : (
            <>
              <span className="relative z-10">{t.generateBtn}</span>
              <SparklesIcon className="w-5 h-5 relative z-10 text-amber-400" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
