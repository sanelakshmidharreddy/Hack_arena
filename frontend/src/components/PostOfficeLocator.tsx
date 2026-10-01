import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  AlertCircle,
  Clock,
  Loader2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getNearbyPostOffices, PostOfficeLocation } from '../services/api';

interface PostOfficeLocatorProps {
  onBack: () => void;
}

export const PostOfficeLocator: React.FC<PostOfficeLocatorProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<PostOfficeLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinQuery, setPinQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasRequestedGeo, setHasRequestedGeo] = useState(false);

  // Request browser geolocation with plain language
  const handleRequestLocation = () => {
    setLoading(true);
    setErrorMsg(null);
    setHasRequestedGeo(true);

    if (!('geolocation' in navigator)) {
      setErrorMsg('మీ పరికరంలో లొకేషన్ సదుపాయం లేదు. దయచేసి పిన్ కోడ్ లేదా ఊరి పేరు నమోదు చేయండి.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const results = await getNearbyPostOffices(lat, lng);
          setLocations(results);
        } catch {
          setErrorMsg('పోస్టాఫీస్ వివరాలు పొందడం విఫలమైంది. దయచేసి పిన్ కోడ్ నమోదు చేయండి.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('లొకేషన్ అనుమతి తిరస్కరించబడింది. దయచేసి క్రింద మీ పిన్ కోడ్ లేదా ఊరి పేరు నమోదు చేయండి.');
        } else {
          setErrorMsg('లొకేషన్ గుర్తించలేకపోయాము. దయచేసి క్రింద మీ పిన్ కోడ్ లేదా ఊరి పేరు నమోదు చేయండి.');
        }
        // Load default local directory fallbacks
        getNearbyPostOffices().then(setLocations);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search by PIN code or village name
  const handleSearchPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinQuery.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const results = await getNearbyPostOffices(undefined, undefined, pinQuery.trim());
      setLocations(results);
    } catch {
      setErrorMsg('వెతకడం విఫలమైంది. దయచేసి అధికారిక నంబరుకు కాల్ చేయండి.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getNearbyPostOffices().then(setLocations);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 space-y-4 text-left animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 min-h-touch px-2"
        >
          ← {t.repeat}
        </button>
        <h2 className="text-base sm:text-lg font-black text-jansakhi-navy flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-jansakhi-saffron" />
          <span>{t.findPostOffice}</span>
        </h2>
      </div>

      {/* Geolocation Request Card */}
      {!hasRequestedGeo && (
        <div className="p-4 sm:p-5 rounded-3xl bg-blue-50/80 border-2 border-blue-200 text-center space-y-3">
          <p className="text-sm text-slate-800 font-semibold leading-relaxed">
            📍 {t.locationPermissionText}
          </p>
          <button
            onClick={handleRequestLocation}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-jansakhi-navy hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 min-h-touch shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4 text-jansakhi-saffron" />}
            <span>{loading ? t.findingLocation : t.useMyLocation}</span>
          </button>
        </div>
      )}

      {/* PIN Code / Village Search Fallback */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-soft">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
          {t.orEnterPin}
        </label>
        <form onSubmit={handleSearchPin} className="flex gap-2">
          <input
            type="text"
            value={pinQuery}
            onChange={(e) => setPinQuery(e.target.value)}
            placeholder={t.pinPlaceholder}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-jansakhi-navy text-sm font-semibold min-h-touch bg-slate-50"
          />
          <button
            type="submit"
            disabled={!pinQuery.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-jansakhi-green hover:bg-emerald-700 text-white font-black text-sm min-h-touch flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{t.searchPinBtn}</span>
          </button>
        </form>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Post Office Cards List */}
      <div className="space-y-3">
        {locations.map((po, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-black text-slate-900 text-base">{po.name}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{po.address}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-jansakhi-navy font-black text-xs flex-shrink-0 border border-blue-100">
                ~{po.distance_km} km
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{po.operating_hours || '10:00 AM - 02:00 PM'}</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                {t.openStatus}
              </span>
            </div>

            {/* Action Buttons: Navigate & Call */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <a
                href={po.deep_link}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-2xl bg-jansakhi-navy hover:bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-1.5 min-h-touch shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-jansakhi-saffron" />
                <span>{t.navigate}</span>
                <ExternalLink className="w-3 h-3 text-slate-300" />
              </a>

              <a
                href={`tel:${po.phone.replace(/[^0-9]/g, '') || '18002666868'}`}
                className="py-3 px-3 rounded-2xl bg-jansakhi-green hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 min-h-touch shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callNow}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Helpline backup */}
      <div className="pt-2 text-center">
        <a
          href="tel:18002666868"
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 min-h-touch shadow-xs"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>{t.officialPhoneIndiaPost}</span>
        </a>
      </div>
    </div>
  );
};
