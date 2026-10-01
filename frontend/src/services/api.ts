import { AssistantResponse, LanguageCode } from '../types';
import { DEMO_PATHS } from '../data/demoPaths';

const API_BASE = '/api';

export interface VerifiedContact {
  id: string;
  name: string;
  name_regional?: Record<string, string>;
  phone: string;
  tel_link: string;
  timing: string;
  timing_regional?: Record<string, string>;
  purpose: string;
  purpose_regional?: Record<string, string>;
  source_url: string;
  last_verified: string;
}

export interface PostOfficeLocation {
  name: string;
  address: string;
  distance_km: number;
  open_now: boolean;
  operating_hours?: string;
  lat: number;
  lng: number;
  phone: string;
  deep_link: string;
  source: string;
}

export interface VoiceOption {
  name: string;
  gender: string;
  display_name: string;
}

export async function checkHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'mock_mode' };
  }
}

export async function sendMessage(
  sessionId: string,
  language: LanguageCode,
  message: string,
  inputMode: 'voice' | 'text' = 'voice'
): Promise<AssistantResponse> {
  try {
    const res = await fetch(`${API_BASE}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        language: language,
        message: message,
        input_mode: inputMode,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    throw new Error('API server returned ' + res.status);
  } catch (err) {
    console.warn('Backend unavailable, using verified local scheme data fallback:', err);
    return getFallbackResponse(message, language);
  }
}

export async function explainSimply(
  text: string,
  language: LanguageCode,
  originalQuestion?: string,
  schemeId: string = 'sukanya_samriddhi'
): Promise<{ simplified_text: string }> {
  try {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        previous_answer: text,
        text,
        original_question: originalQuestion,
        scheme_id: schemeId,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
    throw new Error('Explain API returned error: ' + res.status);
  } catch (err) {
    console.warn('Explain API call failed or offline, using localized verified fallback:', err);
    const fallbackMap: Record<LanguageCode, string> = {
      te: 'సులభంగా చెప్పాలంటే: ఇది మీ పాప చదువు కోసం ప్రభుత్వం ఇచ్చే పొదుపు ఖాతా. పోస్టాఫీసులో ₹250 తో మొదలుపెట్టవచ్చు.',
      ta: 'எளிய வார்த்தைகளில்: இது உங்கள் மகளின் கல்விக்காக தபால் அலுவலகத்தில் திறக்கப்படும் அரசு சேமிப்பு கணக்கு. ₹250 செலுத்தி தொடங்கலாம்.',
      hi: 'सीधे शब्दों में: यह आपकी बेटी की पढ़ाई के लिए डाकघर की सरकारी बचत योजना है। आप केवल ₹250 से खाता शुरू कर सकते हैं।',
      en: "In simple words: This is a government savings account at the Post Office for your daughter's education. You can open it with just ₹250.",
    };
    return { simplified_text: fallbackMap[language] || fallbackMap['en'] };
  }
}

export async function resetSession(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function getContacts(): Promise<VerifiedContact[]> {
  try {
    const res = await fetch(`${API_BASE}/contacts`);
    if (res.ok) {
      const data = await res.json();
      return data.contacts || [];
    }
  } catch (err) {
    console.warn('Failed to fetch contacts from API, using static fallbacks', err);
  }
  return [
    {
      id: 'india_post',
      name: 'India Post Customer Care (1800-266-6868)',
      phone: '1800-266-6868',
      tel_link: 'tel:18002666868',
      timing: '9:00 AM - 6:00 PM (Mon-Sat)',
      purpose: 'Sukanya Samriddhi account queries and branch info',
      source_url: 'https://www.indiapost.gov.in',
      last_verified: '2024-10-01',
    },
    {
      id: 'women_helpline',
      name: 'National Women Helpline (181)',
      phone: '181',
      tel_link: 'tel:181',
      timing: '24 Hours / 7 Days (Toll-Free)',
      purpose: 'Assistance for rural women and girl child schemes',
      source_url: 'https://wcd.nic.in',
      last_verified: '2024-10-01',
    },
    {
      id: 'childline',
      name: 'Childline India (1098)',
      phone: '1098',
      tel_link: 'tel:1098',
      timing: '24 Hours / 7 Days (Toll-Free)',
      purpose: 'Emergency support and girl child rights',
      source_url: 'https://wcd.nic.in',
      last_verified: '2024-10-01',
    },
  ];
}

export async function getNearbyPostOffices(
  lat?: number,
  lng?: number,
  query?: string
): Promise<PostOfficeLocation[]> {
  try {
    let url = `${API_BASE}/post-offices`;
    const params = new URLSearchParams();
    if (lat !== undefined && lng !== undefined) {
      params.append('lat', lat.toString());
      params.append('lng', lng.toString());
    }
    if (query) {
      params.append('query', query);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data.post_offices || [];
    }
  } catch (err) {
    console.warn('Failed to fetch nearby post offices from API', err);
  }

  // Resilient fallback with Google Maps directions deep link
  const q = query || 'nearest post office';
  return [
    {
      name: 'Sub Post Office (SPO)',
      address: 'Main Bazar, Near Gram Panchayat Office',
      distance_km: 1.2,
      open_now: true,
      operating_hours: '10:00 AM - 02:00 PM',
      lat: 17.385,
      lng: 78.4867,
      phone: '1800-266-6868',
      deep_link: `https://www.google.com/maps/search/?api=1&query=Post+Office+${encodeURIComponent(q)}`,
      source: 'offline_postal_directory',
    },
    {
      name: 'Branch Post Office (BPO)',
      address: 'Opposite Zilla Parishad High School',
      distance_km: 2.5,
      open_now: true,
      operating_hours: '10:00 AM - 01:00 PM',
      lat: 17.391,
      lng: 78.478,
      phone: '1800-266-6868',
      deep_link: `https://www.google.com/maps/search/?api=1&query=Post+Office+${encodeURIComponent(q)}`,
      source: 'offline_postal_directory',
    },
  ];
}

