import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioManager } from '../services/audioManager';

describe('AudioManager and Step-by-Step Voice Cancellation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    audioManager.stopAll();
  });

  it('stops and cancels active audio immediately on stopAll()', () => {
    const cancelMock = vi.fn();
    window.speechSynthesis = {
      cancel: cancelMock,
      speak: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      speaking: false,
    } as any;

    audioManager.stopAll();
    expect(cancelMock).toHaveBeenCalled();
    expect(audioManager.isSpeaking).toBe(false);
  });

  it('invalidates late/stale responses when new request token is generated', async () => {
    const speakMock = vi.fn();
    window.speechSynthesis = {
      cancel: vi.fn(),
      speak: speakMock,
      getVoices: vi.fn().mockReturnValue([]),
      speaking: false,
    } as any;

    // Simulate step 1 speak call
    audioManager.speakText('Step 1: Go to Post Office', 'en', 'FEMALE', 0.9);

    // User swiftly clicks Step 2 before step 1 finishes
    audioManager.stopAll();
    audioManager.speakText('Step 2: Collect Form', 'en', 'FEMALE', 0.9);

    // Synthesis should have been cancelled before step 2
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it('notifies subscribers of speaking state changes', () => {
    const listener = vi.fn();
    const unsub = audioManager.subscribe(listener);

    expect(listener).toHaveBeenCalledWith(false);

    audioManager.stopAll();
    unsub();
  });
});
