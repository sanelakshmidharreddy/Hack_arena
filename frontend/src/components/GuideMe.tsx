import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
import { StepItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { audioManager } from '../services/audioManager';
import { vibrateStepComplete } from '../utils/vibrate';

interface GuideMeProps {
  steps: StepItem[];
  onFinish: () => void;
  onExit: () => void;
  onListen: (text: string) => void;
}

export const GuideMe: React.FC<GuideMeProps> = ({
  steps,
  onFinish,
  onExit,
  onListen,
}) => {
  const { t } = useLanguage();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const step = steps[currentStepIdx] || steps[0] || {
    step_number: 1,
    instruction: 'Visit nearest Post Office',
    detail: 'Speak with the counter staff for Sukanya Samriddhi Yojana form.',
  };

  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === steps.length - 1;
  const progressPercent = ((currentStepIdx + 1) / steps.length) * 100;

  // Speak ONLY the current step whenever the step index changes, cancelling prior audio
  useEffect(() => {
    audioManager.stopAll();
    const textToSpeak = `${step.instruction}. ${step.detail}`;
    onListen(textToSpeak);
    vibrateStepComplete();

    return () => {
      audioManager.stopAll();
    };
  }, [currentStepIdx, step.instruction, step.detail, onListen]);

  const handleNext = () => {
    audioManager.stopAll();
    if (isLast) {
      onFinish();
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    audioManager.stopAll();
    if (!isFirst) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleListenAgain = () => {
    audioManager.stopAll();
    const textToSpeak = `${step.instruction}. ${step.detail}`;
    onListen(textToSpeak);
  };

  const stepCounterText = t.stepCounter
    .replace('{current}', String(currentStepIdx + 1))
    .replace('{total}', String(steps.length));

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 animate-in fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            audioManager.stopAll();
            onExit();
          }}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 min-h-touch px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← {t.back}</span>
        </button>
        <span className="text-xs font-black uppercase tracking-wider bg-guide-blueLight text-jansakhi-navy px-3 py-1 rounded-full border border-blue-200">
          {t.guideMe}
        </span>
      </div>

      {/* Progress Bar & Step Counter */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-black text-jansakhi-navy mb-2">
          <span>{stepCounterText}</span>
          <span className="text-jansakhi-green font-bold">
            {Math.round(progressPercent)}% {t.stepCompleted}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-jansakhi-navy via-jansakhi-wave to-jansakhi-green transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Single Action Focus Card */}
      <div className="w-full bg-white rounded-3xl border-2 border-guide-blue/30 p-6 sm:p-8 shadow-soft text-center relative overflow-hidden">
        {/* Step Badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-guide-blueLight text-jansakhi-navy font-black text-xl mb-4 shadow-2xs">
          {currentStepIdx + 1}
        </div>

        {/* Main Step Instruction */}
        <h3 className="text-xl sm:text-2xl font-black text-jansakhi-navy leading-snug mb-3">
          {step.instruction}
        </h3>

        {/* Detailed Explanation */}
        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed mb-6">
          {step.detail}
        </p>

        {/* Only ONE Audio Button: Listen Again */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={handleListenAgain}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition min-h-touch"
          >
            <Volume2 className="w-4 h-4 text-jansakhi-wave" />
            <span>{t.listenAgain}</span>
          </button>
        </div>

        {/* Navigation Buttons: Next & Previous */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-jansakhi-green to-emerald-600 text-white font-black text-base sm:text-lg shadow-lifted hover:brightness-105 transition flex items-center justify-center gap-2 min-h-touch group"
          >
            <span>{isLast ? t.nextStepTitle : t.nextStepBtn}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>

          {!isFirst && (
            <button
              onClick={handlePrev}
              className="w-full py-3 px-4 rounded-xl text-slate-600 font-bold text-xs hover:text-slate-900 transition min-h-touch"
            >
              {t.prevStepBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
