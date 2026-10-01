# Digital Guide (డిజిటల్ గైడ్ / డిజిటల్ సహాయి)
### Voice-First AI Digital Guide for Rural Indian Women | 4-Hour Hackathon MVP

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat&logo=google)](https://ai.google.dev)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com)
[![Target: Cloud Run](https://img.shields.io/badge/Deploy-Google_Cloud_Run-4285F4?style=flat&logo=google-cloud)](https://cloud.google.com/run)

---

## 1. Project Overview & Problem Statement

In rural India, millions of women are excluded from essential government schemes and services not because they lack capability, but because existing digital portals assume:
- English proficiency
- Prior digital literacy and navigation experience
- Familiarity with complex portals, form fields, and search engines
- Access to an educated intermediary or guide

### The Core Challenge
Build an AI tool that empowers a first-time rural woman user—with **no English**, **no technical knowledge**, **no prior digital experience**, and **no person available to guide her**—to independently access ONE essential government service through voice or simple text in her own regional language.

---

## 2. Core Product Principle: NOT a Chatbot, a DIGITAL GUIDE

Traditional chatbots provide verbose text responses and demand that users formulate clear search terms or know government scheme names. 

**Digital Guide** works on a structured human-centered journey:
```
USER NEED  ("నా బిడ్డ చదువు కోసం సహాయం కావాలి" / "I need help for my daughter's education")
    ↓
UNDERSTAND (AI extracts core intent without demanding scheme names)
    ↓
ONE QUESTION AT A TIME (AI clarifies eligibility with simple yes/no touch buttons)
    ↓
CHECK VERIFIED SCHEME DATA (Strict grounding — Gemini never hallucinates or invents rules)
    ↓
EXPLAIN SIMPLY (Translates official rules into intuitive, comforting terms)
    ↓
GUIDE ME (Step-by-step physical guidance: 1 action per card, audio supported)
    ↓
CLEAR NEXT ACTION ("Visit your nearest Post Office tomorrow at 10 AM with Aadhaar & Birth Certificate")
```

---

## 3. Targeted Government Scheme & Regional Languages

- **Primary Scheme**: **Sukanya Samriddhi Yojana (SSY)** — Ministry of Finance / Department of Posts.
  - *Purpose*: High-interest (8.2%), tax-exempt savings and higher education guarantee fund for girl children under 10 years of age.
  - *Why SSY?*: Solves the quintessential rural need: *"I need help for my daughter's education and future."*
- **Supported Languages**:
  1. **తెలుగు (Telugu)** (Primary demo language)
  2. **தமிழ் (Tamil)**
  3. **हिन्दी (Hindi)**
  4. **English**

---

## 4. Key Differentiators & Features

1. **Zero Scheme Knowledge Required**:
   - The user never has to search for "Sukanya Samriddhi" or navigate department portals. Stating *"నా బిడ్డ చదువు కోసం సహాయం కావాలి"* immediately routes to the right verified scheme.
2. **One Question at a Time**:
   - Eliminates intimidating multi-field forms. The AI asks one simple question (e.g. *"Is your daughter 10 years or younger?"*) with large touch-friendly buttons (`[YES]` `[NO]`).
3. **Verified Information Layer**:
   - AI logic is strictly decoupled from the factual scheme dataset (`verified_schemes.json`). Gemini is prevented from inventing criteria, fees, or documents.
4. **"Explain Simply" Capability**:
   - One tap on *"సులభంగా చెప్పండి (Explain Simply)"* distills complex rules into everyday language without introducing new or unverified facts.
5. **"Guide Me" Step-by-Step Mode**:
   - Step 1 of 4: *"Keep Birth Certificate and Aadhaar photocopies ready."*
   - Step 2 of 4: *"Keep ₹250 cash ready."*
   - Step 3 of 4: *"Visit your local Post Office counter; staff will help fill the form."*
   - Step 4 of 4: *"Deposit ₹250 and collect your official passbook."*
6. **Voice-First with Text Fallback**:
   - Large microphone button (96px+) with interactive states: `IDLE`, `LISTENING` (animated waveform ripple), `THINKING` (checking verified data), `SPEAKING` (audio playback), `ERROR`, and `SUCCESS`.
   - Native Web Speech API integration (`te-IN`, `ta-IN`, `hi-IN`, `en-IN`).
7. **Shared Phone Privacy Mode**:
   - Designed for shared family smartphones in rural households. Never asks for OTPs, PINs, passwords, or bank credentials. Includes one-tap *"Clear Conversation History"*.
8. **Extreme Accessibility**:
   - Minimum 48px touch targets, high contrast, Noto Sans Indic typography, screen-reader friendly labels, and complete text fallback for every audio interaction.

---

## 5. System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│             React + TypeScript Frontend                │
│  - Tailwind CSS + Noto Sans Indic Fonts                │
│  - Web Speech API (Recognition + Synthesis)            │
│  - Mobile-First UI (Large touch targets, Audio waves)  │
└───────────────────────────▲────────────────────────────┘
                            │ HTTP JSON / REST
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│  - Pydantic Request / Response Validation              │
│  - Session Manager (Ephemeral, Privacy-Safe)           │
│  - Rate-Limited & Input-Sanitized                      │
└───────▲────────────────────────────────────────▲───────┘
        │                                        │
┌───────▼────────────────────────┐ ┌─────────────▼───────────────┐
│       Google Gemini API        │ │    Verified Scheme Engine   │
│  - google-genai SDK            │ │  - verified_schemes.json    │
│  - Structured JSON Output      │ │  - Deterministic Fallbacks  │
│  - System Prompt Grounding     │ │  - Official Govt Standards  │
└────────────────────────────────┘ └─────────────────────────────┘
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2.
- **AI**: Google Gemini API (`google-genai` SDK) with model `gemini-2.5-flash`.
- **Data**: Verified Government Scheme JSON schema.
- **Container / Deployment**: Multi-stage Docker, Google Cloud Run (`asia-south1`).

---

## 6. Project Structure

```
Hackarena/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           # Language switcher, verified badge, privacy toggle
│   │   │   ├── LanguageModal.tsx    # Native script language selection
│   │   │   ├── VoiceHero.tsx        # Large animated microphone & voice states
│   │   │   ├── Conversation.tsx     # One-question-at-a-time conversation
│   │   │   ├── GuideMe.tsx          # Step-by-step single-action cards
│   │   │   ├── EligibilityResult.tsx# Verification result & documents list
│   │   │   ├── NextActionCard.tsx   # Concrete physical next steps & postal directions
│   │   │   ├── PrivacyToggle.tsx    # Shared phone privacy modal & history clearing
│   │   │   └── AudioWaveform.tsx    # Soundwave animation for audio states
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.ts # Web Speech API voice capture
│   │   │   └── useSpeechSynthesis.ts   # Indic voice audio playback
│   │   ├── data/
│   │   │   ├── languages.ts         # Native language strings and scripts
│   │   │   └── demoPaths.ts         # Deterministic offline demo scenarios
│   │   ├── services/
│   │   │   └── api.ts               # FastAPI connector with instant fallback
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx                  # Root screen coordinator
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entrypoint & static mounting
│   │   ├── config.py                # Environment & CORS configuration
│   │   ├── models/
│   │   │   ├── request_models.py    # Validated input schemas
│   │   │   └── response_models.py   # Structured output schemas
│   │   ├── services/
│   │   │   ├── gemini_service.py    # Gemini client with system prompt grounding
│   │   │   ├── scheme_service.py    # Verified scheme engine & demo paths
│   │   │   └── session_service.py   # In-memory privacy session tracker
│   │   ├── routes/
│   │   │   └── api.py               # /api/message, /api/explain, /api/service, /api/reset
│   │   └── data/
│   │       └── verified_schemes.json# Official Sukanya Samriddhi Yojana facts
│   ├── tests/
│   │   ├── test_health.py           # Healthcheck verification
│   │   ├── test_message.py          # Valid/invalid messages, eligibility, fallbacks
│   │   └── test_explain.py          # Explain simply and session tests
│   ├── requirements.txt
│   └── .env.example
├── Dockerfile                       # Multi-stage production container for Cloud Run
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 7. Local Setup & Quickstart

### Prerequisites
- Node.js v18+ and npm
- Python 3.10+

### Option A: Running with Unified FastAPI Backend (Fastest)
1. **Build frontend assets**:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```
2. **Install backend dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. **Run FastAPI Server**:
   ```bash
   uvicorn app.main:app --port 8000 --reload
   ```
4. Open your browser at **`http://localhost:8000`**. The app is fully live with both frontend and backend served on a single port!

### Option B: Running Frontend & Backend in Development Mode
1. **Start Backend**:
   ```bash
   cd backend
   uvicorn app.main:app --port 8000 --reload
   ```
2. **Start Frontend (in another terminal)**:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open **`http://localhost:3000`** (Vite proxies all `/api` and `/health` requests to `http://localhost:8000`).

---

## 8. Environment Variables

Create a `.env` file in `backend/` based on `backend/.env.example`:

```bash
# Optional: Provide Google Gemini API Key for dynamic live reasoning
# If left empty, the application uses the verified deterministic scheme engine seamlessly!
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=8000
ENVIRONMENT=development

# Optional: Specific Frontend URL for production CORS
FRONTEND_URL=https://your-frontend-domain.com
```

> **Security Note**: Never commit `.env` or hardcode API keys in the frontend repository.

---

## 9. Testing & Quality Assurance

The backend includes a comprehensive pytest suite covering all requirements:
- `test_health`: Verifies `/health` returns HTTP 200 with `{ "status": "ok" }`.
- `test_valid_message`: Tests conversational Telugu and English queries.
- `test_invalid_message`: Tests 422 rejection on unsupported languages.
- `test_empty_message`: Tests rejection on empty or whitespace strings.
- `test_scheme_eligibility`: Tests answering age criteria leading to `eligible: "yes"`.
- `test_unknown_service`: Ensures AI does not hallucinate services outside verified data.
- `test_gemini_failure_and_safe_fallback`: Simulates API failure and verifies safe graceful recovery.
- `test_explain_simply`: Tests simplification without fact alteration.

Run the test suite:
```bash
cd backend
python -m pytest tests/ -v
```

Output:
```
tests/test_explain.py::test_explain_simply PASSED                        [  8%]
tests/test_explain.py::test_reset_session PASSED                         [ 16%]
tests/test_explain.py::test_service_details PASSED                       [ 25%]
tests/test_health.py::test_health PASSED                                 [ 33%]
tests/test_message.py::test_valid_message PASSED                         [ 41%]
tests/test_message.py::test_valid_message_english PASSED                 [ 50%]
tests/test_message.py::test_invalid_message PASSED                       [ 58%]
tests/test_message.py::test_empty_message PASSED                         [ 66%]
tests/test_message.py::test_scheme_eligibility PASSED                    [ 75%]
tests/test_message.py::test_unknown_service PASSED                       [ 83%]
tests/test_message.py::test_missing_information PASSED                   [ 91%]
tests/test_message.py::test_gemini_failure_and_safe_fallback PASSED      [100%]
======================== 12 passed in 0.59s ========================
```

---

## 10. Google Cloud Run Deployment

The project includes a production-ready multi-stage `Dockerfile` configured to listen on `$PORT` and serve both frontend assets and API endpoints.

### Step 1: Configure Google Cloud CLI
```bash
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
```

### Step 2: Build and Deploy to Cloud Run
```bash
# Build and deploy in a single command using Google Cloud Build
gcloud run deploy digital-guide \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "PORT=8080,ENVIRONMENT=production,GEMINI_API_KEY=YOUR_GEMINI_API_KEY"
```

### Step 3: Verify Deployment
Once deployed, Cloud Run will output a service URL (e.g., `https://digital-guide-xyz.a.run.app`).
Verify health:
```bash
curl https://digital-guide-xyz.a.run.app/health
# Returns: {"status":"ok","version":"1.0.0","scheme_loaded":true}
```

---

## 11. Complete 15-Step Demo Journey

Judges can follow this exact sequence to experience the full value proposition:

1. **Open the App**: Loads the clean, mobile-first home screen in **Telugu** (`తెలుగు`).
2. **Language Switcher**: Tap the top language button (`తెలుగు ▾`) to view native script options (**తెలుగు**, **தமிழ்**, **हिन्दी**, **English**). Select **Telugu**.
3. **Voice Input**: Tap the large 96px microphone button (or select the sample prompt chip *"నా బిడ్డ చదువు కోసం సహాయం కావాలి"*).
4. **State Transition**: Watch the microphone animate through `LISTENING` → `THINKING` ("సమాచారాన్ని పరిశీలిస్తున్నాం...") → `SPEAKING`.
5. **AI Understands Need**: Assistant identifies the core need and introduces the **Sukanya Samriddhi Yojana** without asking the user to search.
6. **One Question at a Time**: AI asks: *"మీ కూతురి వయస్సు 10 సంవత్సరాల లోపే ఉందా?"* with two large touch buttons:
   - `[అవును (10 ఏళ్ల లోపే)]`
   - `[కాదు (10 ఏళ్లు దాటింది)]`
7. **User Answers**: Tap `[అవును (10 ఏళ్ల లోపే)]`.
8. **Verified Eligibility**: System marks the user as **Eligible** with a green badge and verified scheme seal.
9. **Explain Simply**: Tap `[💡 సులభంగా చెప్పండి]` to hear a 1-sentence plain language summary.
10. **View Documents**: Review the 4 simple items: Birth Certificate, Parent Aadhaar, 2 Photos, and ₹250 cash.
11. **Guide Me Mode**: Tap the prominent blue button `[🚀 స్టెప్ బై స్టెప్ గైడ్ చేయండి (గైడ్ మీ)]`.
12. **Step-by-Step Experience**: Progress through single-action focus cards:
    - Step 1 of 4: Keep Aadhaar and Birth Certificate ready → Tap `[కాగితాలు సిద్ధం చేసుకున్నాను]`.
    - Step 2 of 4: Keep ₹250 cash ready → Tap `[నగదు సిద్ధంగా ఉంది]`.
    - Step 3 of 4: Visit local Post Office; postal staff will help fill the form → Tap `[పోస్టాఫీస్ కి చేరుకున్నాను]`.
    - Step 4 of 4: Submit documents and collect printed passbook → Tap `[పాస్‌బుక్ తీసుకున్నాను (పూర్తయింది)]`.
13. **Clear Next Action**: The final screen highlights the exact real-world action:
    - *"Visit your nearest Post Office tomorrow at 10 AM with your Aadhaar Card, daughter's Birth Certificate, and ₹250 cash."*
14. **Audio Playback**: Tap `[🔊 ఈ సూచనను వినండి]` to listen to the final instructions in native audio.
15. **Shared Phone Privacy**: Tap the top shield icon to verify Privacy Mode or tap *"సంభాషణను ఇప్పుడే తొలగించండి (Clear History)"* to clear all session traces.
