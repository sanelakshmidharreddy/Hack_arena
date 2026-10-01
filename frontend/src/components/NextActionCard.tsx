import React from 'react';
import { MapPin, Volume2, RotateCcw, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Language } from '../types';

interface NextActionCardProps {
  nextAction: string;
  language: Language;
  onListen: (text: string) => void;
  onReset: () => void;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  nextAction,
  language,
  onListen,
  onReset,
}) => {
  const steps = [
    {
      title: 'మీరు వెళ్లవలసిన ప్రదేశం',
      detail: 'మీ గ్రామంలోని లేదా సమీప పోస్టాఫీస్ (తపాలా కార్యాలయం).',
      icon: MapPin,
    },
    {
      title: 'వెళ్లవలసిన సమయం',
      detail: 'సోమవారం నుండి శుక్రవారం, ఉదయం 10:00 నుండి మధ్యాహ్నం 2:00 వరకు.',
      icon: Clock,
    },
    {
      title: 'మీతో తీసుకెళ్లాల్సినవి',
      detail: 'ఆధార్ కార్డు, పాప బర్త్ సర్టిఫికెట్, 2 ఫోటోలు మరియు ₹250 నగదు.',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Hero card */}
      <div className="bg-white rounded-3xl border-2 border-guide-blue p-6 sm:p-8 shadow-lifted text-center">
        <div className="w-16 h-16 rounded-2xl bg-guide-blue text-white mx-auto flex items-center justify-center mb-4 shadow-md">
          <MapPin className="w-9 h-9" />
        </div>

        <span className="text-xs font-black uppercase tracking-wider text-guide-blue bg-guide-blueLight px-3 py-1 rounded-full">
          ఖచ్చితమైన తర్వాతి పని (Next Step)
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-guide-textMain mt-3 mb-2 leading-snug">
          {nextAction}
        </h3>

        <p className="text-sm text-guide-textMuted font-medium mb-6">
          మీరు ఏ వెబ్‌సైట్‌లు చూడాల్సిన పనిలేదు. నేరుగా పోస్టాఫీసు సిబ్బంది మీకు సహాయం చేస్తారు.
        </p>

        {/* 🔊 Listen Again Button */}
        <button
          onClick={() => onListen(nextAction)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-guide-blue text-white font-bold text-sm min-h-touch hover:bg-guide-blueHover transition shadow-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span>ఈ సూచనను వినండి</span>
        </button>
      </div>

      {/* Summary steps cards */}
      <div className="space-y-3">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-guide-blue flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Again and Official Info buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onReset}
          className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-base shadow-md transition flex items-center justify-center gap-2 min-h-touch"
        >
          <RotateCcw className="w-5 h-5" />
          <span>మరొక ప్రశ్న లేదా సహాయం అడగండి (Start Again)</span>
        </button>

        <a
          href="https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-2 min-h-touch"
        >
          <ExternalLink className="w-4 h-4" />
          <span>ప్రభుత్వ పోస్టల్ అధికారిక పోర్టల్ (India Post)</span>
        </a>
      </div>
    </div>
  );
};
