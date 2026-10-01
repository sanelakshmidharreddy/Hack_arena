import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LanguageModal } from './components/LanguageModal';
import { VoiceHero } from './components/VoiceHero';
import { Conversation } from './components/Conversation';
import { GuideMe } from './components/GuideMe';
import { EligibilityResult } from './components/EligibilityResult';
import { NextActionCard } from './components/NextActionCard';
import { PrivacyModal } from './components/PrivacyToggle';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { PostOfficeLocator } from './components/PostOfficeLocator';
import { OfflineBanner } from './components/OfflineBanner';
import { Phone, MapPin } from 'lucide-react';
import {
  AppScreen,
  AssistantResponse,
  ChatMessage,
  VoiceState,
} from './types';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { audioManager } from './services/audioManager';
import { sendMessage, explainSimply, resetSession } from './services/api';
import { vibrateSuccess, vibrateError, vibrateMicStart } from './utils/vibrate';

function AppContent() {
  const { language, setLanguage, t, voiceLang } = useLanguage();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Persisted Voice Settings
  const [voiceGender, setVoiceGender] = useState<'FEMALE' | 'MALE'>(() => {
    try {
      return (localStorage.getItem('jansakhi_voice_gender') as 'FEMALE' | 'MALE') || 'FEMALE';
    } catch {
      return 'FEMALE';
    }
  });

  const [voiceSpeed, setVoiceSpeed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('jansakhi_voice_speed');
      return saved ? parseFloat(saved) : 0.9;
    } catch {
      return 0.9;
    }
  });

  const handleSetVoiceGender = (gender: 'FEMALE' | 'MALE') => {
    setVoiceGender(gender);
    try {
      localStorage.setItem('jansakhi_voice_gender', gender);
    } catch {
      // ignore
    }
  };

  const handleSetVoiceSpeed = (speed: number) => {
    setVoiceSpeed(speed);
    try {
      localStorage.setItem('jansakhi_voice_speed', speed.toString());
    } catch {
      // ignore
    }
  };

  const [privacyMode, setPrivacyMode] = useState(false);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [sessionId] = useState<string>(() => 'session-' + Math.random().toString(36).substring(2, 9));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(null);
  const [isExplainingId, setIsExplainingId] = useState<string | null>(null);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  // Listen to unified AudioManager speaking state
  useEffect(() => {
    const unsub = audioManager.subscribe((speaking) => {
      setIsSpeakingAudio(speaking);
    });
    return () => unsub();
  }, []);

  // Speech Recognition Hook
  const {
    isListening,
    startListening,
    stopListening,
    error: speechError,
    clearError,
  } = useSpeechRecognition(voiceLang);

  // Sync Voice UI State
  useEffect(() => {
    if (isListening) {
      setVoiceState('listening');
    } else if (isSpeakingAudio) {
      setVoiceState('speaking');
    } else if (voiceState !== 'thinking') {
      setVoiceState('idle');
    }
  }, [isListening, isSpeakingAudio]);

  // Stop audio whenever screen or language changes
  useEffect(() => {
    audioManager.stopAll();
  }, [screen, language]);

  // Primary Speak function using unified AudioManager
  const speakText = useCallback(
    (text: string) => {
      audioManager.speakText(text, language, voiceGender, voiceSpeed);
    },
    [language, voiceGender, voiceSpeed]
  );

  // Handle User Input (Voice or Text)
  const handleProcessInput = useCallback(
    async (userInput: string, inputMode: 'voice' | 'text' = 'voice') => {
      if (!userInput.trim()) return;

      audioManager.stopAll();
      clearError();

      const userMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        text: userInput,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setScreen('chat');
      setVoiceState('thinking');

      try {
        const response = await sendMessage(sessionId, language, userInput, inputMode);
        setLastResponse(response);

        const assistantMsg: ChatMessage = {
          id: 'asst-' + Date.now(),
          sender: 'assistant',
          text: response.reply,
          timestamp: Date.now(),
          options: response.question_options,
          data: response,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setVoiceState('idle');

        // Haptic feedback
        if (response.eligible === 'yes') {
          vibrateSuccess();
        } else if (response.eligible === 'no') {
          vibrateError();
        }

        // Voice-first: speak response out loud
        speakText(response.reply);
      } catch (err) {
        console.error('Failed to get assistant response', err);
        setVoiceState('error');
        vibrateError();
      }
    },
    [sessionId, language, speakText, clearError]
  );

  // Handle Voice Listening
  const handleStartListening = () => {
    audioManager.stopAll();
    vibrateMicStart();
    startListening((transcriptText) => {
      if (transcriptText) {
        handleProcessInput(transcriptText, 'voice');
      }
    });
  };

  // Handle option select from "One Question At A Time"
  const handleOptionSelect = (value: string, label: string) => {
    handleProcessInput(label, 'text');
  };

  // Handle Explain Simply with loading state & voice readback
  const handleExplainSimply = async (messageId: string, currentText: string) => {
    try {
      setIsExplainingId(messageId);
      const result = await explainSimply(currentText, language);
      const simplified = result.simplified_text;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, isSimplified: true, simplifiedText: simplified }
            : m
        )
      );

      setIsExplainingId(null);
      speakText(simplified);
    } catch {
      setIsExplainingId(null);
    }
  };

  // Handle Guide Me mode start
  const handleStartGuideMe = () => {
    audioManager.stopAll();
    setScreen('guide');
    if (lastResponse && lastResponse.steps.length > 0) {
      const firstStep = lastResponse.steps[0];
      speakText(`${firstStep.instruction}. ${firstStep.detail}`);
    }
  };

  // Handle Reset / Start Again
  const handleReset = async () => {
    audioManager.stopAll();
    stopListening();
    await resetSession(sessionId);
    setMessages([]);
    setLastResponse(null);
    setScreen('home');
    setVoiceState('idle');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Offline banner at the very top */}
      <OfflineBanner />

      {/* Sticky Top Header */}
      <Header
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onReset={handleReset}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center justify-start pb-16 w-full">
        {screen === 'home' && (
          <div className="w-full">
            <VoiceHero
              voiceState={voiceState}
              onStartListening={handleStartListening}
              onStopListening={stopListening}
              onSubmitText={(txt) => handleProcessInput(txt, 'text')}
              onSelectSampleNeed={(need) => handleProcessInput(need, 'text')}
              onListenPromptText={(txt) => speakText(txt)}
              errorMessage={speechError}
            />

            {/* Persistent Landing Footer Strip with Call and Post Office */}
            <div className="w-full max-w-xl mx-auto px-4 mt-8 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:18002666868"
                  className="py-3.5 px-4 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs min-h-touch transition"
                >
                  <Phone className="w-4 h-4 text-jansakhi-green" />
                  <span>{t.callForHelp}</span>
                </a>

                <button
                  onClick={() => {
                    audioManager.stopAll();
                    setScreen('locator');
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-white border-2 border-blue-200 text-jansakhi-navy hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs min-h-touch transition"
                >
                  <MapPin className="w-4 h-4 text-jansakhi-wave" />
                  <span>{t.findPostOffice}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'chat' && (
          <div className="w-full">
            <Conversation
              messages={messages}
              onOptionSelect={handleOptionSelect}
              onExplainSimply={handleExplainSimply}
              onListenMessage={speakText}
              onStartGuideMe={handleStartGuideMe}
              onViewDocuments={() => setScreen('result')}
              onFindPostOffice={() => setScreen('locator')}
              isSpeaking={isSpeakingAudio}
              isExplainingId={isExplainingId}
            />

            {/* In-chat Voice Bar at bottom */}
            <div className="sticky bottom-4 max-w-md mx-auto px-4 z-20">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-slate-200 p-2 shadow-lifted flex items-center justify-between gap-2">
                <button
                  onClick={handleStartListening}
                  className={`flex-1 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm min-h-touch transition ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-jansakhi-navy hover:bg-slate-900 text-white shadow-xs'
                  }`}
                >
                  <span>{isListening ? t.listeningState : `🎙️ ${t.speakPrompt}`}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs min-h-touch"
                >
                  {t.startAgain}
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'guide' && lastResponse && (
          <GuideMe
            steps={lastResponse.steps}
            onFinish={() => setScreen('next-action')}
            onExit={() => setScreen('chat')}
            onListen={speakText}
          />
        )}

        {screen === 'result' && lastResponse && (
          <EligibilityResult
            response={lastResponse}
            onStartGuideMe={handleStartGuideMe}
            onGoToNextAction={() => setScreen('next-action')}
            onListen={speakText}
            onBackToChat={() => setScreen('chat')}
            onReset={handleReset}
            onFindPostOffice={() => setScreen('locator')}
          />
        )}

        {screen === 'next-action' && lastResponse && (
          <NextActionCard
            nextAction={lastResponse.next_action}
            onListen={speakText}
            onReset={handleReset}
            onFindPostOffice={() => setScreen('locator')}
          />
        )}

        {screen === 'locator' && (
          <PostOfficeLocator onBack={() => setScreen('home')} />
        )}
      </main>

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        selectedLanguage={language}
        onSelectLanguage={(newLang) => {
          setLanguage(newLang);
          audioManager.stopAll();
        }}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        voiceGender={voiceGender}
        onChangeGender={handleSetVoiceGender}
        voiceSpeed={voiceSpeed}
        onChangeSpeed={handleSetVoiceSpeed}
        onTestVoice={() => speakText(t.welcomeHeadline)}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Shared Device Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        onClearConversation={handleReset}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
