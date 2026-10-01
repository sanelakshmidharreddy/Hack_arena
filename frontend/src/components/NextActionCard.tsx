import React from 'react';
import { MapPin, Volume2, RotateCcw, ExternalLink, CheckCircle, Clock, PhoneCall } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface NextActionCardProps {
  nextAction: string;
  onListen: (text: string) => void;
  onReset: () => void;
  onFindPostOffice?: () => void;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  nextAction,
  onListen,
  onReset,
  onFindPostOffice,
}) => {
  const { t, language } = useLanguage();

  const getStepsByLanguage = () => {
    switch (language) {
      case 'hi':
        return [
          {
            title: 'कहाँ जाना है?',
            detail: 'अपने गांव या नजदीकी डाकघर (Post Office).',
            icon: MapPin,
          },
          {
            title: 'किस समय जाएं?',
            detail: 'सोमवार से शुक्रवार, सुबह 10:00 से दोपहर 2:00 बजे तक.',
            icon: Clock,
          },
          {
            title: 'साथ में क्या ले जाएं?',
            detail: 'आधार कार्ड, बच्ची का जन्म प्रमाण पत्र, 2 फोटो और ₹250 नकद.',
            icon: CheckCircle,
          },
        ];
      case 'ta':
        return [
          {
            title: 'எங்கு செல்ல வேண்டும்?',
            detail: 'உங்கள் கிராமம் அல்லது அருகில் உள்ள தபால் நிலையம் (Post Office).',
            icon: MapPin,
          },
          {
            title: 'எந்த நேரத்தில் செல்ல வேண்டும்?',
            detail: 'திங்கள் முதல் வெள்ளி வரை, காலை 10:00 மணி முதல் மதியம் 2:00 மணி வரை.',
            icon: Clock,
          },
          {
            title: 'உங்களுடன் என்ன கொண்டு செல்ல வேண்டும்?',
            detail: 'ஆதார் அட்டை, மகளின் பிறப்புச் சான்றிதழ், 2 புகைப்படங்கள் மற்றும் ₹250 ரொக்கம்.',
            icon: CheckCircle,
          },
        ];
      case 'en':
        return [
          {
            title: 'Where to go?',
            detail: 'Nearest Post Office branch in your village or town.',
            icon: MapPin,
          },
          {
            title: 'When to visit?',
            detail: 'Monday to Friday, 10:00 AM to 2:00 PM.',
            icon: Clock,
          },
          {
            title: 'What to bring?',
            detail: 'Aadhaar card, daughter birth certificate, 2 photos, and ₹250 cash.',
            icon: CheckCircle,
          },
        ];
      case 'te':
      default:
        return [
          {
            title: 'మీరు వెళ్లవలసిన ప్రదేశం',
            detail: 'మీ గ్రామంలోని లేదా సమీప పోస్టాఫీస్ (తపాలా కార్యాలయం).',
            icon: MapPin,
          },
          {
            title: 'వెళ్లవలసిన సమయం',
            detail: 'సోమవారం నుండి శుక్రవారం, ఉదయం 10:00 నుండి మధ్యాహ్నం 2:00 వరకు.',
            icon: Clock,
          },
          {
            title: 'మీతో తీసుకెళ్లాల్సినవి',
            detail: 'ఆధార్ కార్డు, పాప బర్త్ సర్టిఫికెట్, 2 ఫోటోలు మరియు ₹250 నగదు.',
            icon: CheckCircle,
          },
        ];
    }
  };

  const steps = getStepsByLanguage();

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-5 animate-in fade-in">
      {/* Hero card */}
      <div className="bg-white rounded-3xl border-2 border-jansakhi-navy/30 p-6 sm:p-8 shadow-soft text-center">
        <div className="w-16 h-16 rounded-2xl bg-jansakhi-navy text-white mx-auto flex items-center justify-center mb-4 shadow-md">
          <MapPin className="w-9 h-9 text-jansakhi-saffron" />
        </div>

        <span className="text-xs font-black uppercase tracking-wider text-jansakhi-navy bg-guide-blueLight px-3 py-1 rounded-full">
          {t.nextStepTitle}
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-jansakhi-navy mt-3 mb-2 leading-snug">
          {nextAction}
        </h3>

        {/* 🔊 Listen Again Button */}
        <button
          onClick={() => onListen(nextAction)}
          className="mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-jansakhi-navy text-white font-bold text-sm min-h-touch hover:bg-slate-900 transition shadow-xs"
        >
          <Volume2 className="w-5 h-5" />
          <span>{t.listenAgain}</span>
        </button>
      </div>

      {/* Summary steps cards */}
      <div className="space-y-3">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3.5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-jansakhi-navy flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-jansakhi-navy" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Help Contacts & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <a
          href="tel:18002666868"
          className="w-full py-3.5 px-4 rounded-2xl bg-jansakhi-green hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 min-h-touch shadow-xs"
        >
          <PhoneCall className="w-4 h-4" />
          <span>1800-266-6868 ({t.callNow})</span>
        </a>

        {onFindPostOffice && (
          <button
            onClick={onFindPostOffice}
            className="w-full py-3.5 px-4 rounded-2xl bg-jansakhi-navy hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 min-h-touch shadow-xs"
          >
            <MapPin className="w-4 h-4 text-jansakhi-saffron" />
            <span>{t.findPostOffice}</span>
          </button>
        )}
      </div>

      {/* Start Again and Official Info buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={onReset}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 min-h-touch"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.startAgain}</span>
        </button>

        <a
          href="https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-touch"
        >
          <span>{t.officialPortal}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
