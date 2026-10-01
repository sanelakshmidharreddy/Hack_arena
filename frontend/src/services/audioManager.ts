import { synthesizeCloudTTS } from './api';

type AudioListener = (isSpeaking: boolean) => void;

class AudioManager {
  private currentToken = 0;
  private currentAudio: HTMLAudioElement | null = null;
  private currentAbortController: AbortController | null = null;
  private listeners: Set<AudioListener> = new Set();
  private _isSpeaking = false;

  public get isSpeaking(): boolean {
    return this._isSpeaking;
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this._isSpeaking);
    return () => this.listeners.delete(listener);
  }

  private setSpeaking(val: boolean) {
    if (this._isSpeaking !== val) {
      this._isSpeaking = val;
      this.listeners.forEach((fn) => fn(val));
    }
  }

  /**
   * Immediately aborts any ongoing network fetch, pauses & discards active audio,
   * cancels browser SpeechSynthesis, and increments request token to invalidate in-flight responses.
   */
  public stopAll() {
    this.currentToken++; // Invalidate pending tokens

    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.setSpeaking(false);
  }

  /**
   * Speaks text using Cloud TTS if available, with browser SpeechSynthesis fallback.
   * Cancels any prior audio before starting.
   * Discards late responses if the request token has changed.
   */
  public async speakText(
    text: string,
    language: string,
    voiceGender: 'FEMALE' | 'MALE' = 'FEMALE',
    voiceSpeed: number = 0.95,
    onEnded?: () => void
  ): Promise<boolean> {
    // 1. Stop all ongoing audio and increment request token
    this.stopAll();
    const token = this.currentToken;

    const cleanText = text
      .replace(/[*_#`~[\]()]/g, '')
      .replace(/₹/g, ' రూపాయలు ')
      .trim();

    if (!cleanText) return false;

    this.currentAbortController = new AbortController();

    // 2. Try Google Cloud TTS via Backend
    try {
      this.setSpeaking(true);
      const res = await synthesizeCloudTTS(
        cleanText,
        language as any,
        undefined,
        voiceGender,
        voiceSpeed
      );

      // Check if stale request token
      if (token !== this.currentToken) {
        return false;
      }

      if (res && res.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${res.audioContent}`);
        this.currentAudio = audio;

        return new Promise<boolean>((resolve) => {
          audio.onended = () => {
            if (token === this.currentToken) {
              this.currentAudio = null;
              this.setSpeaking(false);
              onEnded?.();
              resolve(true);
            }
          };

          audio.onerror = () => {
            if (token === this.currentToken) {
              this.currentAudio = null;
              this.setSpeaking(false);
              this.speakBrowser(cleanText, language, voiceSpeed, voiceGender, onEnded);
              resolve(false);
            }
          };

          audio.play().catch(() => {
            if (token === this.currentToken) {
              this.speakBrowser(cleanText, language, voiceSpeed, voiceGender, onEnded);
              resolve(false);
            }
          });
        });
      }
    } catch {
      // Cloud TTS failed or aborted
    }

    // 3. Fallback to Browser SpeechSynthesis if still on the same token
    if (token === this.currentToken) {
      this.speakBrowser(cleanText, language, voiceSpeed, voiceGender, onEnded);
      return true;
    }

    return false;
  }

  private speakBrowser(
    text: string,
    language: string,
    speed: number,
    gender: 'FEMALE' | 'MALE',
    onEnded?: () => void
  ) {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      this.setSpeaking(false);
      return;
    }

    const token = this.currentToken;
    window.speechSynthesis.cancel();

    const localeMap: Record<string, string> = {
      te: 'te-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      en: 'en-IN',
    };
    const targetLocale = localeMap[language] || 'te-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLocale;
    utterance.rate = speed;
    utterance.pitch = gender === 'FEMALE' ? 1.05 : 0.95;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang === targetLocale) ||
      voices.find((v) => v.lang.startsWith(targetLocale.slice(0, 2))) ||
      voices.find((v) => v.lang.includes('IN')) ||
      null;

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (token === this.currentToken) {
        this.setSpeaking(true);
      } else {
        window.speechSynthesis.cancel();
      }
    };

    utterance.onend = () => {
      if (token === this.currentToken) {
        this.setSpeaking(false);
        onEnded?.();
      }
    };

    utterance.onerror = () => {
      if (token === this.currentToken) {
        this.setSpeaking(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const audioManager = new AudioManager();
