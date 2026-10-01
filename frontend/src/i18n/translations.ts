export type SupportedLanguage = 'te' | 'ta' | 'hi' | 'en';

export interface Translations {
  appName: string;
  nativeScriptName: string;
  tagline: string;
  verifiedBadge: string;
  lastVerifiedBadge: string;
  changeLanguage: string;
  chooseLanguage: string;
  welcomeHeadline: string;
  welcomeSubtext: string;
  noDepartmentNeeded: string;
  speakPrompt: string;
  listeningState: string;
  thinkingState: string;
  speakingState: string;
  voiceError: string;
  typeFallback: string;
  typePlaceholder: string;
  askBtn: string;
  samplePromptHeader: string;
  sampleNeedHelp: string;
  sampleIsEligible: string;
  sampleDocuments: string;
  sampleFindOffice: string;
  sampleExplainSimply: string;
  // Top Customer Understanding Real Questions
  questionSaveEducation: string;
  questionPapersNeeded: string;
  questionHowMuchMoney: string;
  questionWhereToGo: string;
  questionIsEligible: string;
  questionWhoToCall: string;
  listenAgain: string;
  explainSimply: string;
  repeat: string;
  back: string;
  startAgain: string;
  guideMe: string;
  viewDocuments: string;
  oneQuestionTitle: string;
  eligibleTitle: string;
  ineligibleTitle: string;
  ineligibleWhy: string;
  ineligibleAlternative: string;
  ineligiblePostOfficeHelp: string;
  documentsTitle: string;
  nextStepTitle: string;
  stepCounter: string;
  stepCompleted: string;
  nextStepBtn: string;
  prevStepBtn: string;
  privacyTitle: string;
  privacyNotice: string;
  privacyToggle: string;
  privacyActiveBanner: string;
  clearHistory: string;
  findPostOffice: string;
  findingLocation: string;
  locationPermissionText: string;
  useMyLocation: string;
  orEnterPin: string;
  searchPinBtn: string;
  pinPlaceholder: string;
  callHelpline: string;
  callForHelp: string;
  offlineBanner: string;
  callNow: string;
  voiceSettings: string;
  voiceSpeed: string;
  voiceGender: string;
  femaleVoice: string;
  maleVoice: string;
  vibrationToggle: string;
  navigate: string;
  openStatus: string;
  closedStatus: string;
  officialPortal: string;
  officialPhoneIndiaPost: string;
  officialPhoneWomenHelp: string;
  userSaid: string;
  simplifiedExplanationBadge: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  te: {
    appName: 'జనసఖి (Jansakhi)',
    nativeScriptName: 'తెలుగు',
    tagline: 'గ్రామీణ మహిళల డిజిటల్ మార్గదర్శి',
    verifiedBadge: 'ధృవీకరించబడిన ప్రభుత్వ సమాచారం',
    lastVerifiedBadge: 'ధృవీకరించబడిన తేదీ: అక్టోబర్ 2024',
    changeLanguage: 'భాష మార్చండి',
    chooseLanguage: 'మీ భాషను ఎంచుకోండి',
    welcomeHeadline: 'మీకు దేనిలో సహాయం కావాలి?',
    welcomeSubtext: 'మీ స్వంత భాషలో మాట్లాడండి. ఏ సాంకేతిక పదాలు అవసరం లేదు.',
    noDepartmentNeeded: 'ఏ ప్రభుత్వ శాఖల పేర్లు తెలియాల్సిన పనిలేదు',
    speakPrompt: 'మైక్ నొక్కి మాట్లాడండి',
    listeningState: 'వింటున్నాం... స్పష్టంగా మాట్లాడండి',
    thinkingState: 'ప్రభుత్వ సమాచారాన్ని పరిశీలిస్తున్నాం...',
    speakingState: 'వివరణ వినండి...',
    voiceError: 'ధ్వని రికార్డింగ్ విఫలమైంది',
    typeFallback: 'లేదా ఇక్కడ టైప్ చేయండి',
    typePlaceholder: 'ఉదా: నా కూతురి చదువు కోసం సహాయం...',
    askBtn: 'అడగండి',
    samplePromptHeader: '👉 లేదా వీటిలో ఒకదాన్ని నొక్కండి:',
    sampleNeedHelp: 'నా బిడ్డ చదువు కోసం సహాయం కావాలి',
    sampleIsEligible: 'నా పాపకు 7 సంవత్సరాలు, అర్హురాలా?',
    sampleDocuments: 'ఏ కాగితాలు కావాలి?',
    sampleFindOffice: 'సమీప పోస్టాఫీస్ ఎక్కడ ఉంది?',
    sampleExplainSimply: 'నాకు అర్థం కాలేదు, సులభంగా చెప్పండి',
    questionSaveEducation: 'నా కూతురి చదువు కోసం పొదుపు చేయాలనుకుంటున్నాను',
    questionPapersNeeded: 'నాకు ఏయే కాగితాలు కావాలి?',
    questionHowMuchMoney: 'ఎంత డబ్బు కట్టాలి?',
    questionWhereToGo: 'నేను ఎక్కడికి వెళ్లాలి?',
    questionIsEligible: 'నా కూతురు ఈ పథకానికి అర్హురాలా?',
    questionWhoToCall: 'సహాయం కోసం ఎవరికి ఫోన్ చేయాలి?',
    listenAgain: 'మళ్లీ వినండి',
    explainSimply: 'సులభంగా చెప్పండి',
    repeat: 'మరోసారి చెప్పండి',
    back: 'వెనుకకు',
    startAgain: 'మొదటినుండి ప్రారంభించండి',
    guideMe: 'స్టెప్ బై స్టెప్ గైడ్ చేయండి (గైడ్ మీ)',
    viewDocuments: 'కావాల్సిన కాగితాలు చూడండి',
    oneQuestionTitle: 'ఒక్క చిన్న ప్రశ్న:',
    eligibleTitle: 'మీరు అర్హులు! (You are Eligible)',
    ineligibleTitle: 'ఈ పథకానికి అర్హత లేదు',
    ineligibleWhy: 'కారణం: సుకున్య సమృద్ధి ఖాతా 10 సంవత్సరాల లోపు ఆడపిల్లలకు మాత్రమే వర్తిస్తుంది.',
    ineligibleAlternative: 'మీకు ఉపయోగపడే ఇతర ఉత్తమ ప్రభుత్వ పొదుపు మార్గాలు:',
    ineligiblePostOfficeHelp: 'బాధపడకండి. మీ సమీప పోస్టాఫీస్ అధికారిని సంప్రదిస్తే మహిళా సమ్మాన్ లేదా పబ్లిక్ ప్రావిడెంట్ ఫండ్ (PPF) వంటి ఇతర పథకాలను సూచిస్తారు.',
    documentsTitle: 'కావాల్సిన కాగితాలు (మీతో తీసుకెళ్లండి)',
    nextStepTitle: 'ఖచ్చితమైన తర్వాతి పని (Next Step)',
    stepCounter: 'దశ {current} / మొత్తం {total}',
    stepCompleted: 'పూర్తయింది (Done)',
    nextStepBtn: 'చేశాను, తర్వాత స్టెప్ →',
    prevStepBtn: '← మునుపటి స్టెప్ కి వెళ్లండి',
    privacyTitle: 'ప్రైవసీ మరియు భద్రత',
    privacyNotice: 'షేర్డ్ ఫోన్ భద్రత: కుటుంబ సభ్యులు కలిసి వాడే ఫోన్లలో కూడా మీ డేటా భద్రంగా ఉంటుంది. పాస్‌వర్డ్‌లు, ఓటీపీలు ఎప్పుడూ అడగము.',
    privacyToggle: 'ప్రైవసీ మోడ్ (చరిత్ర భద్రపరచవద్దు)',
    privacyActiveBanner: '🔒 ప్రైవసీ మోడ్ ఆన్‌లో ఉంది (ఈ ఫోన్‌లో మీ డేటా ఏదీ భద్రపరచబడదు)',
    clearHistory: 'సంభాషణను ఇప్పుడే తొలగించండి (Clear History)',
    findPostOffice: 'సమీప పోస్టాఫీస్ కనుగొనండి',
    findingLocation: 'మీ ప్రస్తుత ప్రదేశాన్ని గుర్తిస్తున్నాం...',
    locationPermissionText: 'మీ సమీప పోస్టాఫీస్ చూపించడానికి లొకేషన్ అనుమతిని ఇవ్వండి.',
    useMyLocation: 'నా లొకేషన్ ఉపయోగించండి',
    orEnterPin: 'లేదా మీ పిన్ కోడ్ లేదా ఊరి పేరు నమోదు చేయండి:',
    searchPinBtn: 'వెతకండి',
    pinPlaceholder: 'ఉదా: 500001 లేదా గ్రామం పేరు',
    callHelpline: 'ఉచిత హెల్ప్‌లైన్‌కు కాల్ చేయండి',
    callForHelp: 'సహాయం కోసం కాల్ చేయండి',
    offlineBanner: 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. అయినా పోస్టాఫీస్ హెల్ప్‌లైన్‌కు నేరుగా కాల్ చేయవచ్చు:',
    callNow: 'ఇప్పుడే కాల్ చేయండి',
    voiceSettings: 'వాయిస్ సెట్టింగ్‌లు',
    voiceSpeed: 'స్పీకింగ్ వేగం',
    voiceGender: 'స్వరం ఎంపిక',
    femaleVoice: 'మహిళా స్వరం (Female)',
    maleVoice: 'పురుష స్వరం (Male)',
    vibrationToggle: 'స్పర్శ ప్రకంపనలు (Vibration)',
    navigate: 'రూట్ మ్యాప్ (Navigate)',
    openStatus: 'ప్రస్తుతం తెరిచి ఉంది',
    closedStatus: 'ప్రస్తుతం మూసివేయబడింది',
    officialPortal: 'ఇండియా పోస్ట్ అధికారిక పోర్టల్',
    officialPhoneIndiaPost: 'ఇండియా పోస్ట్ టోల్ ఫ్రీ: 1800-266-6868',
    officialPhoneWomenHelp: 'మహిళా హెల్ప్‌లైన్: 181',
    userSaid: 'మీరు అడిగారు',
    simplifiedExplanationBadge: 'సులభ వివరణ',
  },
  ta: {
    appName: 'ஜனசகி (Jansakhi)',
    nativeScriptName: 'தமிழ்',
    tagline: 'கிராமப்புற பெண்களுக்கான டிஜிட்டல் வழிகாட்டி',
    verifiedBadge: 'சரிபார்க்கப்பட்ட அரசு தகவல்',
    lastVerifiedBadge: 'சரிபார்க்கப்பட்ட தேதி: அக்டோபர் 2024',
    changeLanguage: 'மொழியை மாற்றவும்',
    chooseLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    welcomeHeadline: 'உங்களுக்கு என்ன உதவி தேவை?',
    welcomeSubtext: 'உங்கள் சொந்த மொழியில் பேசுங்கள். தொழில்நுட்ப சொற்கள் தேவையில்லை.',
    noDepartmentNeeded: 'அரசு துறைகளின் பெயர்கள் தெரிய வேண்டியதில்லை',
    speakPrompt: 'மைக் அழுத்தி பேசுங்கள்',
    listeningState: 'கேட்கிறது... தெளிவாகப் பேசுங்கள்',
    thinkingState: 'அரசு தகவலைச் சரிபார்க்கிறது...',
    speakingState: 'விளக்கத்தைக் கேளுங்கள்...',
    voiceError: 'குரல் பதிவு தோல்வியடைந்தது',
    typeFallback: 'அல்லது தட்டச்சு செய்யவும்',
    typePlaceholder: 'உதா: என் மகள் படிப்புக்கு உதவி...',
    askBtn: 'கேளுங்கள்',
    samplePromptHeader: '👉 அல்லது இவற்றில் ஒன்றை அழுத்தவும்:',
    sampleNeedHelp: 'என் மகள் படிப்புக்கு உதவி தேவை',
    sampleIsEligible: 'என் மகளுக்கு 7 வயது, தகுதி உண்டா?',
    sampleDocuments: 'என்னென்ன ஆவணங்கள் தேவை?',
    sampleFindOffice: 'அருகிலுள்ள தபால் அலுவலகம் எங்கே உள்ளது?',
    sampleExplainSimply: 'எனக்கு புரியவில்லை, எளிமையாக சொல்லுங்கள்',
    questionSaveEducation: 'என் மகளின் கல்விக்காக சேமிக்க விரும்புகிறேன்',
    questionPapersNeeded: 'எனக்கு என்ன ஆவணங்கள் தேவை?',
    questionHowMuchMoney: 'எவ்வளவு பணம் செலுத்த வேண்டும்?',
    questionWhereToGo: 'நான் எங்கு செல்ல வேண்டும்?',
    questionIsEligible: 'என் மகள் இதற்கு தகுதியானவளா?',
    questionWhoToCall: 'உதவிக்கு யாரை அழைக்க வேண்டும்?',
    listenAgain: 'மீண்டும் கேளுங்கள்',
    explainSimply: 'எளிதாக விளக்குங்கள்',
    repeat: 'மீண்டும் சொல்லுங்கள்',
    back: 'பின்னால்',
    startAgain: 'மீண்டும் தொடங்கவும்',
    guideMe: 'படிப்படியாக வழிகாட்டுங்கள்',
    viewDocuments: 'தேவையான ஆவணங்களைப் பார்க்கவும்',
    oneQuestionTitle: 'ஒரு எளிய கேள்வி:',
    eligibleTitle: 'நீங்கள் தகுதியுடையவர்! (Eligible)',
    ineligibleTitle: 'இந்த திட்டத்திற்கு தகுதி இல்லை',
    ineligibleWhy: 'காரணம்: சுகன்யா சம்ரித்தி திட்டம் 10 வயதுக்குட்பட்ட பெண் குழந்தைகளுக்கு மட்டுமே பொருந்தும்.',
    ineligibleAlternative: 'உங்களுக்கான மாற்று சிறந்த அரசு சேமிப்பு திட்டங்கள்:',
    ineligiblePostOfficeHelp: 'கவலைப்பட வேண்டாம். தபால் அலுவலகத்தில் மகிளா சம்மான் அல்லது பிபிஎஃப் (PPF) போன்ற திட்டங்களை தொடங்கலாம்.',
    documentsTitle: 'தேவையான ஆவணங்கள் (உங்களுடன் எடுத்துச் செல்லுங்கள்)',
    nextStepTitle: 'அடுத்த முக்கிய நடவடிக்கை (Next Step)',
    stepCounter: 'படி {current} / {total}',
    stepCompleted: 'முடிந்தது (Done)',
    nextStepBtn: 'செய்தேன், அடுத்த படி →',
    prevStepBtn: '← முந்தைய படிக்குச் செல்லவும்',
    privacyTitle: 'தனியுரிமை மற்றும் பாதுகாப்பு',
    privacyNotice: 'பகிரப்பட்ட தொலைபேசி பாதுகாப்பு: கடவுச்சொற்கள் அல்லது OTP எப்போதுமே கேட்கப்படாது.',
    privacyToggle: 'தனியுரிமை முறை (வரலாற்றைச் சேமிக்க வேண்டாம்)',
    privacyActiveBanner: '🔒 தனியுரிமை முறை இயக்கத்தில் உள்ளது (தகவல்கள் சேமிக்கப்படாது)',
    clearHistory: 'உரையாடலை உடனடியாக அழிக்கவும்',
    findPostOffice: 'அருகிலுள்ள தபால் அலுவலகத்தைக் கண்டறியவும்',
    findingLocation: 'உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...',
    locationPermissionText: 'தபால் அலுவலகத்தைக் காட்ட இருப்பிட அனுமதியை வழங்கவும்.',
    useMyLocation: 'என் இருப்பிடத்தைப் பயன்படுத்து',
    orEnterPin: 'அல்லது அஞ்சல் குறியீடு (PIN) உள்ளிடவும்:',
    searchPinBtn: 'தேடுக',
    pinPlaceholder: 'உதா: 600001 அல்லது ஊர் பெயர்',
    callHelpline: 'இலவச உதவி எண்ணை அழைக்கவும்',
    callForHelp: 'உதவிக்கு அழைக்கவும்',
    offlineBanner: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். தபால் உதவி எண்ணை நேரடியாக அழைக்கலாம்:',
    callNow: 'இப்போதே அழைக்கவும்',
    voiceSettings: 'குரல் அமைப்புகள்',
    voiceSpeed: 'பேசும் வேகம்',
    voiceGender: 'குரல் தேர்வு',
    femaleVoice: 'பெண் குரல் (Female)',
    maleVoice: 'ஆண் குரல் (Male)',
    vibrationToggle: 'அதிர்வு (Vibration)',
    navigate: 'வழிசெலுத்தவும் (Navigate)',
    openStatus: 'தற்போது திறந்துள்ளது',
    closedStatus: 'தற்போது மூடப்பட்டுள்ளது',
    officialPortal: 'இந்தியா போஸ்ட் அதிகாரப்பூர்வ தளம்',
    officialPhoneIndiaPost: 'இந்தியா போஸ்ட் உதவி: 1800-266-6868',
    officialPhoneWomenHelp: 'பெண்கள் உதவி எண்: 181',
    userSaid: 'நீங்கள் கேட்டீர்கள்',
    simplifiedExplanationBadge: 'எளிய விளக்கம்',
  },
  hi: {
    appName: 'जनसखी (Jansakhi)',
    nativeScriptName: 'हिन्दी',
    tagline: 'ग्रामीण महिलाओं की डिजिटल मार्गदर्शिका',
    verifiedBadge: 'सत्यापित सरकारी जानकारी',
    lastVerifiedBadge: 'सत्यापित तिथि: अक्टूबर 2024',
    changeLanguage: 'भाषा बदलें',
    chooseLanguage: 'अपनी भाषा चुनें',
    welcomeHeadline: 'आपको किस सहायता की आवश्यकता है?',
    welcomeSubtext: 'अपनी भाषा में खुलकर बताएं। किसी तकनीकी शब्द की आवश्यकता नहीं है।',
    noDepartmentNeeded: 'किसी सरकारी विभाग का नाम जानने की आवश्यकता नहीं है',
    speakPrompt: 'माइक दबाकर बोलें',
    listeningState: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
    thinkingState: 'सरकारी जानकारी की जांच कर रहे हैं...',
    speakingState: 'विवरण सुनें...',
    voiceError: 'आवाज रिकॉर्डिंग विफल रही',
    typeFallback: 'या लिखकर पूछें',
    typePlaceholder: 'उदा: मेरी बेटी की पढ़ाई के लिए मदद...',
    askBtn: 'पूछें',
    samplePromptHeader: '👉 या इनमें से किसी एक को चुनें:',
    sampleNeedHelp: 'मुझे मेरी बेटी की पढ़ाई के लिए मदद चाहिए',
    sampleIsEligible: 'मेरी बेटी 7 साल की है, क्या वह पात्र है?',
    sampleDocuments: 'कौन-कौन से कागजात चाहिए?',
    sampleFindOffice: 'नजदीकी डाकघर कहाँ है?',
    sampleExplainSimply: 'मुझे समझ नहीं आया, सरल भाषा में समझाइए',
    questionSaveEducation: 'मैं अपनी बेटी की पढ़ाई के लिए बचत करना चाहती हूँ',
    questionPapersNeeded: 'मुझे कौन से कागजात चाहिए?',
    questionHowMuchMoney: 'कितने पैसे जमा करने होंगे?',
    questionWhereToGo: 'मुझे कहाँ जाना होगा?',
    questionIsEligible: 'क्या मेरी बेटी इसके लिए पात्र है?',
    questionWhoToCall: 'मदद के लिए किसको फोन करूँ?',
    listenAgain: 'फिर से सुनें',
    explainSimply: 'सरल भाषा में समझाइए',
    repeat: 'दोहराएं',
    back: 'वापस',
    startAgain: 'शुरुआत से शुरू करें',
    guideMe: 'कदम-दर-कदम गाइड करें (गाइड मी)',
    viewDocuments: 'आवश्यक कागजात देखें',
    oneQuestionTitle: 'एक छोटा सा सवाल:',
    eligibleTitle: 'बधाई! आप पात्र हैं! (Eligible)',
    ineligibleTitle: 'इस योजना के लिए पात्र नहीं हैं',
    ineligibleWhy: 'कारण: सुकन्या समृद्धि योजना केवल 10 वर्ष या उससे कम उम्र की बालिकाओं के लिए है।',
    ineligibleAlternative: 'आपके लिए अन्य उपयोगी सरकारी बचत योजनाएं:',
    ineligiblePostOfficeHelp: 'निराश न हों। अपने नजदीकी डाकघर कर्मचारी से मिलें, वे महिला सम्मान बचत प्रमाणपत्र या पीपीएफ (PPF) खाता खोलने में मदद करेंगे।',
    documentsTitle: 'आवश्यक कागजात (साथ लेकर जाएं)',
    nextStepTitle: 'आपका अगला कदम (Next Step)',
    stepCounter: 'चरण {current} / {total}',
    stepCompleted: 'सम्पन्न (Done)',
    nextStepBtn: 'कर लिया, अगला कदम →',
    prevStepBtn: '← पिछले चरण पर जाएं',
    privacyTitle: 'गोपनीयता और सुरक्षा',
    privacyNotice: 'साझा फोन सुरक्षा: कोई पासवर्ड, ओटीपी या बैंक विवरण कभी नहीं पूछा जाएगा और न ही सहेजा जाएगा।',
    privacyToggle: 'गोपनीयता मोड (इतिहास न रखें)',
    privacyActiveBanner: '🔒 गोपनीयता मोड सक्रिय है (इस फोन पर कोई डेटा सुरक्षित नहीं किया जाएगा)',
    clearHistory: 'बातचीत का इतिहास तुरंत हटाएं',
    findPostOffice: 'नजदीकी डाकघर खोजें',
    findingLocation: 'आपका स्थान खोज रहे हैं...',
    locationPermissionText: 'डाकघर दिखाने के लिए कृपया स्थान (Location) की अनुमति दें।',
    useMyLocation: 'मेरा स्थान उपयोग करें',
    orEnterPin: 'या अपना पिन कोड या गांव का नाम दर्ज करें:',
    searchPinBtn: 'खोजें',
    pinPlaceholder: 'उदा: 110001 या गांव का नाम',
    callHelpline: 'निःशुल्क हेल्पलाइन पर कॉल करें',
    callForHelp: 'मदद के लिए कॉल करें',
    offlineBanner: 'आप ऑफलाइन हैं। डाकघर हेल्पलाइन पर सीधे कॉल कर सकते हैं:',
    callNow: 'अभी कॉल करें',
    voiceSettings: 'आवाज सेटिंग्स',
    voiceSpeed: 'बोलने की गति',
    voiceGender: 'आवाज का चयन',
    femaleVoice: 'महिला आवाज (Female)',
    maleVoice: 'पुरुष आवाज (Male)',
    vibrationToggle: 'कंपन (Vibration)',
    navigate: 'रास्ता देखें (Navigate)',
    openStatus: 'अभी खुला है',
    closedStatus: 'अभी बंद है',
    officialPortal: 'इंडिया पोस्ट आधिकारिक पोर्टल',
    officialPhoneIndiaPost: 'डाकघर टोल फ्री: 1800-266-6868',
    officialPhoneWomenHelp: 'महिला हेल्पलाइन: 181',
    userSaid: 'आपने पूछा',
    simplifiedExplanationBadge: 'सरल व्याख्या',
  },
  en: {
    appName: 'Jansakhi',
    nativeScriptName: 'English',
    tagline: 'AI Digital Guide for Rural Women',
    verifiedBadge: 'Verified Government Information',
    lastVerifiedBadge: 'Last verified: October 2024',
    changeLanguage: 'Change Language',
    chooseLanguage: 'Choose Your Language',
    welcomeHeadline: 'What do you need help with?',
    welcomeSubtext: 'Speak naturally in your language. Zero technical knowledge required.',
    noDepartmentNeeded: 'No government department names needed',
    speakPrompt: 'Tap and speak in your language',
    listeningState: 'Listening... please speak clearly',
    thinkingState: 'Checking verified government information...',
    speakingState: 'Listening to explanation...',
    voiceError: 'Voice recognition unavailable',
    typeFallback: 'Or type your question',
    typePlaceholder: 'e.g., I need help for my daughter\'s education...',
    askBtn: 'Ask',
    samplePromptHeader: '👉 Or tap one of these directly:',
    sampleNeedHelp: 'I need help for my daughter\'s education',
    sampleIsEligible: 'My daughter is 7 years old, is she eligible?',
    sampleDocuments: 'What documents are required?',
    sampleFindOffice: 'Where is the nearest Post Office?',
    sampleExplainSimply: 'I don\'t understand, explain simply',
    questionSaveEducation: 'I want to save for my daughter\'s education',
    questionPapersNeeded: 'What papers do I need?',
    questionHowMuchMoney: 'How much money do I need?',
    questionWhereToGo: 'Where do I go?',
    questionIsEligible: 'Is my daughter eligible?',
    questionWhoToCall: 'Who can I call?',
    listenAgain: 'Listen Again',
    explainSimply: 'Explain Simply',
    repeat: 'Repeat',
    back: 'Back',
    startAgain: 'Start Again',
    guideMe: 'Guide Me Step-by-Step',
    viewDocuments: 'View Required Documents',
    oneQuestionTitle: 'One simple question:',
    eligibleTitle: 'You are Eligible!',
    ineligibleTitle: 'Not Eligible for this Scheme',
    ineligibleWhy: 'Reason: Sukanya Samriddhi Yojana is exclusively for girl children aged 10 years or younger.',
    ineligibleAlternative: 'Recommended Government Alternatives for You:',
    ineligiblePostOfficeHelp: 'Do not worry. Visit your nearest Post Office where postal staff will guide you to Mahila Samman Savings Certificate or Public Provident Fund (PPF).',
    documentsTitle: 'Documents to Take With You',
    nextStepTitle: 'Your Exact Next Step',
    stepCounter: 'Step {current} of {total}',
    stepCompleted: 'Completed',
    nextStepBtn: 'Done, Next Step →',
    prevStepBtn: '← Back to Previous Step',
    privacyTitle: 'Privacy & Security',
    privacyNotice: 'Shared-Phone Safe: No passwords, OTPs, or bank details are ever asked or stored.',
    privacyToggle: 'Privacy Mode (Do not save history)',
    privacyActiveBanner: '🔒 Privacy Mode is Active (No data stored on this device)',
    clearHistory: 'Clear Conversation History Now',
    findPostOffice: 'Find Nearest Post Office',
    findingLocation: 'Detecting your location...',
    locationPermissionText: 'Please allow location permission to find your nearest Post Office branch.',
    useMyLocation: 'Use My Current Location',
    orEnterPin: 'Or enter your PIN code or village name:',
    searchPinBtn: 'Search',
    pinPlaceholder: 'e.g., 500001 or village name',
    callHelpline: 'Call Free Helpline',
    callForHelp: 'Call for help',
    offlineBanner: 'You are currently offline. You can call the official helpline directly:',
    callNow: 'Call Now',
    voiceSettings: 'Voice Settings',
    voiceSpeed: 'Speaking Speed',
    voiceGender: 'Voice Selection',
    femaleVoice: 'Female Voice',
    maleVoice: 'Male Voice',
    vibrationToggle: 'Vibration feedback',
    navigate: 'Directions (Navigate)',
    openStatus: 'Open Now',
    closedStatus: 'Closed',
    officialPortal: 'India Post Official Portal',
    officialPhoneIndiaPost: 'India Post Toll Free: 1800-266-6868',
    officialPhoneWomenHelp: 'National Women Helpline: 181',
    userSaid: 'You said',
    simplifiedExplanationBadge: 'Simple Explanation',
  },
};
