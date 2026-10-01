import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
        }
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsSpeaking(false);
    }
  }, []);

  // Play Cloud TTS Base64 Audio
  const playBase64Audio = useCallback(
    (base64Audio: string, onEndCallback?: () => void): Promise<boolean> => {
      stop();
      return new Promise((resolve) => {
        try {
          const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
          currentAudioRef.current = audio;

          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            if (onEndCallback) onEndCallback();
            resolve(true);
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            resolve(false);
          };

          audio.play().catch(() => {
            setIsSpeaking(false);
            resolve(false);
          });
        } catch {
          resolve(false);
        }
      });
    },
    [stop]
  );

  // Browser SpeechSynthesis Fallback
  const speakBrowser = useCallback(
    (
      text: string,
      langCode: string = 'te-IN',
      speed: number = 0.95,
      gender: 'FEMALE' | 'MALE' = 'FEMALE',
      onEndCallback?: () => void
    ) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/[*_#`~[\]()]/g, '')
        .replace(/₹/g, ' రూపాయలు ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langCode;
      utterance.rate = speed;
      utterance.pitch = gender === 'FEMALE' ? 1.05 : 0.95;

      const targetPrefix = langCode.slice(0, 2);
      const matchedVoice =
        voices.find((v) => v.lang === langCode) ||
        voices.find((v) => v.lang.startsWith(targetPrefix)) ||
        voices.find((v) => v.lang.includes('IN')) ||
        null;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  return {
    isSpeaking,
    isSupported,
    playBase64Audio,
    speak: speakBrowser,
    stop,
  };
}
