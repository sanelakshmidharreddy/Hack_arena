import React from 'react';
import { Volume2, X, Check, Gauge } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceGender: 'FEMALE' | 'MALE';
  onChangeGender: (gender: 'FEMALE' | 'MALE') => void;
  voiceSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onTestVoice: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  voiceGender,
  onChangeGender,
  voiceSpeed,
  onChangeSpeed,
  onTestVoice,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const speeds = [
    { label: '0.8x (నెమ్మదిగా / Slower)', value: 0.8 },
    { label: '0.9x (సహజం / Recommended)', value: 0.9 },
    { label: '1.0x (సాధారణం / Normal)', value: 1.0 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-jansakhi-navy flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-jansakhi-wave" />
            </div>
            <h3 id="voice-modal-title" className="text-lg font-black text-slate-900">
              {t.voiceSettings}
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

        <div className="mt-4 space-y-5 text-left">
          {/* Gender selection */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              {t.voiceGender}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeGender('FEMALE')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-sm transition min-h-touch flex items-center justify-center gap-2 ${
                  voiceGender === 'FEMALE'
                    ? 'border-jansakhi-navy bg-blue-50 text-jansakhi-navy shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{t.femaleVoice}</span>
                {voiceGender === 'FEMALE' && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <button
                onClick={() => onChangeGender('MALE')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-sm transition min-h-touch flex items-center justify-center gap-2 ${
                  voiceGender === 'MALE'
                    ? 'border-jansakhi-navy bg-blue-50 text-jansakhi-navy shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{t.maleVoice}</span>
                {voiceGender === 'MALE' && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* Speed Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>{t.voiceSpeed}</span>
              </label>
              <span className="text-xs font-bold text-jansakhi-navy">{voiceSpeed}x</span>
            </div>

            <div className="space-y-1.5">
              {speeds.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onChangeSpeed(s.value)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between min-h-touch ${
                    voiceSpeed === s.value
                      ? 'border-jansakhi-navy bg-blue-50 text-jansakhi-navy'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.label}</span>
                  {voiceSpeed === s.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={onTestVoice}
            className="w-full py-3 px-4 rounded-2xl bg-guide-blueLight text-jansakhi-navy font-black text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2 min-h-touch"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t.listenAgain} (Test Voice)</span>
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
