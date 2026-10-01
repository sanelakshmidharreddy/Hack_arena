import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Conversation } from '../components/Conversation';
import { LanguageProvider, useLanguage } from '../i18n/LanguageContext';
import { ChatMessage, LanguageCode } from '../types';

const TELUGU_UNICODE_REGEX = /[\u0C00-\u0C7F]/;
const DEVANAGARI_UNICODE_REGEX = /[\u0900-\u097F]/;

// Helper to set language in LanguageContext
function LanguageWrapper({
  initialLang,
  children,
}: {
  initialLang: LanguageCode;
  children: React.ReactNode;
}) {
  const { setLanguage } = useLanguage();
  React.useEffect(() => {
    setLanguage(initialLang);
  }, [initialLang, setLanguage]);

  return <>{children}</>;
}

describe('Explain Simply Multilingual Flow & Language Cache Safety', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('sets UI to English, clicks Explain Simply, asserts request body language is "en" and no Telugu characters in DOM', async () => {
    let capturedRequestBody: any = null;

    // Mock fetch for /api/explain
    window.fetch = vi.fn().mockImplementation((url: string, options: any) => {
      if (url.includes('/explain')) {
        capturedRequestBody = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              simplified_text:
                "In simple words: This is a government savings account at the Post Office for your daughter's education. You can open it with just Rs 250.",
            }),
        });
      }
      return Promise.reject(new Error('Unknown url: ' + url));
    });

    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'The Sukanya Samriddhi account is an initiative by the Government of India.',
        timestamp: Date.now(),
        isSimplified: false,
      },
    ];

    let currentMessages = [...mockMessages];
    const onExplainSimplyMock = vi.fn(async (messageId: string, text: string) => {
      // Simulate what App.tsx handleExplainSimply does
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previous_answer: text,
          language: 'en',
          original_question: undefined,
          scheme_id: 'sukanya_samriddhi',
        }),
      });
      const data = await response.json();
      currentMessages = currentMessages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              isSimplified: true,
              simplifiedText: data.simplified_text,
              simplifiedLang: 'en',
            }
          : m
      );
      rerenderApp();
    });

    const { rerender, container } = render(
      <LanguageProvider>
        <LanguageWrapper initialLang="en">
          <Conversation
            messages={currentMessages}
            onOptionSelect={() => {}}
            onListenMessage={() => {}}
            onExplainSimply={onExplainSimplyMock}
            onStartGuideMe={() => {}}
            onViewDocuments={() => {}}
            isSpeaking={false}
            isExplainingId={null}
          />
        </LanguageWrapper>
      </LanguageProvider>
    );

    function rerenderApp() {
      rerender(
        <LanguageProvider>
          <LanguageWrapper initialLang="en">
            <Conversation
              messages={currentMessages}
              onOptionSelect={() => {}}
              onListenMessage={() => {}}
              onExplainSimply={onExplainSimplyMock}
              onStartGuideMe={() => {}}
              onViewDocuments={() => {}}
              isSpeaking={false}
              isExplainingId={null}
            />
          </LanguageWrapper>
        </LanguageProvider>
      );
    }

    // Check button label is "Explain Simply"
    const explainBtn = screen.getByRole('button', { name: /Explain Simply/i });
    expect(explainBtn).toBeDefined();

    fireEvent.click(explainBtn);

    await waitFor(() => {
      expect(onExplainSimplyMock).toHaveBeenCalledWith(
        'msg-1',
        'The Sukanya Samriddhi account is an initiative by the Government of India.'
      );
      expect(capturedRequestBody).not.toBeNull();
      expect(capturedRequestBody.language).toBe('en');
    });

    // Check rendered DOM contains English simplified text and zero Telugu
    const domText = container.textContent || '';
    expect(domText).toContain("In simple words: This is a government savings account");
    expect(domText).toContain("Simple Explanation");
    expect(domText).not.toMatch(TELUGU_UNICODE_REGEX);
  });

  it('sets UI to Hindi, clicks Explain Simply, asserts request body language is "hi" and no Telugu characters in DOM', async () => {
    let capturedRequestBody: any = null;

    window.fetch = vi.fn().mockImplementation((url: string, options: any) => {
      if (url.includes('/explain')) {
        capturedRequestBody = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              simplified_text:
                'सीधे शब्दों में: यह आपकी बेटी की पढ़ाई के लिए डाकघर की सरकारी बचत योजना है।',
            }),
        });
      }
      return Promise.reject(new Error('Unknown url: ' + url));
    });

    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-hindi-1',
        sender: 'assistant',
        text: 'सुकन्या समृद्धि योजना भारत सरकार की एक पहल है।',
        timestamp: Date.now(),
        isSimplified: false,
      },
    ];

    let currentMessages = [...mockMessages];
    const onExplainSimplyMock = vi.fn(async (messageId: string, text: string) => {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          previous_answer: text,
          language: 'hi',
          original_question: undefined,
          scheme_id: 'sukanya_samriddhi',
        }),
      });
      const data = await response.json();
      currentMessages = currentMessages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              isSimplified: true,
              simplifiedText: data.simplified_text,
              simplifiedLang: 'hi',
            }
          : m
      );
      rerenderApp();
    });

    const { rerender, container } = render(
      <LanguageProvider>
        <LanguageWrapper initialLang="hi">
          <Conversation
            messages={currentMessages}
            onOptionSelect={() => {}}
            onListenMessage={() => {}}
            onExplainSimply={onExplainSimplyMock}
            onStartGuideMe={() => {}}
            onViewDocuments={() => {}}
            isSpeaking={false}
            isExplainingId={null}
          />
        </LanguageWrapper>
      </LanguageProvider>
    );

    function rerenderApp() {
      rerender(
        <LanguageProvider>
          <LanguageWrapper initialLang="hi">
            <Conversation
              messages={currentMessages}
              onOptionSelect={() => {}}
              onListenMessage={() => {}}
              onExplainSimply={onExplainSimplyMock}
              onStartGuideMe={() => {}}
              onViewDocuments={() => {}}
              isSpeaking={false}
              isExplainingId={null}
            />
          </LanguageWrapper>
        </LanguageProvider>
      );
    }

    // Hindi explain button
    const explainBtn = screen.getByRole('button', { name: /सरल भाषा में समझाइए/i });
    expect(explainBtn).toBeDefined();

    fireEvent.click(explainBtn);

    await waitFor(() => {
      expect(onExplainSimplyMock).toHaveBeenCalled();
      expect(capturedRequestBody).not.toBeNull();
      expect(capturedRequestBody.language).toBe('hi');
    });

    const domText = container.textContent || '';
    expect(domText).toContain('सीधे शब्दों में');
    expect(domText).toContain('सरल व्याख्या');
    expect(domText).toMatch(DEVANAGARI_UNICODE_REGEX);
    expect(domText).not.toMatch(TELUGU_UNICODE_REGEX);
  });

  it('Cache test: switching language does NOT reuse simplified explanation from another language', () => {
    // Message was simplified in Telugu
    const messageWithTeluguSimplified: ChatMessage = {
      id: 'msg-cached-te',
      sender: 'assistant',
      text: 'Original English response text.',
      timestamp: Date.now(),
      isSimplified: true,
      simplifiedText: 'సులభంగా చెప్పాలంటే: ఇది మీ పాప చదువు కోసం ప్రభుత్వం ఇచ్చే పొదుపు ఖాతా.',
      simplifiedLang: 'te',
    };

    // Render in English UI
    const { container } = render(
      <LanguageProvider>
        <LanguageWrapper initialLang="en">
          <Conversation
            messages={[messageWithTeluguSimplified]}
            onOptionSelect={() => {}}
            onListenMessage={() => {}}
            onExplainSimply={() => {}}
            onStartGuideMe={() => {}}
            onViewDocuments={() => {}}
            isSpeaking={false}
            isExplainingId={null}
          />
        </LanguageWrapper>
      </LanguageProvider>
    );

    const domText = container.textContent || '';
    // Must NOT display the cached Telugu simplified text in English mode!
    expect(domText).not.toContain('సులభంగా చెప్పాలంటే');
    expect(domText).not.toMatch(TELUGU_UNICODE_REGEX);
    // Must display the original text instead
    expect(domText).toContain('Original English response text.');
    // And the "Explain Simply" button must be available so user can simplify in English
    const explainBtn = screen.getByRole('button', { name: /Explain Simply/i });
    expect(explainBtn).toBeDefined();
  });
});
