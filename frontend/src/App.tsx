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
import {
  AppScreen,
  AssistantResponse,
  ChatMessage,
  VoiceState,
} from './types';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { sendMessage, explainSimply, resetSession, synthesizeCloudTTS } from './services/api';

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

  // Speech Hooks
  const {
    isListening,
    startListening,
    stopListening,
    error: speechError,
    clearError,
  } = useSpeechRecognition(voiceLang);

  const { isSpeaking, playBase64Audio, speak, stop: stopSpeaking } = useSpeechSynthesis();

  // Sync speech state
  useEffect(() => {
    if (isListening) {
      setVoiceState('listening');
    } else if (isSpeaking) {
      setVoiceState('speaking');
    } else if (voiceState !== 'thinking') {
      setVoiceState('idle');
    }
  }, [isListening, isSpeaking]);

  // Primary Audio playback: Tries Cloud TTS first, fallback to browser synthesis
  const speakText = useCallback(
    async (text: string) => {
      stopSpeaking();
      try {
        const cloudResult = await synthesizeCloudTTS(text, language, undefined, voiceGender, voiceSpeed);
        if (cloudResult.audioContent) {
          const played = await playBase64Audio(cloudResult.audioContent);
          if (played) return;
        }
      } catch (err) {
        console.warn('Cloud TTS synthesis failed, using browser fallback', err);
      }
      speak(text, voiceLang, voiceSpeed, voiceGender);
    },
    [language, voiceLang, voiceGender, voiceSpeed, playBase64Audio, speak, stopSpeaking]
  );

  // Handle User Input (from Voice or Text)
  const handleProcessInput = useCallback(
    async (userInput: string, inputMode: 'voice' | 'text' = 'voice') => {
      if (!userInput.trim()) return;

      stopSpeaking();
      clearError();

      // Append user message
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

        // Audio-first experience: read response out loud
        speakText(response.reply);
      } catch (err) {
        console.error('Failed to get assistant response', err);
        setVoiceState('error');
      }
    },
    [sessionId, language, speakText, stopSpeaking, clearError]
  );

  // Handle Voice Listening
  const handleStartListening = () => {
    stopSpeaking();
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

  // Handle Explain Simply
  const handleExplainSimply = async (messageId: string, currentText: string) => {
    try {
      setVoiceState('thinking');
      const result = await explainSimply(currentText, language);
      const simplified = result.simplified_text;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, isSimplified: true, simplifiedText: simplified }
            : m
        )
      );

      setVoiceState('idle');
      speakText(simplified);
    } catch {
      setVoiceState('idle');
    }
  };

  // Handle Guide Me mode start
  const handleStartGuideMe = () => {
    stopSpeaking();
    setScreen('guide');
    if (lastResponse && lastResponse.steps.length > 0) {
      const firstStep = lastResponse.steps[0];
      speakText(`${firstStep.instruction}. ${firstStep.detail}`);
    }
  };

  // Handle Reset / Start Again
  const handleReset = async () => {
    stopSpeaking();
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
      <main className="flex-1 flex flex-col items-center justify-start pb-12 w-full">
        {screen === 'home' && (
          <VoiceHero
            voiceState={voiceState}
            onStartListening={handleStartListening}
            onStopListening={stopListening}
            onSubmitText={(txt) => handleProcessInput(txt, 'text')}
            onSelectSampleNeed={(need) => handleProcessInput(need, 'text')}
            errorMessage={speechError}
          />
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
              isSpeaking={isSpeaking}
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
          stopSpeaking();
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
