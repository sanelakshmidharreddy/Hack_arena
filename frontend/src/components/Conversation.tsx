import React from 'react';
import { Volume2, Sparkles, ArrowRight, CheckCircle2, RotateCcw, HelpCircle, FileText, Check, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ConversationProps {
  messages: ChatMessage[];
  onOptionSelect: (value: string, label: string) => void;
  onExplainSimply: (messageId: string, currentText: string) => void;
  onListenMessage: (text: string) => void;
  onStartGuideMe: () => void;
  onViewDocuments: () => void;
  onFindPostOffice?: () => void;
  isSpeaking: boolean;
}

export const Conversation: React.FC<ConversationProps> = ({
  messages,
  onOptionSelect,
  onExplainSimply,
  onListenMessage,
  onStartGuideMe,
  onViewDocuments,
  onFindPostOffice,
  isSpeaking,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-4">
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        const isLast = index === messages.length - 1;
        const displayText = msg.isSimplified && msg.simplifiedText ? msg.simplifiedText : msg.text;

        if (isUser) {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl rounded-tr-none px-4 py-3 bg-jansakhi-navy text-white shadow-soft">
                <p className="text-base font-semibold leading-relaxed">{displayText}</p>
                <div className="text-[10px] text-blue-200 mt-1 text-right">{t.userSaid}</div>
              </div>
            </div>
          );
        }

        const isEligible = msg.data?.eligible === 'yes';
        const isIneligible = msg.data?.eligible === 'no';

        // Assistant Message Card
        return (
          <div key={msg.id} className="flex flex-col space-y-3">
            {/* Main AI Response Box */}
            <div className="w-full rounded-3xl bg-white border border-slate-200 p-5 shadow-soft">
              {/* Verified Source Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-jansakhi-green">
                  <CheckCircle2 className="w-4 h-4 text-jansakhi-green" />
                  <span>{t.verifiedBadge}</span>
                </div>
                {msg.isSimplified && (
                  <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    {t.simplifiedExplanationBadge}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed mb-4">
                {displayText}
              </div>

              {/* Clarification Question if present (One question at a time) */}
              {msg.data?.question && (
                <div className="mt-3 p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200">
                  <p className="text-xs font-black text-jansakhi-navy mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <HelpCircle className="w-4 h-4 text-jansakhi-saffron" />
                    <span>{t.oneQuestionTitle}</span>
                  </p>
                  <p className="text-base sm:text-lg font-black text-slate-900 mb-3">
                    {msg.data.question}
                  </p>

                  {/* One Question At A Time Options */}
                  {msg.options && msg.options.length > 0 && isLast && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => onOptionSelect(opt.value, opt.label)}
                          className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-jansakhi-navy text-jansakhi-navy font-bold text-sm sm:text-base hover:bg-jansakhi-navy hover:text-white transition shadow-xs min-h-touch flex items-center justify-center gap-2"
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition min-h-touch"
                  aria-label={t.listenAgain}
                >
                  <Volume2 className="w-4 h-4 text-jansakhi-wave" />
                  <span>{t.listenAgain}</span>
                </button>

                {/* 💡 Explain Simply Button */}
                {!msg.isSimplified && (
                  <button
                    onClick={() => onExplainSimply(msg.id, msg.text)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition min-h-touch"
                    aria-label={t.explainSimply}
                  >
                    <Sparkles className="w-4 h-4 text-jansakhi-saffron" />
                    <span>{t.explainSimply}</span>
                  </button>
                )}

                {/* 🔁 Repeat Button */}
                <button
                  onClick={() => onListenMessage(displayText)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition min-h-touch"
                  aria-label={t.repeat}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.repeat}</span>
                </button>
              </div>
            </div>

            {/* If Eligible: Big Primary "Guide Me" Action */}
            {isLast && isEligible && (
              <div className="w-full space-y-2.5 pt-1">
                <button
                  onClick={onStartGuideMe}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-jansakhi-green to-emerald-600 text-white font-black text-base sm:text-lg shadow-lifted hover:brightness-105 transition flex items-center justify-center gap-3 min-h-touch group"
                >
                  <span>{t.guideMe}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={onViewDocuments}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base hover:bg-slate-50 transition flex items-center justify-center gap-2 min-h-touch shadow-2xs"
                >
                  <FileText className="w-5 h-5 text-jansakhi-navy" />
                  <span>{t.viewDocuments}</span>
                </button>
              </div>
            )}

            {/* If Not Eligible: Clear Ineligibility Help */}
            {isLast && isIneligible && (
              <div className="w-full space-y-2.5 pt-1">
                <button
                  onClick={onViewDocuments}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-sm sm:text-base hover:bg-amber-100 transition flex items-center justify-center gap-2 min-h-touch shadow-xs"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>{t.ineligibleTitle} - {t.ineligibleAlternative}</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
