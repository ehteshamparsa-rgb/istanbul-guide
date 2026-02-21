import { ItineraryResponse, DayItinerary, Activity, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Coffee, Utensils, Sunset, Map, Info, AlertTriangle, Phone, Globe, ChevronDown, ChevronUp, Printer, RefreshCw, LucideIcon, Ship, Camera, Navigation, MapPin, Wallet, Star } from 'lucide-react';
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { translations } from '../lib/translations';

interface ItineraryDisplayProps {
  data: ItineraryResponse;
  onReset: () => void;
  language: Language;
}

const ActivityCard = ({ activity, icon: Icon, title, colorClass, t }: { activity: Activity; icon: LucideIcon; title: string; colorClass: string; t: any }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.name + " " + activity.location + " Istanbul")}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activity.name + " " + activity.location + " Istanbul")}`;

  return (
    <div className="mb-6 pl-6 border-l-2 border-slate-200 relative group hover:border-teal-400 transition-colors">
      <div className={clsx("absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm", colorClass)}></div>
      
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <Icon className={clsx("w-5 h-5", colorClass.replace('bg-', 'text-'))} />
          {title}: <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-[#1a237e] hover:underline hover:text-teal-600 transition-colors">{activity.name}</a>
        </h4>
        <div className="flex gap-2">
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View on Google Maps (Reviews & Photos)"
          >
            <Map className="w-4 h-4" />
          </a>
          <a 
            href={directionsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            title="Get Directions"
          >
            <Navigation className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm font-medium mt-1 mb-2">
        <span className="flex items-center gap-1 text-slate-500">
          <MapPin className="w-3 h-3 text-teal-500" /> {activity.location}
        </span>
        <span className="text-slate-300">|</span>
        {activity.rating && (
          <>
            <span className={clsx(
              "flex items-center gap-1",
              parseFloat(activity.rating) >= 4.5 ? "text-amber-500 font-bold" : "text-slate-500"
            )}>
              <Star className={clsx("w-3 h-3", parseFloat(activity.rating) >= 4.5 ? "fill-amber-500 text-amber-500" : "text-slate-400")} /> 
              {activity.rating}
              {parseFloat(activity.rating) >= 4.7 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1">TOP RATED</span>}
            </span>
            <span className="text-slate-300">|</span>
          </>
        )}
        <span className="text-emerald-600">{activity.priceRange}</span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
          <Wallet className="w-3 h-3" /> ~${activity.costUSD}
        </span>
      </div>
      
      <p className="text-slate-600 leading-relaxed">{activity.description}</p>
      
      {activity.transport && (
        <div className="mt-3 flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
          <Ship className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-700">{t.gettingThere}</span> {activity.transport}
          </p>
        </div>
      )}

      {activity.tips && (
        <div className="mt-2 flex gap-2 items-start bg-amber-50/50 p-3 rounded-lg border border-amber-100">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800 italic">
            {t.istanbulTip} {activity.tips}
          </p>
        </div>
      )}
    </div>
  );
};

const DayCard: React.FC<{ day: DayItinerary; t: any }> = ({ day, t }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1a237e] text-white flex flex-col items-center justify-center font-serif shadow-md">
            <span className="text-xs uppercase tracking-wider opacity-70">{t.days}</span>
            <span className="text-xl font-bold leading-none">{day.day}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{day.theme}</h3>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span>{t.exploreCity}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Wallet className="w-3 h-3" /> {t.estTotal} ${day.totalCostUSD}
              </span>
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-8 space-y-2">
              <ActivityCard activity={day.morning} icon={Sun} title="Morning" colorClass="bg-amber-400" t={t} />
              <ActivityCard activity={day.lunch} icon={Utensils} title="Lunch" colorClass="bg-orange-500" t={t} />
              <ActivityCard activity={day.afternoon} icon={Camera} title="Afternoon" colorClass="bg-teal-400" t={t} />
              <ActivityCard activity={day.sunset} icon={Sunset} title="Sunset" colorClass="bg-purple-500" t={t} />
              <ActivityCard activity={day.dinner} icon={Utensils} title="Dinner" colorClass="bg-indigo-600" t={t} />
              <ActivityCard activity={day.evening} icon={Moon} title="Evening" colorClass="bg-slate-800" t={t} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function ItineraryDisplay({ data, onReset, language }: ItineraryDisplayProps) {
  const t = translations[language];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20" dir={language === 'fa' || language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm sticky top-4 z-20 border border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-[#1a237e] font-bold leading-none">{t.yourItinerary}</h2>
            <p className="text-xs text-slate-500 font-medium">{t.curatedBy}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="p-2.5 text-slate-600 hover:text-[#1a237e] hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100" title="Print">
            <Printer className="w-5 h-5" />
          </button>
          <button onClick={onReset} className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100" title="Start Over">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Itinerary Days */}
      <div className="space-y-4">
        {data.itinerary.map((day) => (
          <DayCard key={day.day} day={day} t={t} />
        ))}
      </div>

      {/* Additional Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Neighborhood Guide */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Map className="w-32 h-32 text-[#1a237e]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1a237e] mb-4 flex items-center gap-2 relative z-10">
            <div className="p-2 bg-blue-50 rounded-lg"><Map className="w-5 h-5 text-blue-600" /></div>
            {t.neighborhoodGuide}
          </h3>
          <p className="text-slate-600 leading-relaxed relative z-10">{data.neighborhoodGuide}</p>
        </div>

        {/* Getting Around */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Globe className="w-32 h-32 text-teal-600" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1a237e] mb-4 flex items-center gap-2 relative z-10">
            <div className="p-2 bg-teal-50 rounded-lg"><Ship className="w-5 h-5 text-teal-600" /></div>
            {t.gettingAround}
          </h3>
          <p className="text-slate-600 leading-relaxed relative z-10">{data.gettingAround}</p>
        </div>

        {/* Essential Tips */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 md:col-span-2">
          <h3 className="font-serif text-xl font-bold text-[#1a237e] mb-6 flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg"><Info className="w-5 h-5 text-emerald-600" /></div>
            {t.essentialTips}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {data.essentialTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <span className="text-slate-700 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Table */}
        {data.costTable && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 md:col-span-2">
            <h3 className="font-serif text-xl font-bold text-[#1a237e] mb-6 flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-lg"><Wallet className="w-5 h-5 text-amber-600" /></div>
              {t.typicalCosts}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">{t.itemService}</th>
                    <th className="py-3 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">{t.avgCost}</th>
                    <th className="py-3 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">{t.localTip}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.costTable.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-800 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold font-mono">{item.averageCost}</td>
                      <td className="py-3 px-4 text-slate-500 text-sm italic">{item.tips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Phrasebook & Emergency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#1a237e] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
          <h3 className="font-serif text-xl font-bold text-amber-400 mb-6 relative z-10 flex items-center gap-2">
            <span className="text-2xl">🇹🇷</span> {t.localPhrases}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
            {data.localPhrases.map((phrase, i) => (
              <div key={i} className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors cursor-default">
                <div className="font-bold text-base text-white">{phrase.phrase}</div>
                <div className="text-xs text-teal-200 font-medium uppercase tracking-wide mt-1">{phrase.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-8 rounded-3xl shadow-sm border border-red-100">
          <h3 className="font-serif text-lg font-bold text-red-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {t.emergency}
          </h3>
          <div className="space-y-4">
            {data.emergencyContacts.map((contact, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-red-100">
                <span className="text-sm font-bold text-red-700">{contact.name}</span>
                <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{contact.number}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-red-200">
             <h4 className="font-bold text-red-800 text-sm mb-3">{t.culturalDonts}</h4>
             <ul className="space-y-2">
              {data.donts.slice(0, 3).map((dont, i) => (
                <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                  <span className="text-red-400 font-bold">×</span> {dont}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
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
