import React from 'react';
import { Shield, Trash2, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PrivacyModalProps {
  isOpen: boolean;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onClearConversation: () => void;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  privacyMode,
  onTogglePrivacy,
  onClearConversation,
  onClose,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-700" />
            </div>
            <h3 id="privacy-modal-title" className="text-lg font-black text-slate-900">
              {t.privacyTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold leading-relaxed">
            🛡️ {t.privacyNotice}
          </div>

          {/* Privacy mode toggle button */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{t.privacyToggle}</p>
            </div>
            <button
              onClick={onTogglePrivacy}
              className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${
                privacyMode ? 'bg-jansakhi-navy' : 'bg-slate-300'
              }`}
              aria-label="Toggle privacy mode"
            >
              <span
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  privacyMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Clear conversation right now */}
          <button
            onClick={() => {
              onClearConversation();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm border border-rose-200 transition flex items-center justify-center gap-2 min-h-touch"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clearHistory}</span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm min-h-touch"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