export async function synthesizeCloudTTS(
  text: string,
  language: LanguageCode,
  voiceName?: string,
  gender: string = 'FEMALE',
  speed: number = 0.95
): Promise<{ audioContent: string | null; fallbackToBrowser: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        voice_name: voiceName,
        gender,
        speed,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        audioContent: data.audio_content || null,
        fallbackToBrowser: data.fallback_to_browser ?? false,
      };
    }
  } catch (err) {
    console.warn('Backend Cloud TTS unavailable, using browser synthesis', err);
  }
  return { audioContent: null, fallbackToBrowser: true };
}

export async function getAvailableVoices(lang: LanguageCode): Promise<VoiceOption[]> {
  try {
    const res = await fetch(`${API_BASE}/voices?lang=${lang}`);
    if (res.ok) {
      const data = await res.json();
      return data.voices || [];
    }
  } catch {
    // fallback
  }
  return [];
}

function getFallbackResponse(message: string, lang: LanguageCode): AssistantResponse {
  const lower = message.toLowerCase().trim();

  // 1. Pattern INELIGIBLE - checked FIRST
  const ineligibleSignals = [
    'older than 10', 'older', 'not eligible', 'not_eligible', 'above 10', 'more than 10',
    'కాదు', 'దాటింది', 'పెద్ద', 'లేదు', 'இல்லை', '10 வயதுக்கு மேல்',
    'नहीं', 'अधिक', '11', '12', '13', '14', '15', '16', '17', '18'
  ];
  const positiveSignals = ['yes', 'eligible', 'అవును', 'ஆம்', 'हाँ', 'under 10', 'below 10'];
  if (ineligibleSignals.some((s) => lower.includes(s)) && !positiveSignals.some((p) => lower.includes(p))) {
    const ineligiblePath = DEMO_PATHS.find((d) => d.id === 'eligible_no');
    if (ineligiblePath) return ineligiblePath.response[lang];
  }
  if (lower === 'no' || lower.startsWith('no,') || lower.startsWith('no ')) {
    const ineligiblePath = DEMO_PATHS.find((d) => d.id === 'eligible_no');
    if (ineligiblePath) return ineligiblePath.response[lang];
  }

  // 2. Simplification / don't understand
  if (
    lower.includes('understand') ||
    lower.includes('simple') ||
    lower.includes('clarify') ||
    lower.includes('explain') ||
    lower.includes('easy') ||
    lower.includes('అర్థం కాలేదు') ||
    lower.includes('సులభం') ||
    lower.includes('పుரியவில்லை') ||
    lower.includes('எளிமை') ||
    lower.includes('समझ नहीं') ||
    lower.includes('सरल')
  ) {
    const simPath = DEMO_PATHS.find((d) => d.id === 'explain_simply');
    if (simPath) return simPath.response[lang];
  }

  // 3. Documents
  if (
    lower.includes('document') ||
    lower.includes('paper') ||
    lower.includes('certificate') ||
    lower.includes('birth') ||
    lower.includes('aadhaar') ||
    lower.includes('photo') ||
    lower.includes('proof') ||
    lower.includes('doc') ||
    lower.includes('కాగిత') ||
    lower.includes('సర్టిఫికెట్') ||
    lower.includes('ఆధార్') ||
    lower.includes('ఫోటో') ||
    lower.includes('బర్త్') ||
    lower.includes('ஆவண') ||
    lower.includes('சான்றிதழ்') ||
    lower.includes('புகைப்பட') ||
    lower.includes('ஆதார்') ||
    lower.includes('பிறப்பு') ||
    lower.includes('दस्तावेज') ||
    lower.includes('कागजात') ||
    lower.includes('कागज') ||
    lower.includes('प्रमाण') ||
    lower.includes('आधार') ||
    lower.includes('फोटो') ||
    lower.includes('जन्म')
  ) {
    const docPath = DEMO_PATHS.find((d) => d.id === 'documents_query');
    if (docPath) return docPath.response[lang];
  }

  // 4. Where to go / how to apply
  if (
    lower.includes('where') ||
    lower.includes('go') ||
    lower.includes('apply') ||
    lower.includes('procedure') ||
    lower.includes('process') ||
    lower.includes('office') ||
    lower.includes('bank') ||
    lower.includes('submit') ||
    lower.includes('register') ||
    lower.includes('form') ||
    lower.includes('పోస్టాఫీస్') ||
    lower.includes('ఎక్కడికి') ||
    lower.includes('వెళ్లాలి') ||
    lower.includes('దరఖాస్తు') ||
    lower.includes('ఎలా') ||
    lower.includes('எங்கு') ||
    lower.includes('செல்ல') ||
    lower.includes('விண்ணப்ப') ||
    lower.includes('தபால்') ||
    lower.includes('எப்படி') ||
    lower.includes('कहाँ') ||
    lower.includes('जाना') ||
    lower.includes('आवेदन') ||
    lower.includes('डाकघर') ||
    lower.includes('कैसे')
  ) {
    const procPath = DEMO_PATHS.find((d) => d.id === 'how_to_proceed');
    if (procPath) return procPath.response[lang];
  }

  // 5. Money / payment / fees / deposit limits
  if (
    lower.includes('money') ||
    lower.includes('pay') ||
    lower.includes('fee') ||
    lower.includes('cost') ||
    lower.includes('charge') ||
    lower.includes('amount') ||
    lower.includes('rupee') ||
    lower.includes('rs') ||
    lower.includes('₹') ||
    lower.includes('deposit') ||
    lower.includes('minimum') ||
    lower.includes('maximum') ||
    lower.includes('how much') ||
    lower.includes('250') ||
    lower.includes('1,50,000') ||
    lower.includes('150000') ||
    lower.includes('డబ్బు') ||
    lower.includes('ఖర్చు') ||
    lower.includes('రూపాయ') ||
    lower.includes('కట్టాలి') ||
    lower.includes('ఎంత') ||
    lower.includes('பணம்') ||
    lower.includes('எவ்வளவு') ||
    lower.includes('கட்டணம்') ||
    lower.includes('செலுத்த') ||
    lower.includes('पैसे') ||
    lower.includes('कितना') ||
    lower.includes('फीस') ||
    lower.includes('जमा') ||
    lower.includes('रुपये')
  ) {
    const depPath = DEMO_PATHS.find((d) => d.id === 'deposit_limits');
    if (depPath) return depPath.response[lang];
  }

  // 6. Interest rate
  if (
    lower.includes('interest') ||
    lower.includes('rate') ||
    lower.includes('8.2') ||
    lower.includes('%') ||
    lower.includes('percent') ||
    lower.includes('profit') ||
    lower.includes('వడ్డీ') ||
    lower.includes('శాతం') ||
    lower.includes('வட்டி') ||
    lower.includes('ब्याज')
  ) {
    const intPath = DEMO_PATHS.find((d) => d.id === 'interest_rate');
    if (intPath) return intPath.response[lang];
  }

  // 7. Pattern ELIGIBLE YES
  if (
    lower.includes('yes') ||
    lower.includes('eligible') ||
    lower.includes('అవును') ||
    lower.includes('అర్హత') ||
    lower.includes('ஆம்') ||
    lower.includes('हाँ') ||
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].some((a) => lower.includes(a + ' year') || lower.includes(a + ' ఏళ్ల') || lower.includes(a + ' வயது') || lower.includes(a + ' साल'))
  ) {
    const eligiblePath = DEMO_PATHS.find((d) => d.id === 'eligible_yes');
    if (eligiblePath) return eligiblePath.response[lang];
  }

  // 8. Greetings / help
  if (
    (lower.includes('hi') ||
      lower.includes('hello') ||
      lower.includes('namaste') ||
      lower.includes('vanakkam') ||
      lower.includes('help') ||
      lower.includes('guide me') ||
      lower.includes('start') ||
      lower.includes('సహాయం') ||
      lower.includes('నమస్కారం') ||
      lower.includes('உதவி') ||
      lower.includes('வணக்கம்') ||
      lower.includes('मदद') ||
      lower.includes('नमस्ते')) &&
    lower.split(' ').length <= 4
  ) {
    return DEMO_PATHS[0].response[lang];
  }

  // 9. Scheme keywords without specific subtopic
  if (
    lower.includes('sukanya') ||
    lower.includes('ssy') ||
    lower.includes('samriddhi') ||
    lower.includes('scheme') ||
    lower.includes('daughter') ||
    lower.includes('girl') ||
    lower.includes('పాప') ||
    lower.includes('మగ') ||
    lower.includes('மகள்') ||
    lower.includes('பெண்') ||
    lower.includes('बेटी') ||
    lower.includes('योजना')
  ) {
    return DEMO_PATHS[0].response[lang];
  }

  // 10. Default for any unrelated question
  const unrelatedPath = DEMO_PATHS.find((d) => d.id === 'unrelated');
  if (unrelatedPath) return unrelatedPath.response[lang];

  return DEMO_PATHS[0].response[lang];
}
