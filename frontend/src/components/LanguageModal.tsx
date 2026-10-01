import React from 'react';
import { SupportedLanguage } from '../i18n/translations';
import { LANGUAGE_OPTIONS, useLanguage } from '../i18n/LanguageContext';
import { Check, X } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (code: SupportedLanguage) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const languagesList = Object.values(LANGUAGE_OPTIONS);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 id="language-modal-title" className="text-xl font-black text-jansakhi-navy">
              {t.chooseLanguage}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Choose your language / अपनी भाषा चुनें</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="mt-4 space-y-2.5">
          {languagesList.map((lang) => {
            const isSelected = selectedLanguage === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border-2 transition min-h-touch ${
                  isSelected
                    ? 'border-jansakhi-navy bg-guide-blueLight/50 text-jansakhi-navy font-black shadow-xs'
                    : 'border-slate-200 hover:border-jansakhi-wave hover:bg-slate-50 text-slate-800'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-jansakhi-navy text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-black">{lang.nativeName}</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {lang.name} • {lang.flag}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-jansakhi-navy text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
