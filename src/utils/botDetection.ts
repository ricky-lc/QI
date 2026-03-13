import { BotSignal, Answer } from '../types';

interface TimingRecord {
  timeTaken: number;
  isCorrect: boolean;
}

export function detectBot(answers: TimingRecord[]): BotSignal {
  if (answers.length < 3) {
    return { tooFast: false, perfectTiming: false, noVariance: false, suspiciousAccuracy: false };
  }

  const times = answers.map((a) => a.timeTaken);
  const avgTime = times.reduce((s, t) => s + t, 0) / times.length;

  // 1. Too fast: average response < 500ms
  const tooFast = avgTime < 500;

  // 2. Perfect timing: all responses within 50ms of each other
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);
  const perfectTiming = maxTime - minTime < 50 && answers.length >= 5;

  // 3. No variance: standard deviation < 100ms
  const variance =
    times.reduce((sum, t) => sum + (t - avgTime) ** 2, 0) / times.length;
  const stdDev = Math.sqrt(variance);
  const noVariance = stdDev < 100 && answers.length >= 5;

  // 4. Suspicious accuracy: 100% correct AND very fast
  const allCorrect = answers.every((a) => a.isCorrect);
  const suspiciousAccuracy = allCorrect && avgTime < 2000 && answers.length >= 5;

  return { tooFast, perfectTiming, noVariance, suspiciousAccuracy };
}

export function isBotLikely(signal: BotSignal): boolean {
  const flagCount = Object.values(signal).filter(Boolean).length;
  return flagCount >= 2;
}

export function generateChallengeToken(): string {
  // Simple client-side challenge: encode timestamp + random
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 100000);
  return btoa(`${ts}:${rand}`);
}

export function validateChallengeToken(token: string, maxAgeMs = 3600000): boolean {
  try {
    const decoded = atob(token);
    const [tsStr] = decoded.split(':');
    const ts = parseInt(tsStr, 10);
    return Date.now() - ts < maxAgeMs;
  } catch {
    return false;
  }
}

// Honeypot: returns a fake question that should never be answered quickly
export function generateHoneypotQuestion() {
  return {
    id: 'honeypot_' + Date.now(),
    prompt: 'Please wait for 2 seconds before answering this question.',
    expectedMinTime: 2000,
  };
}

export function checkHoneypot(startTime: number): boolean {
  return Date.now() - startTime >= 1800; // Allow 200ms grace
}
