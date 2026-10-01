import React from 'react';
import { Shield, ShieldAlert, Trash2, X, Check } from 'lucide-react';

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
              <Shield className="w-5 h-5" />
            </div>
            <h3 id="privacy-modal-title" className="text-lg font-bold text-slate-900">
              ప్రైవసీ మరియు భద్రత
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Close privacy settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold leading-relaxed">
            🛡️ <strong>షేర్డ్ ఫోన్ భద్రత:</strong> గ్రామీణ ప్రాంతాల్లో ఒకే ఫోన్‌ను కుటుంబ సభ్యులు కలిసి వాడుతుంటారు. ఈ గైడ్ ఎటువంటి పాస్‌వర్డ్‌లు, ఓటీపీలు, లేదా వ్యక్తిగత ఖాతా వివరాలు అడగదు మరియు భద్రపరచదు.
          </div>

          {/* Privacy mode toggle button */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-bold text-slate-900 text-sm">ప్రైవసీ మోడ్ (Privacy Mode)</p>
              <p className="text-xs text-slate-500">సంభాషణ చరిత్రను ఉంచవద్దు</p>
            </div>
            <button
              onClick={onTogglePrivacy}
              className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${
                privacyMode ? 'bg-guide-blue' : 'bg-slate-300'
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
            <span>సంభాషణను ఇప్పుడే తొలగించండి (Clear History)</span>
          </button>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm min-h-touch"
          >
            పూర్తయింది (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
