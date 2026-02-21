import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { clsx } from 'clsx';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, latLng?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

// Comprehensive list of Istanbul locations for static autocomplete
const ISTANBUL_LOCATIONS = [
  // Major Districts & Neighborhoods
  "Sultanahmet, Fatih",
  "Taksim, Beyoğlu",
  "Galata, Beyoğlu",
  "Karaköy, Beyoğlu",
  "Beşiktaş Center",
  "Ortaköy, Beşiktaş",
  "Kadıköy Center",
  "Moda, Kadıköy",
  "Üsküdar Center",
  "Kuzguncuk, Üsküdar",
  "Şişli Center",
  "Nişantaşı, Şişli",
  "Balat, Fatih",
  "Fener, Fatih",
  "Eminönü, Fatih",
  "Sirkeci, Fatih",
  "Cihangir, Beyoğlu",
  "Arnavutköy, Beşiktaş",
  "Bebek, Beşiktaş",
  "Etiler, Beşiktaş",
  "Levent, Beşiktaş",
  "Maslak, Sarıyer",
  "Sarıyer Center",
  "Tarabya, Sarıyer",
  "Emirgan, Sarıyer",
  "Bakırköy Center",
  "Florya, Bakırköy",
  "Yeşilköy, Bakırköy",
  "Beykoz Center",
  "Anadolu Kavağı, Beykoz",
  "Adalar (Princes' Islands)",
  "Büyükada",
  "Heybeliada",
  "Burgazada",
  "Kınalıada",
  
  // Other Districts (European Side)
  "Avcılar Center",
  "Avcılar Sahil",
  "Bağcılar",
  "Bahçelievler",
  "Başakşehir",
  "Bayrampaşa",
  "Beylikdüzü",
  "Büyükçekmece",
  "Çatalca",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan (Eyüp)",
  "Gaziosmanpaşa",
  "Güngören",
  "Kağıthane",
  "Küçükçekmece",
  "Silivri",
  "Sultangazi",
  "Zeytinburnu",

  // Other Districts (Asian Side)
  "Ataşehir",
  "Çekmeköy",
  "Kartal",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sultanbeyli",
  "Şile",
  "Tuzla",
  "Ümraniye",

  // Popular Landmarks / Hotels (Generic)
  "Hagia Sophia Area",
  "Blue Mosque Area",
  "Topkapi Palace Area",
  "Grand Bazaar Area",
  "Galata Tower Area",
  "Istiklal Street",
  "Taksim Square",
  "Dolmabahçe Palace Area",
  "Spice Bazaar Area",
  "Pierre Loti Hill",
  "Maiden's Tower Area",
  "Istanbul Airport (IST)",
  "Sabiha Gökçen Airport (SAW)"
];

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Search for a location...",
  className
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length > 1) {
      const filtered = ISTANBUL_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(newValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (location: string) => {
    onChange(location);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          className={clsx(
            "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium text-slate-700 placeholder:text-slate-400 pl-11",
            className
          )}
          onFocus={() => {
            if (value.length > 1) setShowSuggestions(true);
          }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <MapPin className="w-4 h-4" />
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white mt-1 rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <li
              key={index}
              onClick={() => handleSelect(location)}
              className="p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-none flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <span className="font-medium text-slate-700 block text-sm">{location}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
