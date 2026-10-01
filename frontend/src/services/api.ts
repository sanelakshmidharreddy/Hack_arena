import { AssistantResponse, LanguageCode } from '../types';
import { DEMO_PATHS } from '../data/demoPaths';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API_BASE = `${API_URL}/api`;

export async function checkHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch(`${API_URL || ''}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
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
    // Graceful fallback to verified local demo dataset
    console.warn('Backend unavailable, using verified local scheme data fallback:', err);
    return getFallbackResponse(message, language);
  }
}

export async function explainSimply(
  text: string,
  language: LanguageCode
): Promise<{ simplified_text: string }> {
  try {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    if (res.ok) {
      return await res.json();
    }
    throw new Error('Explain API returned error');
  } catch (err) {
    // Fallback explanation
    const demo = DEMO_PATHS.find((d) => d.id === 'explain_simply');
    const fallbackText = demo?.response[language]?.explanation || 
      'ఇది ప్రభుత్వం మీ పాప చదువు కోసం ఇచ్చే ఖాతా. ₹250 తో పోస్టాఫీసులో మొదలుపెట్టవచ్చు.';
    return { simplified_text: fallbackText };
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
  } catch (err) {
    return true;
  }
}

function getFallbackResponse(message: string, lang: LanguageCode): AssistantResponse {
  const lower = message.toLowerCase().trim();

  // Pattern A: Help for daughter / education
  if (
    lower.includes('daughter') ||
    lower.includes('education') ||
    lower.includes('help') ||
    lower.includes('చదువు') ||
    lower.includes('సహాయం') ||
    lower.includes('పాప') ||
    lower.includes('కూతురు') ||
    lower.includes('படிப்பு') ||
    lower.includes('மகள்') ||
    lower.includes('உதவி') ||
    lower.includes('बेटी') ||
    lower.includes('पढ़ाई') ||
    lower.includes('मदद')
  ) {
    return DEMO_PATHS[0].response[lang];
  }

  // Pattern B: Eligibility / age answers
  if (
    lower.includes('yes') ||
    lower.includes('7') ||
    lower.includes('8') ||
    lower.includes('5') ||
    lower.includes('అవును') ||
    lower.includes('ஆம்') ||
    lower.includes('हाँ') ||
    lower.includes('eligible') ||
    lower.includes('అర్హత')
  ) {
    return DEMO_PATHS[1].response[lang];
  }

  // Pattern C: Documents required
  if (
    lower.includes('document') ||
    lower.includes('paper') ||
    lower.includes('కాగితాలు') ||
    lower.includes('సర్టిఫికెట్') ||
    lower.includes('ஆவணங்கள்') ||
    lower.includes('சான்றிதழ்') ||
    lower.includes('कागजात') ||
    lower.includes('दस्तावेज')
  ) {
    return DEMO_PATHS[2].response[lang];
  }

  // Pattern D: Where to go / procedure
  if (
    lower.includes('where') ||
    lower.includes('go') ||
    lower.includes('apply') ||
    lower.includes('ఎక్కడికి') ||
    lower.includes('వెళ్లాలి') ||
    lower.includes('எங்கு') ||
    lower.includes('செல்ல') ||
    lower.includes('कहाँ') ||
    lower.includes('जाना')
  ) {
    return DEMO_PATHS[3].response[lang];
  }

  // Pattern E: Explain simply / don't understand
  if (
    lower.includes('understand') ||
    lower.includes('simple') ||
    lower.includes('అర్థం కాలేదు') ||
    lower.includes('సులభంగా') ||
    lower.includes('புரியவில்லை') ||
    lower.includes('எளிமையாக') ||
    lower.includes('समझ नहीं') ||
    lower.includes('सरल')
  ) {
    return DEMO_PATHS[4].response[lang];
  }

  // Default to introductory scheme guidance
  return DEMO_PATHS[0].response[lang];
}
