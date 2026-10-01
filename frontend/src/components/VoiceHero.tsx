import React, { useState } from 'react';
import { Mic, Keyboard, Volume2, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { VoiceState } from '../types';
import { AudioWaveform } from './AudioWaveform';
import { useLanguage } from '../i18n/LanguageContext';

interface VoiceHeroProps {
  voiceState: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitText: (text: string) => void;
  onSelectSampleNeed: (text: string) => void;
  errorMessage?: string | null;
}

export const VoiceHero: React.FC<VoiceHeroProps> = ({
  voiceState,
  onStartListening,
  onStopListening,
  onSubmitText,
  onSelectSampleNeed,
  errorMessage,
}) => {
  const { t } = useLanguage();
  const [showTextInput, setShowTextInput] = useState(false);
  const [inputText, setInputText] = useState('');

  const isListening = voiceState === 'listening';
  const isThinking = voiceState === 'thinking';
  const isSpeaking = voiceState === 'speaking';
  const isError = voiceState === 'error';

  const handleMicClick = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmitText(inputText.trim());
      setInputText('');
      setShowTextInput(false);
    }
  };

  const sampleQuestions = [
    t.sampleNeedHelp,
    t.sampleIsEligible,
    t.sampleDocuments,
    t.sampleFindOffice,
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-4 max-w-lg mx-auto text-center">
      {/* Large Centred Brand Logo */}
      <div className="mb-4 flex flex-col items-center">
        <img
          src="/logo-source.png"
          alt="Jansakhi - Voice AI Digital Guide"
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-contain shadow-soft border-2 border-amber-100 bg-white p-2"
        />
        <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-jansakhi-green text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-jansakhi-green" />
          <span>{t.lastVerifiedBadge}</span>
        </div>
      </div>

      {/* Trust pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-guide-blueLight text-jansakhi-navy text-xs font-bold mb-3 border border-blue-200">
        <Sparkles className="w-3.5 h-3.5 text-jansakhi-saffron" />
        <span>{t.noDepartmentNeeded}</span>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl sm:text-3xl font-black text-jansakhi-navy tracking-tight leading-snug mb-2">
        {t.welcomeHeadline}
      </h2>
      <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6 font-medium">
        {t.welcomeSubtext}
      </p>

      {/* Large Voice Action Hub */}
      <div className="relative flex flex-col items-center justify-center my-2">
        {/* Animated aura rings for listening */}
        {isListening && (
          <div className="absolute w-48 h-48 rounded-full bg-rose-500/20 animate-ping -z-10" />
        )}
        {isThinking && (
          <div className="absolute w-44 h-44 rounded-full bg-amber-400/20 animate-pulse -z-10" />
        )}

        {/* Big Accessible Microphone Button */}
        <button
          onClick={handleMicClick}
          disabled={isThinking}
          className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lifted min-h-touch min-w-touch focus:outline-none focus:ring-4 focus:ring-jansakhi-saffron/50 ${
            isListening
              ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white animate-pulse ring-4 ring-rose-400'
              : isThinking
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white cursor-wait'
              : isSpeaking
              ? 'bg-gradient-to-tr from-jansakhi-green to-emerald-600 text-white ring-4 ring-emerald-300'
              : 'bg-gradient-to-tr from-jansakhi-navy via-jansakhi-wave to-jansakhi-green text-white hover:brightness-105'
          }`}
          aria-label={isListening ? t.listeningState : t.speakPrompt}
        >
          {isThinking ? (
            <Loader2 className="w-14 h-14 animate-spin" />
          ) : isSpeaking ? (
            <div className="flex flex-col items-center">
              <Volume2 className="w-12 h-12 mb-1 animate-pulse" />
              <AudioWaveform color="bg-white" count={5} height="h-4" />
            </div>
          ) : isListening ? (
            <div className="flex flex-col items-center">
              <Mic className="w-14 h-14 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider mt-1">
                {t.listeningState.slice(0, 12)}...
              </span>
            </div>
          ) : (
            <Mic className="w-14 h-14" />
          )}
        </button>

        {/* State Label */}
        <div className="mt-4 min-h-[32px] flex items-center justify-center">
          {isListening && (
            <div className="flex items-center gap-2 text-rose-600 font-extrabold text-base sm:text-lg animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-ping" />
              <span>{t.listeningState}</span>
            </div>
          )}
          {isThinking && (
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-base">
              <span>{t.thinkingState}</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-2 text-jansakhi-green font-extrabold text-base">
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>{t.speakingState}</span>
            </div>
          )}
          {!isListening && !isThinking && !isSpeaking && (
            <div className="text-jansakhi-navy font-black text-base sm:text-lg">
              {t.speakPrompt}
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {isError && errorMessage && (
        <div
          className="mt-4 w-full p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 text-left animate-in fade-in"
          role="alert"
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold">{t.voiceError}</p>
            <p className="text-xs text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Fallback Text Input Toggle */}
      <div className="mt-5 w-full">
        {!showTextInput ? (
          <button
            onClick={() => setShowTextInput(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-jansakhi-wave hover:text-jansakhi-navy transition min-h-touch text-sm shadow-xs"
          >
            <Keyboard className="w-4 h-4 text-jansakhi-wave" />
            <span>{t.typeFallback}</span>
          </button>
        ) : (
          <form onSubmit={handleTextSubmit} className="w-full flex gap-2 animate-in fade-in">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.typePlaceholder}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-jansakhi-navy focus:outline-none text-base min-h-touch bg-white"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-2xl bg-jansakhi-green text-white font-black disabled:opacity-50 hover:bg-emerald-700 transition min-h-touch flex items-center justify-center text-sm shadow-xs"
            >
              {t.askBtn}
            </button>
          </form>
        )}
      </div>

      {/* Quick Example Need Chips */}
      <div className="mt-7 w-full text-left">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2.5">
          {t.samplePromptHeader}
        </p>
        <div className="flex flex-col gap-2">
          {sampleQuestions.map((need, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSampleNeed(need)}
              className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-jansakhi-wave hover:bg-blue-50/50 text-slate-800 text-sm font-bold transition flex items-center justify-between group min-h-touch shadow-2xs"
            >
              <span>"{need}"</span>
              <span className="text-jansakhi-wave font-black opacity-0 group-hover:opacity-100 transition text-xs">
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
