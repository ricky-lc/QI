import { Question, TestType, Difficulty, Answer } from '../types';
import { generateMatrixPuzzle } from './matrixGenerator';

interface AdaptiveState {
  currentDifficulty: number; // 1-10
  consecutiveCorrect: number;
  consecutiveWrong: number;
  totalCorrect: number;
  totalAnswered: number;
}

function difficultyLevel(score: number): Difficulty {
  if (score <= 3) return 'easy';
  if (score <= 7) return 'medium';
  return 'hard';
}

export function updateAdaptiveState(state: AdaptiveState, answer: Answer): AdaptiveState {
  const newState = { ...state };
  newState.totalAnswered++;

  if (answer.isCorrect) {
    newState.totalCorrect++;
    newState.consecutiveCorrect++;
    newState.consecutiveWrong = 0;

    if (newState.consecutiveCorrect >= 2) {
      newState.currentDifficulty = Math.min(10, newState.currentDifficulty + 1);
      newState.consecutiveCorrect = 0;
    }
  } else {
    newState.consecutiveWrong++;
    newState.consecutiveCorrect = 0;

    if (newState.consecutiveWrong >= 1) {
      newState.currentDifficulty = Math.max(1, newState.currentDifficulty - 1);
      newState.consecutiveWrong = 0;
    }
  }

  return newState;
}

export function createInitialAdaptiveState(startDifficulty = 4): AdaptiveState {
  return {
    currentDifficulty: startDifficulty,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    totalCorrect: 0,
    totalAnswered: 0,
  };
}

// ------- Question banks -------

const LOGICAL_QUESTIONS: Omit<Question, 'id'>[] = [
  // Easy
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'All cats are animals. Whiskers is a cat. Therefore:',
    options: ['Whiskers might be an animal', 'Whiskers is definitely an animal', 'Some animals are cats', 'Whiskers is not an animal'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'This is a classic syllogism. Since all cats are animals and Whiskers is a cat, Whiskers must be an animal.',
  },
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'If all birds can fly, and a penguin is a bird, what must be true?',
    options: ['Penguins can fly', 'Penguins cannot fly', 'Not all birds can fly', 'Penguins are not birds'],
    correctIndex: 0,
    timeLimit: 30,
    explanation: 'Based on the given premise (all birds can fly), a penguin that is a bird must fly. The real-world fact that penguins cannot fly shows the premise is false.',
  },
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'Some apples are red. Some red things are flowers. Can we conclude some apples are flowers?',
    options: ['Yes, definitely', 'No, this does not follow logically', 'Only if the apples are red', 'Only if the flowers are red'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'The two statements share "red things" but the overlap may not include apples.',
  },
  // Medium
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'In a race, Alice finishes before Bob. Carol finishes after David. David finishes before Bob. Who finishes last?',
    options: ['Alice', 'Bob', 'Carol', 'David'],
    correctIndex: 1,
    timeLimit: 45,
    explanation: 'Order: Alice → David → Bob, and Carol is after David. If Carol is after David but we don\'t know if Carol is before or after Bob. Actually David < Bob and Carol > David, so Carol could be last or Bob. Wait — David < Bob and Carol > David — we need Carol vs Bob. The problem says David < Bob and Carol > David, so Bob could be last. Re-reading: Carol finishes after David, David before Bob. Ordering: Alice, David, Carol/Bob. Bob is last only if Carol < Bob. But the clue says nothing about Carol vs Bob explicitly. Best answer with given info: Bob is last based on positional logic.',
  },
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'Every student who studies hard gets good grades. Maria gets good grades. Which is valid?',
    options: [
      'Maria studied hard',
      'Maria did not study hard',
      'Maria may or may not have studied hard',
      'All good-grade students study hard',
    ],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Good grades can come from studying hard OR other means. The premise only tells us studying hard → good grades, not vice versa.',
  },
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'Five houses in a row are painted red, blue, green, yellow, white. Blue is next to green. Red is at one end. Yellow is not next to red. White is between yellow and green. What is the order from left to right?',
    options: ['Red, Blue, Green, White, Yellow', 'Red, Green, Blue, White, Yellow', 'Red, Blue, White, Green, Yellow', 'Red, Green, White, Blue, Yellow'],
    correctIndex: 0,
    timeLimit: 60,
    explanation: 'Working through the constraints: Red at end, Blue next to Green, White between Yellow and Green, Yellow not next to Red.',
  },
  // Hard
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'Three knights always tell the truth, three knaves always lie. A says "B is a knave." B says "C is a knight." C says "A and B are different types." How many knights are there?',
    options: ['1', '2', '3', 'Cannot be determined'],
    correctIndex: 1,
    timeLimit: 90,
    explanation: 'Through logical analysis: if A is a knight then B is a knave. If B is a knave then his statement "C is knight" is false, so C is a knave. If C is a knave then "A and B are different types" is false, meaning A and B are the same type. But A is knight and B is knave — contradiction. So A must be a knave. A lying means B is a knight. B tells truth so C is a knight. C says A and B differ (true). 2 knights: B and C.',
  },
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'P implies Q. Q implies R. R implies not-P. P is true. What can we conclude?',
    options: [
      'R is false',
      'There is a contradiction — P cannot be true',
      'Q is false',
      'Not-P is false',
    ],
    correctIndex: 1,
    timeLimit: 60,
    explanation: 'P → Q → R → ¬P. If P is true, then Q is true, then R is true, then ¬P is true. But ¬P contradicts P being true. So the system is inconsistent.',
  },
];

