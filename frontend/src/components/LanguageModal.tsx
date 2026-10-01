import React from 'react';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';
import { Check, X } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 id="language-modal-title" className="text-xl font-bold text-slate-900">
              మీ భాషను ఎంచుకోండి
            </h2>
            <p className="text-sm text-slate-500">Choose your language / अपनी भाषा चुनें</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close language selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="mt-4 space-y-3">
          {(Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]).map((code) => {
            const lang = SUPPORTED_LANGUAGES[code];
            const isSelected = selectedLanguage === code;

            return (
              <button
                key={code}
                onClick={() => {
                  onSelectLanguage(code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl text-left border-2 transition min-h-touch ${
                  isSelected
                    ? 'border-guide-blue bg-guide-blueLight/50 text-guide-blue font-bold shadow-xs'
                    : 'border-slate-200 hover:border-guide-accent hover:bg-slate-50 text-slate-800'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                      isSelected
                        ? 'bg-guide-blue text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {code.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xl font-bold">{lang.nativeName}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {lang.name} • {lang.flag}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-guide-blue text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-5 text-center text-xs text-slate-500">
          మీరు ఎప్పుడైనా భాషను సులభంగా మార్చుకోవచ్చు.
        </div>
      </div>
    </div>
  );
};
