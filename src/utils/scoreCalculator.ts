import { TestSession, TestResult } from '../types';

interface IQScaleEntry {
  min: number;
  label: string;
  emoji: string;
}

const IQ_SCALE: IQScaleEntry[] = [
  { min: 145, label: 'Genius', emoji: '🌟' },
  { min: 130, label: 'Very Superior', emoji: '✨' },
  { min: 120, label: 'Superior', emoji: '💎' },
  { min: 110, label: 'High Average', emoji: '🚀' },
  { min: 90, label: 'Average', emoji: '⭐' },
  { min: 80, label: 'Low Average', emoji: '🌱' },
  { min: 70, label: 'Borderline', emoji: '💡' },
  { min: 0, label: 'Below Average', emoji: '📈' },
];

export function calculateIQScore(
  correctAnswers: number,
  totalQuestions: number,
  averageTimeMs: number,
  difficultyFactor: number // 1-10
): number {
  if (totalQuestions === 0) return 85;

  const accuracyRatio = correctAnswers / totalQuestions;

  // Base score from accuracy (60-140 range before adjustments)
  const baseScore = 70 + accuracyRatio * 70;

  // Time factor: faster = slightly higher score (normalized around 30s)
  const avgTimeSec = averageTimeMs / 1000;
  const timeFactor = Math.min(1.1, Math.max(0.9, 1 + (30 - avgTimeSec) / 300));

  // Difficulty adjustment
  const diffAdjust = (difficultyFactor - 5) * 1.5;

  const rawScore = baseScore * timeFactor + diffAdjust;

  // Clamp to 40-160 and round
  return Math.round(Math.min(160, Math.max(40, rawScore)));
}

export function calculatePercentile(iqScore: number): number {
  // Approximate percentile from IQ using normal distribution (mean=100, SD=15)
  const z = (iqScore - 100) / 15;
  // Approximation of normal CDF
  const p =
    1 / (1 + Math.exp(-1.7159 * Math.tanh(0.8862 * z)));
  return Math.round(Math.min(99, Math.max(1, p * 100)));
}

export function getIQLabel(iqScore: number): IQScaleEntry {
  for (const entry of IQ_SCALE) {
    if (iqScore >= entry.min) return entry;
  }
  return IQ_SCALE[IQ_SCALE.length - 1];
}

export function processTestSession(session: TestSession): TestResult {
  const correct = session.answers.filter((a) => a.isCorrect).length;
  const total = session.questions.length;
  const avgTime =
    session.answers.length > 0
      ? session.answers.reduce((sum, a) => sum + a.timeTaken, 0) / session.answers.length
      : 30000;

  const difficultyFactor = 5; // average difficulty

  const iqScore = calculateIQScore(correct, total, avgTime, difficultyFactor);
  const percentile = calculatePercentile(iqScore);

  return {
    id: session.id,
    type: session.type,
    mode: session.mode,
    completedAt: session.completedAt || Date.now(),
    iqScore,
    percentile,
    correctAnswers: correct,
    totalQuestions: total,
    averageTime: avgTime,
  };
}