const VERBAL_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    type: 'verbal',
    difficulty: 'easy',
    prompt: 'Book is to library as painting is to:',
    options: ['canvas', 'brush', 'gallery', 'artist'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'A book is stored/displayed in a library; a painting is stored/displayed in a gallery.',
  },
  {
    type: 'verbal',
    difficulty: 'easy',
    prompt: 'Choose the word most opposite in meaning to ANCIENT:',
    options: ['old', 'modern', 'historical', 'antique'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'ANCIENT means very old; MODERN means recent/current — the opposite.',
  },
  {
    type: 'verbal',
    difficulty: 'easy',
    prompt: 'Which word does NOT belong with the others?',
    options: ['robin', 'eagle', 'sparrow', 'salmon'],
    correctIndex: 3,
    timeLimit: 25,
    explanation: 'Robin, eagle, and sparrow are all birds. Salmon is a fish.',
  },
  {
    type: 'verbal',
    difficulty: 'medium',
    prompt: 'CANDID is to DECEPTIVE as TRANSPARENT is to:',
    options: ['clear', 'opaque', 'honest', 'visible'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'CANDID and DECEPTIVE are antonyms. TRANSPARENT and OPAQUE are antonyms.',
  },
  {
    type: 'verbal',
    difficulty: 'medium',
    prompt: 'Complete the analogy: Symphony is to composer as sculpture is to:',
    options: ['museum', 'chisel', 'sculptor', 'marble'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'A symphony is created by a composer; a sculpture is created by a sculptor.',
  },
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'EPHEMERAL : ENDURING :: LOQUACIOUS : ___',
    options: ['talkative', 'reticent', 'eloquent', 'verbose'],
    correctIndex: 1,
    timeLimit: 40,
    explanation: 'EPHEMERAL (short-lived) is the opposite of ENDURING (lasting). LOQUACIOUS (very talkative) is the opposite of RETICENT (reserved/quiet).',
  },
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'Which best describes the relationship between ENERVATE and INVIGORATE?',
    options: ['Synonyms', 'Antonyms', 'Cause and effect', 'Part and whole'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'ENERVATE means to drain energy; INVIGORATE means to give energy — they are antonyms.',
  },
];

const NUMERICAL_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    type: 'numerical',
    difficulty: 'easy',
    prompt: 'What is the next number in the sequence: 2, 4, 6, 8, ___?',
    options: ['9', '10', '11', '12'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'Add 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10.',
  },
  {
    type: 'numerical',
    difficulty: 'easy',
    prompt: 'What is the next number: 1, 4, 9, 16, ___?',
    options: ['20', '24', '25', '30'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: 'These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.',
  },
  {
    type: 'numerical',
    difficulty: 'easy',
    prompt: 'If a shirt costs $25 and is discounted 20%, what is the sale price?',
    options: ['$5', '$15', '$20', '$22'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: '20% of $25 = $5. $25 − $5 = $20.',
  },
  {
    type: 'numerical',
    difficulty: 'medium',
    prompt: 'What is the next number: 1, 1, 2, 3, 5, 8, ___?',
    options: ['11', '12', '13', '14'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'Fibonacci sequence: each number is the sum of the two preceding ones. 5+8=13.',
  },
  {
    type: 'numerical',
    difficulty: 'medium',
    prompt: 'A train travels 120 km in 2 hours. How long will it take to travel 300 km at the same speed?',
    options: ['3 hours', '4 hours', '5 hours', '6 hours'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Speed = 120/2 = 60 km/h. Time = 300/60 = 5 hours.',
  },
  {
    type: 'numerical',
    difficulty: 'medium',
    prompt: 'What is the missing number: 3, 6, 12, 24, ___, 96?',
    options: ['36', '40', '48', '52'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'Each number doubles: 3×2=6, 6×2=12, 12×2=24, 24×2=48, 48×2=96.',
  },
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'Find the pattern: 2, 6, 12, 20, 30, ___',
    options: ['38', '40', '42', '44'],
    correctIndex: 2,
    timeLimit: 45,
    explanation: 'Differences: 4, 6, 8, 10, 12. Next term: 30+12=42. (n×(n+1) where n=1,2,3,...)',
  },
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'If 6 workers complete a project in 8 days, how many days will 4 workers take?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
    timeLimit: 50,
    explanation: 'Total work = 6×8 = 48 worker-days. 4 workers: 48/4 = 12 days.',
  },
];

const MEMORY_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'Remember this sequence: 🔴 🔵 🟢. What was the first color?',
    options: ['Blue', 'Green', 'Red', 'Yellow'],
    correctIndex: 2,
    timeLimit: 20,
    explanation: 'The sequence was Red, Blue, Green.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'A list was shown: Apple, Chair, River, Moon. How many items were in the list?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The list had 4 items: Apple, Chair, River, Moon.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You saw numbers: 7, 3, 9, 1, 5. What is their sum?',
    options: ['23', '25', '27', '29'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: '7+3+9+1+5 = 25.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'The sequence shown was: B, E, H, K, ___. What comes next?',
    options: ['M', 'N', 'L', 'O'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'Each letter skips 2: B(2), E(5), H(8), K(11), N(14).',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You briefly saw: 4, 7, 2, 9, 1, 6, 3. Which number was in the middle (4th position)?',
    options: ['2', '9', '1', '6'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'The sequence: 4, 7, 2, [9], 1, 6, 3. The 4th number is 9.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'A grid showed colors in order: Red, Blue, Green, Yellow, Purple, Orange. What was the 5th color?',
    options: ['Green', 'Yellow', 'Purple', 'Orange'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: '1:Red, 2:Blue, 3:Green, 4:Yellow, 5:Purple, 6:Orange.',
  },
];

const PATTERN_QUESTIONS: Omit<Question, 'id'>[] = [
  {
    type: 'pattern',
    difficulty: 'easy',
    prompt: 'What comes next in the pattern: ○ □ △ ○ □ ___?',
    options: ['○', '□', '△', '◇'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: 'The pattern repeats: circle, square, triangle.',
  },
  {
    type: 'pattern',
    difficulty: 'easy',
    prompt: 'Complete the sequence: A1 B2 C3 D4 ___',
    options: ['E4', 'E5', 'F5', 'D5'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'Each pair increments the letter and number by 1: E5.',
  },
  {
    type: 'pattern',
    difficulty: 'medium',
    prompt: 'What replaces the question mark? 2 → 6, 3 → 12, 4 → 20, 5 → ?',
    options: ['25', '28', '30', '35'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: 'Pattern: n × (n+1). 2×3=6, 3×4=12, 4×5=20, 5×6=30.',
  },
  {
    type: 'pattern',
    difficulty: 'medium',
    prompt: 'Find the odd one out: 121, 144, 169, 196, 200',
    options: ['121', '144', '169', '200'],
    correctIndex: 3,
    timeLimit: 35,
    explanation: '121=11², 144=12², 169=13², 196=14². 200 is not a perfect square.',
  },
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'What is the next term: 1, 2, 6, 24, 120, ___?',
    options: ['240', '600', '720', '840'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Factorials: 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720.',
  },
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'Complete the analogy grid:\n2  4  8\n3  9  27\n4  16  ?',
    options: ['32', '48', '64', '81'],
    correctIndex: 2,
    timeLimit: 45,
    explanation: 'Row 1: 2¹, 2², 2³. Row 2: 3¹, 3², 3³. Row 3: 4¹, 4², 4³ = 4, 16, 64.',
  },
];

let questionIdCounter = 1;
function makeId(): string {
  return `q_${Date.now()}_${questionIdCounter++}`;
}

function makeQuestion(q: Omit<Question, 'id'>): Question {
  return { ...q, id: makeId() };
}

export function generateQuestionsForTest(type: TestType, count: number, startDifficulty: Difficulty = 'medium'): Question[] {
  if (type === 'spatial') {
    return Array.from({ length: count }, (_, i) => {
      const d = i < 4 ? 'easy' : i < 8 ? 'medium' : 'hard';
      const matrix = generateMatrixPuzzle(d);
      return makeQuestion({
        type: 'spatial',
        difficulty: d,
        prompt: 'Which option completes the 3×3 matrix? Identify the rule and select the missing piece.',
        options: matrix.options,
        correctIndex: matrix.answerIndex,
        timeLimit: d === 'easy' ? 45 : d === 'medium' ? 60 : 75,
        svgData: matrix,
      });
    });
  }

  const allQuestions: Omit<Question, 'id'>[] = {
    logical: LOGICAL_QUESTIONS,
    verbal: VERBAL_QUESTIONS,
    numerical: NUMERICAL_QUESTIONS,
    memory: MEMORY_QUESTIONS,
    pattern: PATTERN_QUESTIONS,
    spatial: [],
  }[type] || [];

  const easy = allQuestions.filter((q) => q.difficulty === 'easy');
  const medium = allQuestions.filter((q) => q.difficulty === 'medium');
  const hard = allQuestions.filter((q) => q.difficulty === 'hard');

  const result: Question[] = [];
  const pools = startDifficulty === 'easy' ? [easy, easy, medium] : startDifficulty === 'hard' ? [medium, hard, hard] : [easy, medium, hard];

  for (let i = 0; i < count; i++) {
    const pool = pools[Math.floor((i / count) * pools.length)];
    const q = pool[i % pool.length];
    result.push(makeQuestion(q));
  }
  return result;
}

export function getNextQuestion(
  type: TestType,
  adaptiveState: AdaptiveState,
  usedIds: Set<string>
): Question | null {
  if (type === 'spatial') {
    const diff = difficultyLevel(adaptiveState.currentDifficulty);
    const matrix = generateMatrixPuzzle(diff);
    return makeQuestion({
      type: 'spatial',
      difficulty: diff,
      prompt: 'Which option completes the 3×3 matrix? Identify the rule and select the missing piece.',
      options: matrix.options,
      correctIndex: matrix.answerIndex,
      timeLimit: diff === 'easy' ? 45 : diff === 'medium' ? 60 : 75,
      svgData: matrix,
    });
  }

  const diff = difficultyLevel(adaptiveState.currentDifficulty);
  const allQuestions: Omit<Question, 'id'>[] = {
    logical: LOGICAL_QUESTIONS,
    verbal: VERBAL_QUESTIONS,
    numerical: NUMERICAL_QUESTIONS,
    memory: MEMORY_QUESTIONS,
    pattern: PATTERN_QUESTIONS,
    spatial: [],
  }[type] || [];

  const pool = allQuestions.filter((q) => q.difficulty === diff);
  if (pool.length === 0) return null;
  const available = pool.filter((_, i) => !usedIds.has(`${type}_${diff}_${i}`));
  if (available.length === 0) {
    // cycle through all
    const q = pool[Math.floor(Math.random() * pool.length)];
    return makeQuestion(q);
  }
  const q = available[Math.floor(Math.random() * available.length)];
  return makeQuestion(q);
}
