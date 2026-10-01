export type LanguageCode = 'te' | 'ta' | 'hi' | 'en';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  welcome: string;
  speakPrompt: string;
  speakSubtext: string;
  typeFallback: string;
  listenBtn: string;
  listenAgainBtn: string;
  explainSimplyBtn: string;
  guideMeBtn: string;
  repeatBtn: string;
  startAgainBtn: string;
  voiceLang: string; // BCP 47 code for Web Speech API
}

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error' | 'success';

export interface MessageOption {
  label: string;
  value: string;
}

export interface DocumentItem {
  name: string;
  purpose: string;
  icon?: string;
}

export interface StepItem {
  step_number: number;
  instruction: string;
  detail: string;
  action_text: string;
}

export interface AssistantResponse {
  reply: string;
  intent: string;
  needs_clarification: boolean;
  question: string | null;
  question_options?: MessageOption[];
  eligible: 'yes' | 'no' | 'unknown';
  explanation: string;
  documents: DocumentItem[];
  steps: StepItem[];
  next_action: string;
  source: string;
  confidence: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  simplifiedText?: string;
  simplifiedLang?: LanguageCode;
  isSimplified?: boolean;
  timestamp: number;
  options?: MessageOption[];
  data?: Partial<AssistantResponse>;
}

export type AppScreen = 'language' | 'home' | 'chat' | 'guide' | 'result' | 'next-action' | 'locator';
