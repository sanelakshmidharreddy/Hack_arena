import React from 'react';
import { CheckCircle2, FileText, ArrowRight, Volume2, ShieldCheck } from 'lucide-react';
import { AssistantResponse, Language } from '../types';

interface EligibilityResultProps {
  response: AssistantResponse;
  language: Language;
  onStartGuideMe: () => void;
  onGoToNextAction: () => void;
  onListen: (text: string) => void;
  onBackToChat: () => void;
}

export const EligibilityResult: React.FC<EligibilityResultProps> = ({
  response,
  language,
  onStartGuideMe,
  onGoToNextAction,
  onListen,
  onBackToChat,
}) => {
  const isEligible = response.eligible === 'yes';

  const handleListenAll = () => {
    const docs = response.documents.map((d) => d.name).join('. ');
    const text = `${response.explanation}. కావాల్సిన కాగితాలు: ${docs}. మీ తర్వాతి పని: ${response.next_action}`;
    onListen(text);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center shadow-soft">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <div className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
          ధృవీకరించబడిన ఫలితం
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 mb-2">
          మీరు అర్హులు! (You are Eligible)
        </h3>
        <p className="text-base text-emerald-900 font-medium">
          {response.explanation}
        </p>

        <button
          onClick={handleListenAll}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-sm min-h-touch shadow-xs hover:bg-emerald-50 transition"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>మొత్తం వివరాలు వినండి</span>
        </button>
      </div>

      {/* Documents Needed List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <FileText className="w-6 h-6 text-guide-blue" />
          <h4 className="text-lg font-black text-guide-textMain">
            కావాల్సిన కాగితాలు (మీతో తీసుకెళ్లండి)
          </h4>
        </div>

        <div className="space-y-3">
          {response.documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-guide-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base">{doc.name}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Actions CTA Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onStartGuideMe}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-guide-blue to-guide-accent text-white font-black text-lg shadow-lifted hover:brightness-105 transition flex items-center justify-center gap-3 min-h-touch group"
        >
          <span>స్టెప్ బై స్టెప్ ప్రారంభించండి (Guide Me)</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={onGoToNextAction}
          className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition min-h-touch"
        >
          తర్వాతి ముఖ్యమైన పని చూడండి (Next Action)
        </button>

        <button
          onClick={onBackToChat}
          className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 min-h-touch py-2"
        >
          ← సంభాషణకు తిరిగి వెళ్లండి
        </button>
      </div>
    </div>
  );
};
