import React, { useState } from 'react';
import { Volume2, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Language, StepItem } from '../types';

interface GuideMeProps {
  steps: StepItem[];
  language: Language;
  onFinish: () => void;
  onExit: () => void;
  onListen: (text: string) => void;
}

export const GuideMe: React.FC<GuideMeProps> = ({
  steps,
  language,
  onFinish,
  onExit,
  onListen,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [simplified, setSimplified] = useState(false);

  const step = steps[currentStepIdx] || steps[0];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === steps.length - 1;
  const progressPercent = ((currentStepIdx + 1) / steps.length) * 100;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentStepIdx((prev) => prev + 1);
      setSimplified(false);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIdx((prev) => prev - 1);
      setSimplified(false);
    }
  };

  const handleListen = () => {
    const textToSpeak = `${step.instruction}. ${step.detail}`;
    onListen(textToSpeak);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 min-h-touch px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>వెనుకకు (Conversation)</span>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider bg-guide-accentLight text-guide-accentPurple px-2.5 py-1 rounded-full border border-purple-200">
          గైడ్ మీ మోడ్ (Guide Me)
        </span>
      </div>

      {/* Progress Bar & Step Counter */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-extrabold text-guide-textMain mb-2">
          <span>దశ {currentStepIdx + 1} / మొత్తం {steps.length}</span>
          <span className="text-guide-blue font-bold">
            {Math.round(progressPercent)}% పూర్తయింది
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-guide-blue to-guide-accent transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Single Action Focus Card */}
      <div className="w-full bg-white rounded-3xl border-2 border-guide-blue/30 p-6 sm:p-8 shadow-soft text-center relative overflow-hidden">
        {/* Step Badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-guide-blueLight text-guide-blue font-black text-xl mb-4">
          {currentStepIdx + 1}
        </div>

        {/* Main Step Instruction */}
        <h3 className="text-2xl sm:text-3xl font-black text-guide-textMain leading-snug mb-3">
          {step.instruction}
        </h3>

        {/* Detailed Explanation */}
        <p className="text-base sm:text-lg text-guide-textMuted font-medium leading-relaxed mb-6">
          {step.detail}
        </p>

        {/* Listen Again and Explain Simply Buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={handleListen}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm min-h-touch transition"
          >
            <Volume2 className="w-4 h-4 text-guide-blue" />
            <span>వినండి (Listen)</span>
          </button>

          <button
            onClick={() => setSimplified(!simplified)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-sm min-h-touch transition"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>సులభంగా చెప్పండి</span>
          </button>
        </div>

        {simplified && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold text-left animate-in fade-in">
            💡 <strong>సులభ మాటల్లో:</strong> ఏ కంగారు పడకండి. మీ ఆధార్ మరియు పాప బర్త్ సర్టిఫికెట్ జిరాక్స్ తీసుకుని మీ ఊరి పోస్టాఫీసుకి వెళ్ళండి, అంతే!
          </div>
        )}

        {/* Done / Next Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-guide-green hover:bg-emerald-700 text-white font-black text-lg shadow-lifted transition flex items-center justify-center gap-3 min-h-touch"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>{step.action_text || (isLast ? 'పూర్తయింది (Done)' : 'చేశాను, తర్వాత స్టెప్ →')}</span>
        </button>

        {/* Back button if not first */}
        {!isFirst && (
          <button
            onClick={handlePrev}
            className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-700 min-h-touch px-4"
          >
            ← మునుపటి స్టెప్ కి వెళ్లండి
          </button>
        )}
      </div>
    </div>
  );
};
