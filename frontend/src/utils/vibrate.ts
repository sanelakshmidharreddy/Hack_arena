/**
 * Haptic Vibration Feedback utility with safe feature detection
 * Unsupported on iOS Safari; never errors.
 * Respects prefers-reduced-motion and user preference.
 */

export function canVibrate(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('navigator' in window) || typeof navigator.vibrate !== 'function') return false;
  
  // Check prefers-reduced-motion
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
  } catch {
    // Ignore media query error
  }

  // Check user toggle (persisted in localStorage, on by default)
  try {
    const pref = localStorage.getItem('jansakhi_vibration_enabled');
    if (pref === 'false') return false;
  } catch {
    // Ignore storage error
  }

  return true;
}

export function vibrateMicStart() {
  if (canVibrate()) {
    try {
      navigator.vibrate(50); // Short buzz
    } catch {
      // Safe no-op
    }
  }
}

export function vibrateSuccess() {
  if (canVibrate()) {
    try {
      navigator.vibrate([50, 50, 50]); // Soft double pulse
    } catch {
      // Safe no-op
    }
  }
}

export function vibrateError() {
  if (canVibrate()) {
    try {
      navigator.vibrate(150); // Longer pulse for error or not-eligible
    } catch {
      // Safe no-op
    }
  }
}

export function vibrateStepComplete() {
  if (canVibrate()) {
    try {
      navigator.vibrate(25); // Light tick on step completion
    } catch {
      // Safe no-op
    }
  }
}
