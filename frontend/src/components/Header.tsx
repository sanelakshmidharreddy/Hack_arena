import React from 'react';
import { Shield, ShieldAlert, Globe, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Language, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface HeaderProps {
  currentLanguage: Language;
  onOpenLanguageModal: () => void;
  onReset: () => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onOpenLanguageModal,
  onReset,
  privacyMode,
  onTogglePrivacy,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-guide-border shadow-xs">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Title & Identity */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-guide-blue to-guide-accent flex items-center justify-center text-white shadow-md">
            <span className="text-xl font-bold">🇮🇳</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-guide-textMain leading-tight flex items-center gap-1.5">
              <span>డిజిటల్ గైడ్</span>
              <span className="text-xs font-normal text-guide-textMuted hidden sm:inline">| Digital Guide</span>
            </h1>
            <div className="flex items-center gap-1 text-[11px] font-medium text-guide-green">
              <CheckCircle2 className="w-3.5 h-3.5 inline text-guide-green" />
              <span>ధృవీకరించబడిన సమాచారం</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Language, Privacy, Reset */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Language Selector Button */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-guide-blueLight text-guide-blue text-sm font-semibold hover:bg-blue-100 transition min-h-touch touch-manipulation focus:ring-2 focus:ring-guide-blue"
            aria-label={`Change language. Current language is ${currentLanguage.name}`}
          >
            <Globe className="w-4 h-4 text-guide-blue" />
            <span className="font-bold">{currentLanguage.nativeName}</span>
          </button>

          {/* Shared Phone Privacy Mode Button */}
          <button
            onClick={onTogglePrivacy}
            className={`p-2 rounded-lg text-sm font-medium transition min-h-touch min-w-touch flex items-center justify-center ${
              privacyMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={privacyMode ? 'Privacy Mode is Active' : 'Enable Privacy Mode'}
            aria-label={privacyMode ? 'Privacy Mode is Active' : 'Enable Privacy Mode for shared phone'}
          >
            {privacyMode ? (
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            ) : (
              <Shield className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Start Again / Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition min-h-touch min-w-touch flex items-center justify-center"
            title="Start Again from beginning"
            aria-label="Start Again from beginning"
          >
            <RotateCcw className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
      
      {/* Privacy Notice Banner if Active */}
      {privacyMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 text-center font-medium">
          🔒 ప్రైవసీ మోడ్ ఆన్‌లో ఉంది (ఈ ఫోన్‌లో మీ డేటా ఏదీ భద్రపరచబడదు)
        </div>
      )}
    </header>
  );
};
