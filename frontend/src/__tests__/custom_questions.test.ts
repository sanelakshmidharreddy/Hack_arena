import { describe, it, expect } from 'vitest';
import { sendMessage } from '../services/api';
import { LanguageCode } from '../types';

describe('Custom User Question Context & Intent Handling', () => {
  it('TEST 1: "What documents do I need?" returns specific document details, not default intro', async () => {
    const res = await sendMessage('test-q1', 'en', 'What documents do I need?', 'text');
    expect(res.reply.toLowerCase()).toMatch(/birth certificate|aadhaar|document|photo/);
    expect(res.reply).not.toBe('For your daughter\'s education and future, the government provides the "Sukanya Samriddhi Yojana".');
  });

  it('TEST 2: "How do I apply?" returns specific application steps and post office visit', async () => {
    const res = await sendMessage('test-q2', 'en', 'How do I apply?', 'text');
    expect(res.reply.toLowerCase()).toMatch(/post office|bank|apply|form/);
    expect(res.reply).not.toBe('For your daughter\'s education and future, the government provides the "Sukanya Samriddhi Yojana".');
  });

  it('TEST 3: "How much do I need to pay?" returns deposit limits and fee requirements', async () => {
    const res = await sendMessage('test-q3', 'en', 'How much do I need to pay?', 'text');
    expect(res.reply.toLowerCase()).toMatch(/250|deposit|fee|1,50,000|150000/);
    expect(res.reply).not.toBe('For your daughter\'s education and future, the government provides the "Sukanya Samriddhi Yojana".');
  });

  it('TEST 4: "I don\'t understand." simplifies the verified scheme information', async () => {
    const res = await sendMessage('test-q4', 'en', 'I don\'t understand.', 'text');
    expect(res.intent).toBe('simplify_explanation');
    expect(res.reply.length).toBeGreaterThan(15);
  });

  it('TEST 5: Unrelated question does NOT show default scheme answer, states no verified information', async () => {
    const res = await sendMessage('test-q5', 'en', 'What is the capital of France?', 'text');
    expect(res.intent).toBe('unrelated_query');
    expect(res.reply).toContain('I do not have verified government information about that');
    expect(res.reply).not.toContain('Is your daughter 10 years of age or younger?');
  });

  it('User example: "I have a doubt that how to keep application for this documents" responds with documents / application', async () => {
    const res = await sendMessage('test-q-example', 'en', 'I have a doubt that how to keep application for this documents', 'text');
    expect(res.reply.toLowerCase()).toMatch(/birth certificate|aadhaar|document|post office|photo|250/);
    expect(res.reply).not.toBe('For your daughter\'s education and future, the government provides the "Sukanya Samriddhi Yojana".');
  });

  it('Multilingual: Selected language is strictly respected for custom questions', async () => {
    const teRes = await sendMessage('test-lang-te', 'te', 'ఏ కాగితాలు కావాలి?', 'text');
    expect(teRes.reply).toMatch(/[\u0C00-\u0C7F]/); // Telugu script

    const taRes = await sendMessage('test-lang-ta', 'ta', 'எப்படி விண்ணப்பிப்பது?', 'text');
    expect(taRes.reply).toMatch(/[\u0B80-\u0BFF]/); // Tamil script

    const hiRes = await sendMessage('test-lang-hi', 'hi', 'कितने पैसे देने होंगे?', 'text');
    expect(hiRes.reply).toMatch(/[\u0900-\u097F]/); // Devanagari script
  });
});
