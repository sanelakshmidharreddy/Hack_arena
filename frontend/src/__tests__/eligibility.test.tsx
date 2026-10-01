import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EligibilityResult } from '../components/EligibilityResult';
import { LanguageProvider } from '../i18n/LanguageContext';
import { AssistantResponse } from '../types';

describe('Eligibility Result Component (Eligible vs Ineligible Branches)', () => {
  const mockIneligibleResponse: AssistantResponse = {
    reply: 'Sorry, your daughter is older than 10 years.',
    intent: 'check_eligibility',
    needs_clarification: false,
    question: null,
    eligible: 'no',
    explanation: 'Sukanya Samriddhi Yojana strictly applies to girls 10 years or younger.',
    documents: [],
    steps: [],
    next_action: 'Visit nearest Post Office for Mahila Samman Savings Certificate.',
    source: 'verified_demo_data',
    confidence: 'verified',
  };

  const mockEligibleResponse: AssistantResponse = {
    reply: 'Great news! Your daughter is eligible.',
    intent: 'check_eligibility',
    needs_clarification: false,
    question: null,
    eligible: 'yes',
    explanation: 'Your daughter is 7 years old and eligible to open an account.',
    documents: [
      { name: 'Birth Certificate', purpose: 'Age proof' },
      { name: 'Aadhaar Card', purpose: 'Identity proof' },
    ],
    steps: [
      { step_number: 1, instruction: 'Collect photocopies', detail: 'Keep copies safe', action_text: 'Done' }
    ],
    next_action: 'Visit nearest Post Office tomorrow with documents.',
    source: 'verified_demo_data',
    confidence: 'verified',
  };

  it('renders INELIGIBLE screen when eligible is "no" with alternatives and NEVER shows eligible text', () => {
    const { container } = render(
      <LanguageProvider>
        <EligibilityResult
          response={mockIneligibleResponse}
          onStartGuideMe={() => {}}
          onGoToNextAction={() => {}}
          onListen={() => {}}
          onBackToChat={() => {}}
          onReset={() => {}}
        />
      </LanguageProvider>
    );

    const text = container.textContent || '';
    // Must NOT contain positive eligibility headline
    expect(text).not.toContain('మీరు అర్హులు! (You are Eligible)');
    expect(text).not.toContain('You are Eligible!');
    // Must contain ineligibility indicators and alternative options
    expect(text).toContain('ఈ పథకానికి అర్హత లేదు');
    expect(text).toContain('మహిళా సమ్మాన్');
    expect(text).toContain('1800-266-6868');
  });

  it('renders ELIGIBLE screen when eligible is "yes" with documents and Guide Me button', () => {
    const { container } = render(
      <LanguageProvider>
        <EligibilityResult
          response={mockEligibleResponse}
          onStartGuideMe={() => {}}
          onGoToNextAction={() => {}}
          onListen={() => {}}
          onBackToChat={() => {}}
          onReset={() => {}}
        />
      </LanguageProvider>
    );

    const text = container.textContent || '';
    expect(text).toContain('మీరు అర్హులు! (You are Eligible)');
    expect(text).toContain('Birth Certificate');
    expect(text).toContain('Aadhaar Card');
    expect(text).toContain('స్టెప్ బై స్టెప్ గైడ్ చేయండి');
  });
});
