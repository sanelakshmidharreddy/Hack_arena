import React from 'react';
import { Volume2, Sparkles, ArrowRight, CheckCircle2, HelpCircle, FileText, Check, AlertTriangle, Loader2 } from 'lucide-react';
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
  isExplainingId?: string | null;
}

export const Conversation: React.FC<ConversationProps> = ({
  messages,
  onOptionSelect,
  onExplainSimply,
  onListenMessage,
  onStartGuideMe,
  onViewDocuments,
  isSpeaking,
  isExplainingId,
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
        const isCurrentlyExplaining = isExplainingId === msg.id;

        // Assistant Message Card
        return (
          <div key={msg.id} className="space-y-3">
            <div className="rounded-3xl rounded-tl-none p-5 sm:p-6 bg-white border border-slate-200 shadow-soft space-y-4">
              {/* Badge indicating simplified explanation if applicable */}
              {msg.isSimplified && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-jansakhi-saffron" />
                  <span>{t.simplifiedExplanationBadge}</span>
                </div>
              )}

              {/* Main Response Text */}
              <p className="text-lg sm:text-xl font-bold text-jansakhi-navy leading-relaxed">
                {displayText}
              </p>

              {/* Clarification Question if needs details (One question at a time) */}
              {msg.data?.question && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-jansakhi-wave shrink-0 mt-0.5" />
                    <p className="text-base font-black text-jansakhi-navy">
                      {msg.data.question}
                    </p>
                  </div>

                  {/* 2 Big Clear Choice Buttons */}
                  {msg.data.question_options && msg.data.question_options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {msg.data.question_options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => onOptionSelect(opt.value, opt.label)}
                          className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-slate-200 hover:border-jansakhi-green hover:bg-emerald-50 text-jansakhi-navy font-black text-sm transition flex items-center justify-between min-h-touch shadow-2xs group"
                        >
                          <span>{opt.label}</span>
                          <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-jansakhi-green group-hover:text-white flex items-center justify-center transition">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Eligibility Status Banner */}
              {isEligible && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-jansakhi-green border border-emerald-200 text-sm font-black">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{t.eligibleTitle}</span>
                </div>
              )}

              {isIneligible && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-sm font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{t.ineligibleTitle}</span>
                </div>
              )}

              {/* Quick Action Toolbar for Assistant message */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {/* 🔊 Only ONE Audio Control: Listen Again */}
                <button
                  onClick={() => onListenMessage(displayText)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-touch ${
                    isSpeaking
                      ? 'bg-blue-100 text-jansakhi-navy border border-blue-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                  aria-label={t.listenAgain}
                >
                  <Volume2 className="w-4 h-4 text-jansakhi-wave" />
                  <span>{t.listenAgain}</span>
                </button>

                {/* 💡 Explain Simply Button with Loading State */}
                {!msg.isSimplified && (
                  <button
                    onClick={() => onExplainSimply(msg.id, msg.text)}
                    disabled={isCurrentlyExplaining}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition min-h-touch disabled:opacity-60"
                    aria-label={t.explainSimply}
                  >
                    {isCurrentlyExplaining ? (
                      <>
                        <Loader2 className="w-4 h-4 text-jansakhi-saffron animate-spin" />
                        <span>{t.thinkingState}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-jansakhi-saffron" />
                        <span>{t.explainSimply}</span>
                      </>
                    )}
                  </button>
                )}
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
