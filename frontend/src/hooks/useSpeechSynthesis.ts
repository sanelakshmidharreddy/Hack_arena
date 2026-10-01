import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, langCode: string = 'te-IN', onEndCallback?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      // Stop any existing speech before starting new
      window.speechSynthesis.cancel();

      // Clean markdown or symbol remnants for cleaner voice playback
      const cleanText = text
        .replace(/[*_#`~[\]()]/g, '')
        .replace(/₹/g, ' రూపాయలు ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langCode;
      utterance.rate = 0.95; // Slightly slower, clear cadence for rural users
      utterance.pitch = 1.0;

      // Try to find the best matching voice
      const targetPrefix = langCode.slice(0, 2);
      const matchedVoice =
        voices.find((v) => v.lang === langCode) ||
        voices.find((v) => v.lang.startsWith(targetPrefix)) ||
        voices.find((v) => v.lang.includes('IN')) ||
        null;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) {
          onEndCallback();
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      currentUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  };
}
