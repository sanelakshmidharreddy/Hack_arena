import React from 'react';
import { Shield, ShieldAlert, Globe, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  onOpenLanguageModal: () => void;
  onReset: () => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLanguageModal,
  onReset,
  privacyMode,
  onTogglePrivacy,
}) => {
  const { t, currentOption } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-guide-border shadow-xs">
      <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand Identity with small logo */}
        <div className="flex items-center space-x-2.5">
          <img
            src="/logo-source.png"
            alt="Jansakhi Logo"
            className="w-10 h-10 rounded-full object-cover shadow-xs border border-amber-200"
          />
          <div>
            <h1 className="text-lg font-black text-jansakhi-navy leading-tight flex items-center gap-1.5">
              <span>{t.appName}</span>
            </h1>
            <div className="flex items-center gap-1 text-[11px] font-bold text-jansakhi-green">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-jansakhi-green" />
              <span>{t.verifiedBadge}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Language, Privacy, Reset */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Language Selector Button */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-guide-blueLight text-jansakhi-navy text-xs font-bold hover:bg-blue-100 transition min-h-touch touch-manipulation focus:ring-2 focus:ring-guide-blue"
            aria-label={`${t.changeLanguage}. ${currentOption.name}`}
          >
            <Globe className="w-4 h-4 text-jansakhi-wave" />
            <span>{currentOption.nativeName}</span>
          </button>

          {/* Privacy Button with Icon + Label */}
          <button
            onClick={onTogglePrivacy}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition min-h-touch ${
              privacyMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={privacyMode ? t.privacyActiveBanner : t.privacyToggle}
            aria-label={privacyMode ? t.privacyActiveBanner : t.privacyToggle}
          >
            {privacyMode ? (
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            ) : (
              <Shield className="w-4 h-4 text-slate-600" />
            )}
            <span className="hidden sm:inline">{privacyMode ? '🔒 On' : '🛡️'}</span>
          </button>

          {/* Start Again / Reset */}
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition min-h-touch min-w-touch flex items-center justify-center"
            title={t.startAgain}
            aria-label={t.startAgain}
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner if Active */}
      {privacyMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-900 text-center font-bold">
          {t.privacyActiveBanner}
        </div>
      )}
    </header>
  );
};
