import React from 'react';
import { Volume2, Sparkles, ArrowRight, CheckCircle2, RotateCcw, HelpCircle, FileText, Check } from 'lucide-react';
import { ChatMessage, Language, MessageOption } from '../types';

interface ConversationProps {
  messages: ChatMessage[];
  language: Language;
  onOptionSelect: (value: string, label: string) => void;
  onExplainSimply: (messageId: string, currentText: string) => void;
  onListenMessage: (text: string) => void;
  onStartGuideMe: () => void;
  onViewDocuments: () => void;
  isSpeaking: boolean;
}

export const Conversation: React.FC<ConversationProps> = ({
  messages,
  language,
  onOptionSelect,
  onExplainSimply,
  onListenMessage,
  onStartGuideMe,
  onViewDocuments,
  isSpeaking,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-4">
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        const isLast = index === messages.length - 1;
        const displayText = msg.isSimplified && msg.simplifiedText ? msg.simplifiedText : msg.text;

        if (isUser) {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-none px-4 py-3 bg-guide-blue text-white shadow-sm">
                <p className="text-base font-medium">{displayText}</p>
                <div className="text-[10px] text-blue-200 mt-1 text-right">మీరు అడిగారు</div>
              </div>
            </div>
          );
        }

        // Assistant Message Card
        return (
          <div key={msg.id} className="flex flex-col space-y-3">
            {/* Main AI Response Box */}
            <div className="w-full rounded-2xl bg-white border border-slate-200 p-5 shadow-soft">
              {/* Verified Source Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-guide-green">
                  <CheckCircle2 className="w-4 h-4 text-guide-green" />
                  <span>ధృవీకరించబడిన ప్రభుత్వ పథకం సమాచారం</span>
                </div>
                {msg.isSimplified && (
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    సులభ వివరణ
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="text-lg font-bold text-guide-textMain leading-relaxed mb-4">
                {displayText}
              </div>

              {/* Clarification Question if present (One question at a time) */}
              {msg.data?.question && (
                <div className="mt-3 p-4 rounded-xl bg-guide-blueLight/60 border border-blue-200">
                  <p className="text-sm font-bold text-guide-blue mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>ఒక్క చిన్న ప్రశ్న:</span>
                  </p>
                  <p className="text-base font-extrabold text-slate-900 mb-3">
                    {msg.data.question}
                  </p>

                  {/* One Question At A Time Options */}
                  {msg.options && msg.options.length > 0 && isLast && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => onOptionSelect(opt.value, opt.label)}
                          className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-guide-blue text-guide-blue font-bold text-base hover:bg-guide-blue hover:text-white transition shadow-xs min-h-touch flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Action Toolbar for Assistant message */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {/* 🔊 Listen / Listen Again Button */}
                <button
                  onClick={() => onListenMessage(displayText)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition min-h-touch"
                  aria-label="Listen to this message"
                >
                  <Volume2 className="w-4 h-4 text-guide-blue" />
                  <span>{language.listenAgainBtn}</span>
                </button>

                {/* 💡 Explain Simply Button */}
                {!msg.isSimplified && (
                  <button
                    onClick={() => onExplainSimply(msg.id, msg.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition min-h-touch"
                    aria-label="Explain this simply"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{language.explainSimplyBtn}</span>
                  </button>
                )}

                {/* 🔁 Repeat Button */}
                <button
                  onClick={() => onListenMessage(displayText)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition min-h-touch"
                  aria-label="Repeat the instruction"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language.repeatBtn}</span>
                </button>
              </div>
            </div>

            {/* If Eligible or Steps Ready: Big Primary "Guide Me" Action */}
            {isLast && msg.data?.eligible === 'yes' && (
              <div className="w-full space-y-3 pt-2">
                <button
                  onClick={onStartGuideMe}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-guide-blue to-guide-accent text-white font-extrabold text-lg shadow-lifted hover:brightness-105 transition flex items-center justify-center gap-3 min-h-touch group"
                >
                  <span>{language.guideMeBtn}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={onViewDocuments}
                  className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-base hover:bg-slate-50 transition flex items-center justify-center gap-2 min-h-touch"
                >
                  <FileText className="w-5 h-5 text-guide-blue" />
                  <span>కావాల్సిన కాగితాలు చూడండి</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
