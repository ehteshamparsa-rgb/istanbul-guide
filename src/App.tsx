import { useState, useEffect } from 'react';
import { UserPreferences, ItineraryResponse } from './types';
import { generateItinerary } from './lib/gemini';
import { ItineraryForm } from './components/ItineraryForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map, Ship } from 'lucide-react';

function App() {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://creator.expediagroup.com/products/widgets/assets/eg-widgets.js';
  script.async = true;
  document.body.appendChild(script);
}, []);
  const [language, setLanguage] = useState<'en' | 'tr' | 'de' | 'fa' | 'ar' | 'fr'>('en');

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    setLanguage(prefs.language);
    try {
      const data = await generateItinerary(prefs);
      setItinerary(data);
    } catch (err) {
      setError("Failed to generate itinerary. Please try again. The AI might be busy.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-200 selection:text-[#1a237e] relative overflow-x-hidden">
      {/* Background Skyline Silhouette (CSS) */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-repeat-x opacity-15 pointer-events-none z-0 skyline-bg"></div>
      
      {/* Decorative Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-teal-50/30 to-amber-50/30 pointer-events-none z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-10">
        {/* Header with Istanbul Guide Branding */}
        <header className="text-center mb-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-[#1a237e] rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400">
              <Ship className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-serif font-bold text-[#1a237e] leading-none tracking-tight">ISTANBUL <span className="text-teal-600">GUIDE</span></h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Your Local Expert</p>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4 drop-shadow-sm"
          >
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">City of Dreams</span>
          </motion.h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Let <strong>Istanbul Guide</strong> craft your perfect journey through history, culture, and the Bosphorus breeze.
          </p>
        </header>

        {/* Main Content */}
        <main>
          <AnimatePresence mode="wait">
            {!itinerary ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />
                {error && (
                  <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center shadow-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ItineraryDisplay data={itinerary} onReset={handleReset} language={language} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
       <div className="my-8 text-center">
  <a 
    href="https://www.expedia.com/Istanbul-Hotels.d602925.Travel-Guide-Hotels?affcid=us-expedia.affiliate.1100l5Fovn"
    target="_blank"
    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
  >
    🏨 Book Hotels in Istanbul
  </a>
         <a
  href="https://www.agoda.com/partners/partnersearch.aspx?pcs=1&cid=1960634&hl=en-us"
  target="_blank"
  className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg mt-3 inline-block"
>
  🏨 Book Hotels on Agoda
</a>
         <a
  href="https://www.getyourguide.com?partner_id=BH5S9T9&utm_medium=online_publisher"
  target="_blank"
  className="bg-teal-600 text-white px-6 py-3 rounded-lg text-lg mt-3 inline-block"
>
  🎯 Book Tours & Activities
</a>
</div>
                <footer className="text-center mt-20 text-slate-400 text-sm pb-8 border-t border-slate-200 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
             <Map className="w-4 h-4 text-teal-500" />
             <span className="font-serif font-bold text-[#1a237e]">Istanbul Guide</span>
          </div>
          <p>© {new Date().getFullYear()} Istanbul Guide. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
