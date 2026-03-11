import { TestType } from '../types';

export interface TestConfig {
  id: TestType;
  title: string;
  description: string;
  icon: string;
  duration: number; // minutes
  questionCount: number;
  skills: string[];
  color: string;
}

export const TEST_CONFIGS: TestConfig[] = [
  {
    id: 'logical',
    title: 'Logical Reasoning',
    description: 'Test your ability to reason through complex scenarios and draw conclusions',
    icon: '🧩',
    duration: 10,
    questionCount: 15,
    skills: ['Deductive reasoning', 'Critical thinking', 'Problem solving'],
    color: '#B3D4FF',
  },
  {
    id: 'spatial',
    title: 'Spatial Intelligence',
    description: 'Visualize and manipulate objects in your mind using 3×3 matrix puzzles',
    icon: '🔷',
    duration: 10,
    questionCount: 12,
    skills: ['Pattern recognition', 'Visual rotation', 'Spatial memory'],
    color: '#D4B3FF',
  },
  {
    id: 'memory',
    title: 'Working Memory',
    description: 'Measure your ability to hold and manipulate information in real time',
    icon: '🧠',
    duration: 8,
    questionCount: 12,
    skills: ['Short-term memory', 'Attention', 'Cognitive capacity'],
    color: '#FFB3C6',
  },
  {
    id: 'pattern',
    title: 'Pattern Recognition',
    description: 'Identify rules and predict the next element in complex sequences',
    icon: '🔮',
    duration: 8,
    questionCount: 12,
    skills: ['Inductive reasoning', 'Abstract thinking', 'Sequencing'],
    color: '#B3FFD4',
  },
  {
    id: 'verbal',
    title: 'Verbal Intelligence',
    description: 'Evaluate your language comprehension and verbal reasoning skills',
    icon: '📚',
    duration: 10,
    questionCount: 15,
    skills: ['Vocabulary', 'Analogies', 'Comprehension'],
    color: '#FFF3B3',
  },
  {
    id: 'numerical',
    title: 'Numerical Reasoning',
    description: 'Solve mathematical and number-series challenges',
    icon: '🔢',
    duration: 10,
    questionCount: 15,
    skills: ['Arithmetic', 'Series completion', 'Quantitative reasoning'],
    color: '#FFD4B3',
  },
];

export const FULL_TEST_CONFIG = {
  id: 'full',
  title: 'Full IQ Assessment',
  description: 'Comprehensive test covering all types of intelligence',
  icon: '⚡',
  duration: 40,
  questionCount: 60,
  color: '#E8B3FF',
};

export const IQ_SCALE = {
  genius: { min: 145, label: 'Genius', emoji: '🌟' },
  verySuperior: { min: 130, label: 'Very Superior', emoji: '✨' },
  superior: { min: 120, label: 'Superior', emoji: '💎' },
  highAverage: { min: 110, label: 'High Average', emoji: '🚀' },
  average: { min: 90, label: 'Average', emoji: '⭐' },
  lowAverage: { min: 80, label: 'Low Average', emoji: '🌱' },
  borderline: { min: 70, label: 'Borderline', emoji: '💡' },
  low: { min: 0, label: 'Below Average', emoji: '📈' },
};

export const ADAPTIVE_THRESHOLDS = {
  increaseAfterCorrect: 2, // consecutive correct to increase difficulty
  decreaseAfterWrong: 1,   // consecutive wrong to decrease difficulty
  maxDifficulty: 10,
  minDifficulty: 1,
};
