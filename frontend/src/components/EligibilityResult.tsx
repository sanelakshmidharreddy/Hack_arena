import React from 'react';
import {
  CheckCircle2,
  FileText,
  ArrowRight,
  Volume2,
  AlertTriangle,
  RotateCcw,
  PhoneCall,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { AssistantResponse } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface EligibilityResultProps {
  response: AssistantResponse;
  onStartGuideMe: () => void;
  onGoToNextAction: () => void;
  onListen: (text: string) => void;
  onBackToChat: () => void;
  onReset: () => void;
  onFindPostOffice?: () => void;
}

export const EligibilityResult: React.FC<EligibilityResultProps> = ({
  response,
  onStartGuideMe,
  onGoToNextAction,
  onListen,
  onBackToChat,
  onReset,
  onFindPostOffice,
}) => {
  const { t } = useLanguage();
  const isEligible = response.eligible === 'yes';
  const isIneligible = response.eligible === 'no';

  // Listen to complete eligible result
  const handleListenEligible = () => {
    const docs = response.documents.map((d) => d.name).join('. ');
    const text = `${response.explanation}. ${t.documentsTitle}: ${docs}. ${t.nextStepTitle}: ${response.next_action}`;
    onListen(text);
  };

  // Listen to ineligible explanation and alternatives
  const handleListenIneligible = () => {
    const text = `${t.ineligibleTitle}. ${response.explanation || t.ineligibleWhy}. ${t.ineligiblePostOfficeHelp}`;
    onListen(text);
  };

  // Branch 1: NOT ELIGIBLE SCREEN
  if (isIneligible) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5 animate-in fade-in">
        {/* Kind Ineligible Notice Banner */}
        <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center shadow-soft">
          <div className="w-16 h-16 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
            <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full inline-block mb-2">
            {t.verifiedBadge}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mb-2">
            {t.ineligibleTitle}
          </h3>
          <p className="text-base text-amber-900 font-semibold leading-relaxed">
            {response.explanation || t.ineligibleWhy}
          </p>

          <button
            onClick={handleListenIneligible}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-sm min-h-touch shadow-xs hover:bg-amber-100 transition"
          >
            <Volume2 className="w-4 h-4 text-amber-800" />
            <span>{t.listenAgain}</span>
          </button>
        </div>

        {/* Helpful Alternatives Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-6 h-6 text-jansakhi-saffron" />
            <h4 className="text-base sm:text-lg font-black text-slate-900">
              {t.ineligibleAlternative}
            </h4>
          </div>

          <div className="space-y-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                1. మహిళా సమ్మాన్ పొదుపు పత్రం (Mahila Samman Savings)
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                ఏ వయస్సు మహిళ అయినా గరిష్టంగా ₹2 లక్షల వరకు 7.5% వడ్డీతో పొదుపు చేయవచ్చు.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                2. పబ్లిక్ ప్రావిడెంట్ ఫండ్ (PPF)
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                పిల్లల పేరుతో లేదా స్వంత పేరుతో 15 సంవత్సరాల దీర్ఘకాలిక ప్రభుత్వ పొదుపు ఖాతా (7.1% వడ్డీ).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-jansakhi-navy font-bold leading-relaxed">
            💬 {t.ineligiblePostOfficeHelp}
          </div>
        </div>

        {/* Real Help Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href="tel:18002666868"
            className="w-full py-3.5 px-4 rounded-2xl bg-jansakhi-green hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 min-h-touch shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>1800-266-6868 ({t.callNow})</span>
          </a>

          {onFindPostOffice && (
            <button
              onClick={onFindPostOffice}
              className="w-full py-3.5 px-4 rounded-2xl bg-jansakhi-navy hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 min-h-touch shadow-xs"
            >
              <MapPin className="w-4 h-4 text-jansakhi-saffron" />
              <span>{t.findPostOffice}</span>
            </button>
          )}
        </div>

        {/* Back and Start Again Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onReset}
            className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-300 text-slate-800 font-black text-sm hover:bg-slate-50 transition min-h-touch flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.startAgain}</span>
          </button>
        </div>
      </div>
    );
  }

  // Branch 2: ELIGIBLE SCREEN
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center shadow-soft">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <div className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
          {t.verifiedBadge}
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 mb-2">
          {t.eligibleTitle}
        </h3>
        <p className="text-base text-emerald-900 font-semibold leading-relaxed">
          {response.explanation}
        </p>

        <button
          onClick={handleListenEligible}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-sm min-h-touch shadow-xs hover:bg-emerald-50 transition"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>{t.listenAgain}</span>
        </button>
      </div>

      {/* Documents Needed List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <FileText className="w-6 h-6 text-jansakhi-navy" />
          <h4 className="text-base sm:text-lg font-black text-slate-900">
            {t.documentsTitle}
          </h4>
        </div>

        <div className="space-y-3">
          {response.documents.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-jansakhi-navy text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="text-left">
                <p className="font-extrabold text-slate-900 text-sm sm:text-base">{doc.name}</p>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{doc.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Actions CTA Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onStartGuideMe}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-jansakhi-green to-emerald-600 text-white font-black text-base sm:text-lg shadow-lifted hover:brightness-105 transition flex items-center justify-center gap-3 min-h-touch group"
        >
          <span>{t.guideMe}</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={onGoToNextAction}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base hover:bg-slate-50 transition min-h-touch shadow-2xs"
        >
          {t.nextStepTitle}
        </button>

        <button
          onClick={onBackToChat}
          className="w-full py-3 rounded-xl text-slate-500 font-bold text-xs hover:text-slate-900 transition min-h-touch"
        >
          ← {t.startAgain}
        </button>
      </div>
    </div>
  );
};
