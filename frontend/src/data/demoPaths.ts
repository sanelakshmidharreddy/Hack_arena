import { AssistantResponse, LanguageCode } from '../types';

export interface DemoPath {
  id: string;
  trigger: Record<LanguageCode, string>;
  response: Record<LanguageCode, AssistantResponse>;
}

export const DEMO_PATHS: DemoPath[] = [
  {
    id: 'need_help',
    trigger: {
      te: 'నా బిడ్డ చదువు కోసం సహాయం కావాలి',
      ta: 'என் மகள் படிப்புக்கு உதவி தேவை',
      hi: 'मुझे मेरी बेटी की पढ़ाई के लिए मदद चाहिए',
      en: 'I need help for my daughter\'s education',
    },
    response: {
      te: {
        reply: 'మీ కూతురి భవిష్యత్తు మరియు చదువు కోసం కేంద్ర ప్రభుత్వ "సుకున్య సమృద్ధి పథకం" ఉంది. ఇందులో ప్రభుత్వం మంచి వడ్డీ ఇస్తుంది.',
        intent: 'girl_child_education_assistance',
        needs_clarification: true,
        question: 'మీ కూతురి వయస్సు 10 సంవత్సరాల లోపే ఉందా?',
        question_options: [
          { label: 'అవును (10 ఏళ్ల లోపే)', value: 'yes' },
          { label: 'కాదు (10 ఏళ్లు దాటింది)', value: 'no' }
        ],
        eligible: 'unknown',
        explanation: 'ఈ పథకం 10 సంవత్సరాల లోపు ఆడపిల్లల కోసం మాత్రమే. పోస్టాఫీసులో ఖాతా తెరవవచ్చు.',
        documents: [],
        steps: [],
        next_action: 'వయస్సు అవునా కాదా అని చెప్పండి.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      ta: {
        reply: 'உங்கள் மகளின் கல்வி மற்றும் எதிர்காலத்திற்காக "சுகன்யா சம்ரித்தி யோஜனா" திட்டம் உள்ளது.',
        intent: 'girl_child_education_assistance',
        needs_clarification: true,
        question: 'உங்கள் மகளின் வயது 10 அல்லது அதற்கும் குறைவாக உள்ளதா?',
        question_options: [
          { label: 'ஆம் (10 வயதுக்குள்)', value: 'yes' },
          { label: 'இல்லை (10 வயதுக்கு மேல்)', value: 'no' }
        ],
        eligible: 'unknown',
        explanation: 'இது 10 வயதுக்குட்பட்ட பெண் குழந்தைகளுக்கான சிறந்த அரசு சேமிப்பு திட்டம்.',
        documents: [],
        steps: [],
        next_action: 'வயதை தெரிவியுங்கள்.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      hi: {
        reply: 'आपकी बेटी की शिक्षा और भविष्य के लिए सरकार की "सुकन्या समृद्धि योजना" उपलब्ध है।',
        intent: 'girl_child_education_assistance',
        needs_clarification: true,
        question: 'क्या आपकी बेटी की उम्र 10 वर्ष या उससे कम है?',
        question_options: [
          { label: 'हाँ (10 वर्ष से कम)', value: 'yes' },
          { label: 'नहीं (10 वर्ष से अधिक)', value: 'no' }
        ],
        eligible: 'unknown',
        explanation: 'यह योजना 10 वर्ष से कम उम्र की बालिकाओं के लिए है।',
        documents: [],
        steps: [],
        next_action: 'कृपया अपनी बेटी की उम्र बताएं।',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      en: {
        reply: 'For your daughter\'s education and future, the government provides the "Sukanya Samriddhi Yojana".',
        intent: 'girl_child_education_assistance',
        needs_clarification: true,
        question: 'Is your daughter 10 years of age or younger?',
        question_options: [
          { label: 'Yes (10 years or younger)', value: 'yes' },
          { label: 'No (older than 10)', value: 'no' }
        ],
        eligible: 'unknown',
        explanation: 'This scheme is specifically for girl children up to 10 years old with high government interest.',
        documents: [],
        steps: [],
        next_action: 'Please confirm her age.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
    },
  },
  {
    id: 'eligible_yes',
    trigger: {
      te: 'అవును, నా పాపకు 7 సంవత్సరాలు',
      ta: 'ஆம், என் மகளுக்கு 7 வயது',
      hi: 'हाँ, मेरी बेटी 7 साल की है',
      en: 'Yes, my daughter is 7 years old',
    },
    response: {
      te: {
        reply: 'సంతోషం! మీ కూతురు సుకున్య సమృద్ధి ఖాతాకు పూర్తిగా అర్హురాలు. ఇందులో నెలకు లేదా సంవత్సరానికి కొద్ది మొత్తం జమ చేయవచ్చు.',
        intent: 'check_eligibility',
        needs_clarification: false,
        question: null,
        eligible: 'yes',
        explanation: 'మీరు భారత నివాసి మరియు మీ పాప వయస్సు 10 ఏళ్ల లోపే ఉన్నందున మీరు అర్హులు. కుటుంబంలో గరిష్టంగా ఇద్దరు ఆడపిల్లలకు ఈ పథకం వర్తిస్తుంది.',
        documents: [
          { name: 'పాప జనన ధృవీకరణ పత్రం (Birth Certificate)', purpose: 'వయస్సు నిర్ధారణకు' },
          { name: 'తల్లి లేదా తండ్రి ఆధార్ కార్డు (Aadhaar)', purpose: 'గుర్తింపు మరియు చిరునామా కోసం' },
          { name: '2 పాస్‌పోర్ట్ సైజ్ ఫోటోలు', purpose: 'ఖాతా పుస్తకం కోసం' },
          { name: '₹250 నగదు', purpose: 'ఖాతా ప్రారంభ డిపాజిట్' }
        ],
        steps: [
          { step_number: 1, instruction: 'ఆధార్ మరియు జనన ధృవీకరణ పత్రం సిద్ధం చేసుకోండి.', detail: 'మీ కూతురి బర్త్ సర్టిఫికెట్ మరియు మీ ఆధార్ కార్డు జిరాక్స్ కాపీలు తీసి పెట్టుకోండి.', action_text: 'కాగితాలు సిద్ధం చేసుకున్నాను' },
          { step_number: 2, instruction: '₹250 నగదు చేతిలో ఉంచుకోండి.', detail: 'ఖాతా ప్రారంభించడానికి కనీసం 250 రూపాయలు అవసరం.', action_text: 'నగదు సిద్ధంగా ఉంది' },
          { step_number: 3, instruction: 'మీ దగ్గరలోని పోస్టాఫీసు లేదా ప్రభుత్వ బ్యాంకుకు వెళ్లండి.', detail: 'పోస్టాఫీసు సిబ్బందికి "సుకున్య సమృద్ధి ఫారం" కావాలని అడగండి. వారు ఉచితంగా ఫారం ఇచ్చి నింపడానికి సహాయం చేస్తారు.', action_text: 'పోస్టాఫీసుకి చేరుకున్నాను' },
          { step_number: 4, instruction: 'కాగితాలు ఇచ్చి పాస్‌బుక్ తీసుకోండి.', detail: 'జిరాక్స్ కాపీలు మరియు 250 రూపాయలు కట్టి రసీదు మరియు మీ సుకున్య పాస్‌బుక్ పొందండి.', action_text: 'పూర్తయింది' }
        ],
        next_action: 'రేపు ఉదయం 10 గంటలకు మీ సమీప పోస్టాఫీసుకు ఆధార్, బర్త్ సర్టిఫికెట్‌తో వెళ్లండి.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      ta: {
        reply: 'மகிழ்ச்சி! உங்கள் மகள் சுகன்யா சம்ரித்தி திட்டத்திற்கு முழு தகுதியுடையவர்.',
        intent: 'check_eligibility',
        needs_clarification: false,
        question: null,
        eligible: 'yes',
        explanation: 'உங்கள் மகளுக்கு 10 வயதுக்கு குறைவாக இருப்பதால் இந்த திட்டத்திற்கு விண்ணப்பிக்கலாம்.',
        documents: [
          { name: 'மகளின் பிறப்புச் சான்றிதழ்', purpose: 'வயதை உறுதி செய்ய' },
          { name: 'பெற்றோர் ஆதார் அட்டை', purpose: 'அடையாளச் சான்று' },
          { name: '2 புகைப்படங்கள்', purpose: 'வங்கி கணக்கிற்கு' },
          { name: '₹250 பணம்', purpose: 'ஆரம்ப வைப்புத்தொகை' }
        ],
        steps: [
          { step_number: 1, instruction: 'ஆதார் மற்றும் பிறப்புச் சான்றிதழ் நகல் எடுக்கவும்.', detail: 'அசலும் ஒரு நகலும் தயாராக வைக்கவும்.', action_text: 'தயாராக உள்ளது' },
          { step_number: 2, instruction: '₹250 பணத்தை தயாராக வைக்கவும்.', detail: 'கணக்கு தொடங்க குறைந்தபட்சம் 250 ரூபாய் தேவை.', action_text: 'பணம் தயார்' },
          { step_number: 3, instruction: 'அருகிலுள்ள தபால் அலுவலகம் செல்லுங்கள்.', detail: 'அங்குள்ள தபால் அதிகாரி படிவம் நிரப்ப உதவுவார்.', action_text: 'தபால் அலுவலகம் வந்தேன்' },
          { step_number: 4, instruction: 'ஆவணங்களை சமர்ப்பித்து பாஸ்புக் பெறவும்.', detail: 'உங்கள் கணக்கு உடனடியாக திறக்கப்படும்.', action_text: 'முடிந்தது' }
        ],
        next_action: 'நாளை காலை உங்கள் ஊர் தபால் அலுவலகத்திற்கு ஆதார் மற்றும் பிறப்பு சான்றிதழுடன் செல்லவும்.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      hi: {
        reply: 'बधाई! आपकी बेटी सुकन्या समृद्धि योजना के लिए पूरी तरह पात्र है।',
        intent: 'check_eligibility',
        needs_clarification: false,
        question: null,
        eligible: 'yes',
        explanation: 'आपकी बेटी की आयु 10 वर्ष से कम है, इसलिए आप आसानी से यह खाता खोल सकते हैं।',
        documents: [
          { name: 'बेटी का जन्म प्रमाण पत्र (Birth Certificate)', purpose: 'उम्र सत्यापन हेतु' },
          { name: 'माता/पिता का आधार कार्ड', purpose: 'पहचान और पते के प्रमाण हेतु' },
          { name: '2 पासपोर्ट साइज फोटो', purpose: 'खाता पासबुक हेतु' },
          { name: '₹250 नकद राशि', purpose: 'न्यूनतम खाता खोलने हेतु' }
        ],
        steps: [
          { step_number: 1, instruction: 'बेटी का जन्म प्रमाण पत्र और अपना आधार कार्ड तैयार रखें।', detail: 'इनकी एक-एक फोटोकॉपी अपने साथ रखें।', action_text: 'कागजात तैयार हैं' },
          { step_number: 2, instruction: '₹250 नकद राशि अपने पास रखें।', detail: 'खाता शुरू करने के लिए न्यूनतम 250 रुपये जमा करने होते हैं।', action_text: 'पैसे तैयार हैं' },
          { step_number: 3, instruction: 'अपने नजदीकी डाकघर (Post Office) जाएं।', detail: 'वहां सुकन्या समृद्धि योजना का फॉर्म मांगें। डाकघर कर्मचारी भरने में मदद करेंगे।', action_text: 'डाकघर पहुंच गया' },
          { step_number: 4, instruction: 'फॉर्म और दस्तावेज जमा करके पासबुक प्राप्त करें।', detail: 'पैसे जमा करते ही आपको सुकन्या पासबुक मिल जाएगी।', action_text: 'सम्पन्न' }
        ],
        next_action: 'कल सुबह अपने नजदीकी डाकघर (Post Office) आधार कार्ड और जन्म प्रमाण पत्र लेकर जाएं।',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      en: {
        reply: 'Great news! Your daughter is fully eligible for the Sukanya Samriddhi Yojana account.',
        intent: 'check_eligibility',
        needs_clarification: false,
        question: null,
        eligible: 'yes',
        explanation: 'Since your daughter is under 10 years of age and an Indian resident, you can open this account at any Post Office.',
        documents: [
          { name: 'Girl\'s Birth Certificate', purpose: 'Proof of age' },
          { name: 'Parent/Guardian Aadhaar Card', purpose: 'Identity and address proof' },
          { name: '2 Passport Size Photographs', purpose: 'For account passbook' },
          { name: '₹250 Cash', purpose: 'Minimum initial deposit' }
        ],
        steps: [
          { step_number: 1, instruction: 'Keep Aadhaar and Birth Certificate photocopies ready.', detail: 'Keep original documents with one photocopy each.', action_text: 'Documents Ready' },
          { step_number: 2, instruction: 'Keep ₹250 cash ready.', detail: 'Minimum deposit required to open the account.', action_text: 'Cash Ready' },
          { step_number: 3, instruction: 'Visit your nearest Post Office.', detail: 'Ask for the Sukanya Samriddhi account opening form. Postal staff will assist you.', action_text: 'At Post Office' },
          { step_number: 4, instruction: 'Submit documents and receive your passbook.', detail: 'Pay ₹250 and collect your official passbook.', action_text: 'Finished' }
        ],
        next_action: 'Visit your local Post Office tomorrow between 10 AM and 2 PM with your Aadhaar and daughter\'s Birth Certificate.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
    },
  },
  {
    id: 'documents_query',
    trigger: {
      te: 'ఏ కాగితాలు కావాలి?',
      ta: 'என்னென்ன ஆவணங்கள் தேவை?',
      hi: 'कौन-कौन से कागजात चाहिए?',
      en: 'What documents are required?',
    },
    response: {
      te: {
        reply: 'మీరు కేవలం 2 ముఖ్యమైన కాగితాలు మరియు ₹250 తీసుకెళ్లాలి.',
        intent: 'documents_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'ఎక్కువ కాగితాలు ఏమీ అవసరం లేదు. కేవలం పాప బర్త్ సర్టిఫికెట్ మరియు తల్లిదండ్రుల ఆధార్ కార్డు ఉంటే చాలు.',
        documents: [
          { name: 'పాప జనన ధృవీకరణ పత్రం (Birth Certificate)', purpose: 'వయస్సు నిర్ధారణ' },
          { name: 'తల్లి లేదా తండ్రి ఆధార్ కార్డు', purpose: 'చిరునామా మరియు గుర్తింపు' },
          { name: '2 పాస్‌పోర్ట్ సైజ్ ఫోటోలు', purpose: 'ఖాతా పుస్తకం' },
          { name: '₹250 నగదు', purpose: 'మొదటి డిపాజిట్' }
        ],
        steps: [],
        next_action: 'ఈ కాగితాలు మీ వద్ద ఉంటే "స్టెప్ బై స్టెప్ గైడ్" బటన్ నొక్కండి.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      ta: {
        reply: 'நீங்கள் 2 எளிய ஆவணங்கள் மற்றும் ₹250 மட்டும் எடுத்துச் செல்ல வேண்டும்.',
        intent: 'documents_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'குழந்தையின் பிறப்புச் சான்றிதழ் மற்றும் உங்கள் ஆதார் அட்டை போதுமானது.',
        documents: [
          { name: 'பிறப்புச் சான்றிதழ்', purpose: 'வயது சான்று' },
          { name: 'பெற்றோர் ஆதார் அட்டை', purpose: 'அடையாளச் சான்று' },
          { name: '2 புகைப்படங்கள்', purpose: 'பாஸ்புக்' },
          { name: '₹250 ரொக்கம்', purpose: 'ஆரம்ப வைப்பு' }
        ],
        steps: [],
        next_action: 'இந்த ஆவணங்கள் தயாராக இருந்தால் "வழிகாட்டுங்கள்" பொத்தானை அழுத்தவும்.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      hi: {
        reply: 'आपको केवल 2 मुख्य कागजात और ₹250 लेकर जाना होगा।',
        intent: 'documents_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'ज्यादा कागजात नहीं चाहिए। केवल बेटी का जन्म प्रमाण पत्र और माता-पिता का आधार कार्ड काफी है।',
        documents: [
          { name: 'बेटी का जन्म प्रमाण पत्र', purpose: 'उम्र का सबूत' },
          { name: 'माता-पिता का आधार कार्ड', purpose: 'पहचान और पता' },
          { name: '2 पासपोर्ट फोटो', purpose: 'पासबुक हेतु' },
          { name: '₹250 नकद', purpose: 'खाता शुल्क/जमा' }
        ],
        steps: [],
        next_action: 'दस्तावेज तैयार होने पर "कदम-दर-कदम गाइड" बटन दबाएं।',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      en: {
        reply: 'You only need 2 simple documents and ₹250 cash.',
        intent: 'documents_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'No complex paperwork is needed. Only your daughter\'s birth certificate and your Aadhaar card.',
        documents: [
          { name: 'Girl\'s Birth Certificate', purpose: 'Age proof' },
          { name: 'Parent/Guardian Aadhaar Card', purpose: 'ID & Address proof' },
          { name: '2 Passport Size Photos', purpose: 'Passbook photo' },
          { name: '₹250 Cash', purpose: 'Initial deposit' }
        ],
        steps: [],
        next_action: 'Click "Guide Me step-by-step" to see exactly what to do next.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
    },
  },
  {
    id: 'how_to_proceed',
    trigger: {
      te: 'నేను ఎక్కడికి వెళ్లాలి? ఎలా దరఖాస్తు చేయాలి?',
      ta: 'நான் எங்கு செல்ல வேண்டும்?',
      hi: 'मुझे कहां जाना होगा?',
      en: 'Where should I go to apply?',
    },
    response: {
      te: {
        reply: 'మీ గ్రామంలో లేదా పక్క ఊరిలో ఉన్న పోస్టాఫీసు (తపాలా కార్యాలయం) లేదా స్టేట్ బ్యాంక్ (SBI) కు వెళ్లండి.',
        intent: 'procedure_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'ఆన్‌లైన్ వెబ్‌సైట్లలో వెతకాల్సిన అవసరం లేదు. పోస్టాఫీసులో నేరుగా వెళ్లి ఫారం తీసుకోవచ్చు.',
        documents: [],
        steps: [
          { step_number: 1, instruction: 'కాగితాలు పట్టుకుని పోస్టాఫీసుకు వెళ్లండి.', detail: 'ఉదయం 10 నుండి మధ్యాహ్నం 2 గంటల మధ్య వెళ్లడం మంచిది.', action_text: 'వెళ్లాను' },
          { step_number: 2, instruction: '"సుకున్య సమృద్ధి ఖాతా తెరవాలి" అని చెప్పండి.', detail: 'పోస్టల్ ఉద్యోగి మీకు ఉచితంగా దరఖాస్తు ఫారం ఇస్తారు.', action_text: 'ఫారం తీసుకున్నాను' },
          { step_number: 3, instruction: 'పోస్టల్ సిబ్బందితో ఫారం నింపించండి.', detail: 'మీకు రాయడం రాకపోయినా అక్కడి ఉద్యోగులు సహాయం చేస్తారు.', action_text: 'సహాయం పొందాను' },
          { step_number: 4, instruction: '250 రూపాయలు చెల్లించి పాస్‌బుక్ తీసుకోండి.', detail: 'మీ పాస్‌బుక్ మీద మీ పాప పేరు ఉంటుంది.', action_text: 'పాస్‌బుక్ అందింది' }
        ],
        next_action: 'సమీప పోస్టాఫీసుకు వెళ్లి ఖాతా తెరవండి.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      ta: {
        reply: 'உங்கள் கிராமத்து தபால் அலுவலகம் (Post Office) அல்லது அருகிலுள்ள அரசு வங்கிக்கு செல்லவும்.',
        intent: 'procedure_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'இணையதளங்கள் தேவையில்லை. நேரில் தபால் அலுவலகத்தில் செய்யலாம்.',
        documents: [],
        steps: [
          { step_number: 1, instruction: 'தபால் அலுவலகம் செல்லுங்கள்.', detail: 'காலை 10 மணி முதல் 2 மணிக்குள் செல்லவும்.', action_text: 'சென்றேன்' },
          { step_number: 2, instruction: 'சுகன்யா சம்ரித்தி கணக்கு தொடங்க வேண்டும் என்று கேளுங்கள்.', detail: 'அங்குள்ள அலுவலர் படிவம் தருவார்.', action_text: 'படிவம் பெற்றேன்' },
          { step_number: 3, instruction: 'படிவத்தை பூர்த்தி செய்து ஆவணங்களை இணைக்கவும்.', detail: 'அலுவலர் உங்களுக்கு உதவுவார்.', action_text: 'சமர்ப்பித்தேன்' },
          { step_number: 4, instruction: '₹250 செலுத்தி பாஸ்புக் பெற்றுக்கொள்ளவும்.', detail: 'பாஸ்புக் பத்திரமாக வைக்கவும்.', action_text: 'முடிந்தது' }
        ],
        next_action: 'அருகிலுள்ள தபால் அலுவலகத்திற்கு நேரில் செல்லுங்கள்.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      hi: {
        reply: 'अपने गांव या पास के डाकघर (Post Office) या स्टेट बैंक (SBI) जाएं।',
        intent: 'procedure_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'किसी वेबसाइट पर जाने की जरूरत नहीं है। डाकघर में सीधे काम हो जाता है।',
        documents: [],
        steps: [
          { step_number: 1, instruction: 'डाकघर (Post Office) जाएं।', detail: 'सुबह 10 बजे से दोपहर 2 बजे के बीच जाना सबसे अच्छा है।', action_text: 'पहुंच गए' },
          { step_number: 2, instruction: 'कर्मचारी से कहें: "मुझे बेटी का सुकन्या समृद्धि खाता खोलना है"।', detail: 'वे आपको मुफ्त फॉर्म देंगे।', action_text: 'फॉर्म मिल गया' },
          { step_number: 3, instruction: 'कर्मचारी की मदद से फॉर्म भरवाएं।', detail: 'लिखना न आने पर वे खुद फॉर्म भर देंगे।', action_text: 'मदद मिली' },
          { step_number: 4, instruction: '₹250 जमा करके अपनी पासबुक प्राप्त करें।', detail: 'पासबुक संभाल कर रखें।', action_text: 'पासबुक मिल गई' }
        ],
        next_action: 'कल सुबह अपने गांव के डाकघर जाएं।',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      en: {
        reply: 'Visit your local Post Office or nearest public sector bank branch (like SBI).',
        intent: 'procedure_inquiry',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'No need to search any website or portal. This service is available in-person at any Post Office.',
        documents: [],
        steps: [
          { step_number: 1, instruction: 'Visit the Post Office.', detail: 'Best time is between 10 AM and 2 PM on weekdays.', action_text: 'Visited' },
          { step_number: 2, instruction: 'Ask the postal counter for the Sukanya Samriddhi account opening form.', detail: 'The form is free of charge.', action_text: 'Got Form' },
          { step_number: 3, instruction: 'Staff will help you fill the form.', detail: 'You don\'t need to worry if you can\'t write English; postal staff will fill details.', action_text: 'Assisted' },
          { step_number: 4, instruction: 'Deposit ₹250 and collect your official passbook.', detail: 'Keep the passbook safe at home.', action_text: 'Completed' }
        ],
        next_action: 'Visit your local Post Office tomorrow with documents.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
    },
  },
  {
    id: 'explain_simply',
    trigger: {
      te: 'నాకు అర్థం కాలేదు, సులభంగా చెప్పండి',
      ta: 'எனக்கு புரியவில்லை, எளிமையாக சொல்லுங்கள்',
      hi: 'मुझे समझ नहीं आया, सरल भाषा में समझाइए',
      en: 'I don\'t understand, explain simply',
    },
    response: {
      te: {
        reply: 'సులభంగా చెప్పాలంటే: ఇది మీ పాప కోసం ప్రభుత్వం ఇచ్చే ప్రత్యేక పోస్టాఫీస్ పొదుపు పుస్తకం.',
        intent: 'simplify_explanation',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'మీరు కేవలం ₹250 కట్టి పోస్టాఫీసులో ఖాతా తెరవవచ్చు. ప్రభుత్వం అధిక వడ్డీ ఇస్తుంది. పాప పెద్దయ్యాక చదువుకు ఈ డబ్బు ఉపయోగపడుతుంది. ఆధార్ మరియు బర్త్ సర్టిఫికెట్ ఉంటే చాలు.',
        documents: [
          { name: 'పాప బర్త్ సర్టిఫికెట్', purpose: 'వయస్సు కోసం' },
          { name: 'తల్లిదండ్రుల ఆధార్', purpose: 'గుర్తింపు కోసం' }
        ],
        steps: [],
        next_action: 'పోస్టాఫీసుకు వెళ్లడానికి సిద్ధంగా ఉంటే "గైడ్ మీ" నొక్కండి.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      ta: {
        reply: 'எளிய வார்த்தைகளில்: இது உங்கள் மகளுக்காக தபால் அலுவலகத்தில் திறக்கப்படும் சேமிப்பு கணக்கு.',
        intent: 'simplify_explanation',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'ரூபாய் 250 மட்டும் போதும். அரசாங்கம் அதிக வட்டி கொடுக்கும். உங்கள் மகள் படிப்புக்கு இந்த பணம் உதவும். ஆதார் மற்றும் பிறப்புச் சான்றிதழ் மட்டுமே தேவை.',
        documents: [
          { name: 'மகளின் பிறப்பு சான்றிதழ்', purpose: 'வயதுக்கு' },
          { name: 'உங்கள் ஆதார் அட்டை', purpose: 'அடையாளத்திற்கு' }
        ],
        steps: [],
        next_action: 'தயாராக இருந்தால் "வழிகாட்டுங்கள்" பொத்தானை அழுத்தவும்.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      hi: {
        reply: 'सीधे शब्दों में: यह आपकी बेटी के लिए डाकघर (Post Office) की सरकारी गुल्लक जैसी बचत योजना है।',
        intent: 'simplify_explanation',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'सिर्फ ₹250 देकर डाकघर में खाता खुलता है। सरकार इसपर सबसे ज्यादा ब्याज देती है। बेटी के 18 वर्ष का होने पर पढ़ाई के लिए यह पैसा काम आएगा।',
        documents: [
          { name: 'बेटी का जन्म प्रमाण पत्र', purpose: 'उम्र के लिए' },
          { name: 'माता/पिता का आधार', purpose: 'पहचान के लिए' }
        ],
        steps: [],
        next_action: 'आगे बढ़ने के लिए "कदम-दर-कदम गाइड" बटन दबाएं।',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
      en: {
        reply: 'In very simple words: This is a government savings account at the Post Office for your daughter.',
        intent: 'simplify_explanation',
        needs_clarification: false,
        question: null,
        eligible: 'unknown',
        explanation: 'You just need ₹250 to start. The government gives high interest. When your daughter turns 18, you can withdraw this money for her college education. Only Aadhaar and Birth Certificate are needed.',
        documents: [
          { name: 'Girl\'s Birth Certificate', purpose: 'Proof of age' },
          { name: 'Parent\'s Aadhaar Card', purpose: 'Proof of identity' }
        ],
        steps: [],
        next_action: 'Press "Guide Me step-by-step" to see the simple steps.',
        source: 'verified_demo_data',
        confidence: 'verified',
      },
    },
  },
];
