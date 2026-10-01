import React, { useState, useEffect } from 'react';
import { WifiOff, PhoneCall } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-3 shadow-md sticky top-0 z-50 animate-in fade-in">
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-200" />
          <p className="text-xs sm:text-sm font-bold leading-tight">
            {t.offlineBanner}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:18002666868"
            className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-white text-slate-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-amber-50 transition min-h-touch"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>1800-266-6868</span>
          </a>

          <a
            href="tel:181"
            className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-amber-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-amber-900 transition min-h-touch"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>181</span>
          </a>
        </div>
      </div>
    </div>
  );
};
