export type TestType =
  | 'logical'
  | 'spatial'
  | 'memory'
  | 'pattern'
  | 'verbal'
  | 'numerical';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type TestMode = 'assessment' | 'practice';

export interface Question {
  id: string;
  type: TestType;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  correctIndex: number;
  timeLimit: number; // seconds
  explanation?: string;
  svgData?: MatrixData; // for matrix questions
}

export interface MatrixData {
  cells: (string | null)[][];
  options: string[];
  answerIndex: number;
  rule: string;
}

export interface Answer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeTaken: number; // milliseconds
}

export interface TestSession {
  id: string;
  type: TestType;
  mode: TestMode;
  startedAt: number;
  completedAt?: number;
  questions: Question[];
  answers: Answer[];
  iqScore?: number;
  percentile?: number;
  difficulty: Difficulty;
}

export interface TestResult {
  id: string;
  type: TestType;
  mode: TestMode;
  completedAt: number;
  iqScore: number;
  percentile: number;
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number;
}

export interface UserProfile {
  id: string;
  createdAt: number;
  results: TestResult[];
  practiceHistory: PracticeRecord[];
}

export interface PracticeRecord {
  type: TestType;
  date: number;
  score: number;
  improvement: number;
}

export interface BotSignal {
  tooFast: boolean;
  perfectTiming: boolean;
  noVariance: boolean;
  suspiciousAccuracy: boolean;
}
