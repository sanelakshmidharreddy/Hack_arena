import React, { useState } from 'react';
import { Mic, MicOff, Keyboard, Volume2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Language, VoiceState } from '../types';
import { AudioWaveform } from './AudioWaveform';

interface VoiceHeroProps {
  language: Language;
  voiceState: VoiceState;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitText: (text: string) => void;
  onSelectSampleNeed: (text: string) => void;
  errorMessage?: string | null;
}

export const VoiceHero: React.FC<VoiceHeroProps> = ({
  language,
  voiceState,
  onStartListening,
  onStopListening,
  onSubmitText,
  onSelectSampleNeed,
  errorMessage,
}) => {
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

  // Sample real-world needs for quick 1-tap testing
  const sampleNeeds: Record<string, string[]> = {
    te: [
      'నా బిడ్డ చదువు కోసం సహాయం కావాలి',
      'నా పాపకు 7 సంవత్సరాలు, అర్హురాలా?',
      'ఏ కాగితాలు కావాలి?',
    ],
    ta: [
      'என் மகள் படிப்புக்கு உதவி தேவை',
      'என் மகளுக்கு 7 வயது, தகுதி உண்டா?',
      'என்ன ஆவணங்கள் தேவை?',
    ],
    hi: [
      'मुझे मेरी बेटी की पढ़ाई के लिए मदद चाहिए',
      'मेरी बेटी 7 साल की है, क्या वह पात्र है?',
      'कौन-कौन से कागजात चाहिए?',
    ],
    en: [
      "I need help for my daughter's education",
      'My daughter is 7 years old, is she eligible?',
      'What documents are required?',
    ],
  };

  const currentSamples = sampleNeeds[language.code] || sampleNeeds.te;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 max-w-lg mx-auto text-center">
      {/* Trust pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-guide-blueLight text-guide-blue text-xs font-semibold mb-4 border border-blue-200">
        <Sparkles className="w-3.5 h-3.5" />
        <span>ఏ ప్రభుత్వ విభాగాల పేర్లు తెలియాల్సిన పనిలేదు</span>
      </div>

      {/* Main Headline */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-guide-textMain tracking-tight leading-snug mb-2">
        {language.welcome}
      </h2>
      <p className="text-base text-guide-textMuted max-w-md mx-auto mb-8 font-medium">
        {language.speakSubtext}
      </p>

      {/* Large Voice Action Hub */}
      <div className="relative flex flex-col items-center justify-center my-4">
        {/* Animated aura rings for listening */}
        {isListening && (
          <div className="absolute w-44 h-44 rounded-full bg-guide-accent/20 animate-ping -z-10" />
        )}
        {isThinking && (
          <div className="absolute w-40 h-40 rounded-full bg-amber-400/20 animate-pulse -z-10" />
        )}

        {/* Big Accessible Microphone Button */}
        <button
          onClick={handleMicClick}
          disabled={isThinking}
          className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lifted min-h-touch min-w-touch focus:outline-none focus:ring-4 focus:ring-guide-accent/50 ${
            isListening
              ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white animate-mic-listening ring-4 ring-rose-400'
              : isThinking
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white cursor-wait'
              : isSpeaking
              ? 'bg-gradient-to-tr from-guide-accent to-guide-accentPurple text-white ring-4 ring-purple-300'
              : 'bg-gradient-to-tr from-guide-blue to-guide-accent text-white hover:brightness-105'
          }`}
          aria-label={
            isListening
              ? 'వింటున్నాము. ఆపడానికి నొక్కండి'
              : 'మైక్రోఫోన్ నొక్కి మాట్లాడండి'
          }
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
              <span className="text-xs font-bold uppercase tracking-wider mt-1">
                వింటున్నాం...
              </span>
            </div>
          ) : (
            <Mic className="w-14 h-14" />
          )}
        </button>

        {/* State Label */}
        <div className="mt-4">
          {isListening && (
            <div className="flex items-center gap-2 text-rose-600 font-bold text-lg animate-pulse">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block animate-ping" />
              <span>స్పష్టంగా మాట్లాడండి...</span>
            </div>
          )}
          {isThinking && (
            <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
              <span>సమాచారాన్ని పరిశీలిస్తున్నాం...</span>
            </div>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-2 text-guide-accentPurple font-bold text-base">
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>వివరణ వినండి...</span>
            </div>
          )}
          {!isListening && !isThinking && !isSpeaking && (
            <div className="text-slate-700 font-bold text-lg">
              {language.speakPrompt}
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {isError && errorMessage && (
        <div
          className="mt-4 w-full p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 text-left animate-in fade-in"
          role="alert"
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold">ధ్వని రికార్డింగ్ విఫలమైంది</p>
            <p className="text-xs text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Fallback Text Input Toggle */}
      <div className="mt-6 w-full">
        {!showTextInput ? (
          <button
            onClick={() => setShowTextInput(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-guide-blue hover:text-guide-blue transition min-h-touch text-sm shadow-xs"
          >
            <Keyboard className="w-4 h-4" />
            <span>{language.typeFallback}</span>
          </button>
        ) : (
          <form onSubmit={handleTextSubmit} className="w-full flex gap-2 animate-in fade-in">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ఉదా: నా కూతురి చదువు కోసం సహాయం..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-guide-blue focus:outline-none text-base min-h-touch bg-white"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-xl bg-guide-blue text-white font-bold disabled:opacity-50 hover:bg-guide-blueHover transition min-h-touch flex items-center justify-center text-sm"
            >
              అడగండి
            </button>
          </form>
        )}
      </div>

      {/* Quick Example Need Chips */}
      <div className="mt-8 w-full text-left">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          👉 లేదా వీటిలో ఒకదాన్ని నొక్కండి:
        </p>
        <div className="flex flex-col gap-2">
          {currentSamples.map((need, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSampleNeed(need)}
              className="w-full text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-guide-blue hover:bg-guide-blueLight/30 text-slate-800 text-sm font-semibold transition flex items-center justify-between group min-h-touch"
            >
              <span>"{need}"</span>
              <span className="text-guide-blue font-bold opacity-0 group-hover:opacity-100 transition text-xs">
                ఎంచుకోండి →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
