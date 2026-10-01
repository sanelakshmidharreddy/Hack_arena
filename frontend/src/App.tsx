import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LanguageModal } from './components/LanguageModal';
import { VoiceHero } from './components/VoiceHero';
import { Conversation } from './components/Conversation';
import { GuideMe } from './components/GuideMe';
import { EligibilityResult } from './components/EligibilityResult';
import { NextActionCard } from './components/NextActionCard';
import { PrivacyModal } from './components/PrivacyToggle';
import { SUPPORTED_LANGUAGES } from './data/languages';
import {
  AppScreen,
  AssistantResponse,
  ChatMessage,
  LanguageCode,
  VoiceState,
} from './types';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { sendMessage, explainSimply, resetSession } from './services/api';

export function App() {
  const [langCode, setLangCode] = useState<LanguageCode>('te'); // Default to Telugu for authentic rural demo
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [sessionId] = useState<string>(() => 'session-' + Math.random().toString(36).substring(2, 9));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastResponse, setLastResponse] = useState<AssistantResponse | null>(null);

  const currentLanguage = SUPPORTED_LANGUAGES[langCode];

  // Speech Hooks
  const {
    isListening,
    startListening,
    stopListening,
    error: speechError,
    clearError,
  } = useSpeechRecognition(currentLanguage.voiceLang);

  const { isSpeaking, speak, stop: stopSpeaking } = useSpeechSynthesis();

  // Sync speech hook state with voiceState
  useEffect(() => {
    if (isListening) {
      setVoiceState('listening');
    } else if (isSpeaking) {
      setVoiceState('speaking');
    } else if (voiceState !== 'thinking') {
      setVoiceState('idle');
    }
  }, [isListening, isSpeaking]);

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
        const response = await sendMessage(sessionId, langCode, userInput, inputMode);
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

        // Audio-first experience: automatically read response out loud
        speak(response.reply, currentLanguage.voiceLang);
      } catch (err) {
        console.error('Failed to get assistant response', err);
        setVoiceState('error');
      }
    },
    [sessionId, langCode, currentLanguage.voiceLang, speak, stopSpeaking, clearError]
  );

  // Handle starting voice recognition
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
      const result = await explainSimply(currentText, langCode);
      const simplified = result.simplified_text;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, isSimplified: true, simplifiedText: simplified }
            : m
        )
      );

      setVoiceState('idle');
      speak(simplified, currentLanguage.voiceLang);
    } catch (err) {
      setVoiceState('idle');
    }
  };

  // Handle Listen Message
  const handleListenMessage = (text: string) => {
    speak(text, currentLanguage.voiceLang);
  };

  // Handle Guide Me mode start
  const handleStartGuideMe = () => {
    stopSpeaking();
    setScreen('guide');
    if (lastResponse && lastResponse.steps.length > 0) {
      const firstStep = lastResponse.steps[0];
      speak(`${firstStep.instruction}. ${firstStep.detail}`, currentLanguage.voiceLang);
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

  // Clear Conversation (for privacy mode)
  const handleClearConversation = () => {
    handleReset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-guide-background text-guide-textMain">
      {/* Sticky Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onReset={handleReset}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center justify-start pb-12 w-full">
        {screen === 'home' && (
          <VoiceHero
            language={currentLanguage}
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
              language={currentLanguage}
              onOptionSelect={handleOptionSelect}
              onExplainSimply={handleExplainSimply}
              onListenMessage={handleListenMessage}
              onStartGuideMe={handleStartGuideMe}
              onViewDocuments={() => setScreen('result')}
              isSpeaking={isSpeaking}
            />

            {/* In-chat Voice Bar at bottom */}
            <div className="sticky bottom-4 max-w-md mx-auto px-4 z-20">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-200 p-2 shadow-lifted flex items-center justify-between gap-2">
                <button
                  onClick={handleStartListening}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm min-h-touch transition ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-guide-blue hover:bg-guide-blueHover text-white'
                  }`}
                >
                  <span>{isListening ? 'వింటున్నాం...' : '🎙️ మైక్ నొక్కి మాట్లాడండి'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs min-h-touch"
                >
                  మొదటినుండి
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'guide' && lastResponse && (
          <GuideMe
            steps={lastResponse.steps}
            language={currentLanguage}
            onFinish={() => setScreen('next-action')}
            onExit={() => setScreen('chat')}
            onListen={handleListenMessage}
          />
        )}

        {screen === 'result' && lastResponse && (
          <EligibilityResult
            response={lastResponse}
            language={currentLanguage}
            onStartGuideMe={handleStartGuideMe}
            onGoToNextAction={() => setScreen('next-action')}
            onListen={handleListenMessage}
            onBackToChat={() => setScreen('chat')}
          />
        )}

        {screen === 'next-action' && lastResponse && (
          <NextActionCard
            nextAction={lastResponse.next_action}
            language={currentLanguage}
            onListen={handleListenMessage}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Accessible Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        selectedLanguage={langCode}
        onSelectLanguage={(newLang) => {
          setLangCode(newLang);
          stopSpeaking();
        }}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Shared Device Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        privacyMode={privacyMode}
        onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        onClearConversation={handleClearConversation}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
export default App;
