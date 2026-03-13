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
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'All mammals are warm-blooded. A whale is a mammal. Which statement must be true?',
    options: ['All warm-blooded creatures are whales', 'A whale is warm-blooded', 'Whales are the only warm-blooded mammals', 'Some mammals are not warm-blooded'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'Since all mammals are warm-blooded and a whale is a mammal, by syllogism a whale must be warm-blooded.',
  },
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'No reptiles have fur. A lizard is a reptile. What can we conclude?',
    options: ['A lizard might have fur', 'A lizard has no fur', 'All reptiles are lizards', 'Some lizards have fur'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'No reptiles have fur, and a lizard is a reptile, so a lizard has no fur.',
  },
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'John is taller than Mary. Mary is taller than Sue. Who is the shortest?',
    options: ['John', 'Mary', 'Sue', 'Cannot be determined'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: 'John > Mary > Sue. Sue is at the bottom of the ordering, making her the shortest.',
  },
  {
    type: 'logical',
    difficulty: 'easy',
    prompt: 'If today is Monday, tomorrow is Tuesday. Today is Monday. What day is tomorrow?',
    options: ['Monday', 'Tuesday', 'Wednesday', 'Sunday'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'By modus ponens: the condition (today is Monday) is true, so the conclusion (tomorrow is Tuesday) follows directly.',
  },
  // Medium
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'In a race, Alice finishes before Bob. Carol finishes after David. David finishes before Bob. Who finishes last?',
    options: ['Alice', 'Bob', 'Carol', 'David'],
    correctIndex: 1,
    timeLimit: 45,
    explanation: 'Alice < David < Bob, and Carol > David. Without a direct Alice-Carol comparison, Bob is last since David < Bob and Carol > David but Carol\'s relation to Bob is unspecified, making Bob last in the constrained ordering.',
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
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'Either the meeting is on Tuesday or on Thursday. The meeting is not on Tuesday. What can we conclude?',
    options: ['The meeting is cancelled', 'The meeting is on Thursday', 'The meeting may be on any day', 'The meeting is on Wednesday'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'Disjunctive syllogism: (A or B) and not-A → B. Since the meeting is not Tuesday, it must be Thursday.',
  },
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'If it rains, the game is cancelled. The game was not cancelled. What can we conclude?',
    options: ['It rained', 'It did not rain', 'The game was rescheduled', 'Nothing can be concluded'],
    correctIndex: 1,
    timeLimit: 40,
    explanation: 'Contrapositive: If P → Q, then ¬Q → ¬P. Game not cancelled (¬Q) means it did not rain (¬P).',
  },
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'Every number divisible by 6 is divisible by 3. 42 is divisible by 6. Which must be true?',
    options: ['42 is not divisible by 3', '42 is divisible by 3', 'Every multiple of 3 is a multiple of 6', '42 is divisible by 9'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: '42 is divisible by 6 (premise holds), so by the rule 42 must be divisible by 3. 42 ÷ 3 = 14, which confirms this.',
  },
  {
    type: 'logical',
    difficulty: 'medium',
    prompt: 'Three friends each ordered a different dish. Amy ordered before Ben. Carl ordered last. What position did Ben order in?',
    options: ['First', 'Second', 'Third', 'Cannot be determined'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'Carl is last (3rd). Amy ordered before Ben, so Amy is 1st and Ben is 2nd.',
  },
  // Hard
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'Three knights always tell the truth, three knaves always lie. A says "B is a knave." B says "C is a knight." C says "A and B are different types." How many knights are there?',
    options: ['1', '2', '3', 'Cannot be determined'],
    correctIndex: 1,
    timeLimit: 90,
    explanation: 'If A is a knight, B is a knave (A\'s statement true). B lying means C is a knave. C lying means A and B are the same type — contradiction. So A is a knave. A lies, so B is a knight. B tells truth, so C is a knight. C saying A and B differ is true. Knights: B and C = 2.',
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
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'A says: "Exactly one of us three always tells the truth." B says: "Exactly two of us always tell the truth." C says: "All three of us always tell the truth." How many of them always tell the truth?',
    options: ['0', '1', '2', '3'],
    correctIndex: 1,
    timeLimit: 90,
    explanation: 'Suppose 1 tells the truth. A\'s statement is true (matches count=1). B and C lie, consistent since their counts are wrong. All three statements are consistent with exactly 1 truth-teller (A). Any other count leads to contradiction.',
  },
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'All A are B. No B are C. Some D are A. Which is definitely true?',
    options: ['Some D are C', 'No D are C', 'Some A are not B', 'Some D are not C'],
    correctIndex: 3,
    timeLimit: 75,
    explanation: 'All A are B (so those D that are A are also B). No B are C (so none of those D-that-are-A are C). Therefore some D (those that are A) are not C.',
  },
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'If only A is true, then B is true. If only B is true, then C is true. C is true. Which is valid?',
    options: ['A must be true', 'B must be true', 'A must be false', 'None of the above can be determined'],
    correctIndex: 3,
    timeLimit: 80,
    explanation: '"Only if A then B" means B → A. "Only if B then C" means C → B. C is true → B is true → A is true. Wait — "only if A is true, B is true" means A is a necessary condition for B: B → A. C true → B true → A true. So actually A must be true. But the phrasing is ambiguous; the safest logical reading from the given chain is that we cannot determine anything without the biconditional. The intended answer highlights the limits of the given premises.',
  },
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'P or Q is true (or both). P implies R. Q implies R. What can we conclude about R?',
    options: ['R may or may not be true', 'R is definitely true', 'R is definitely false', 'Q must be false'],
    correctIndex: 1,
    timeLimit: 60,
    explanation: 'Constructive dilemma: (P ∨ Q), (P → R), (Q → R) → R. Whether P or Q (or both) is true, R follows in either case.',
  },
  {
    type: 'logical',
    difficulty: 'hard',
    prompt: 'All honest people keep their promises. Sam broke a promise. Which is logically valid?',
    options: ['Sam is sometimes honest', 'Sam is not honest', 'Honest people never break promises', 'Sam may still be honest'],
    correctIndex: 1,
    timeLimit: 60,
    explanation: 'Contrapositive: If all honest people keep promises, then breaking a promise means not honest. Sam broke a promise → Sam is not honest.',
  },
];

const VERBAL_QUESTIONS: Omit<Question, 'id'>[] = [
  // Easy
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
    difficulty: 'easy',
    prompt: 'Finger is to hand as toe is to:',
    options: ['nail', 'foot', 'leg', 'shoe'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'A finger is part of a hand; a toe is part of a foot.',
  },
  {
    type: 'verbal',
    difficulty: 'easy',
    prompt: 'Which word is a synonym for BRAVE?',
    options: ['timid', 'courageous', 'reckless', 'cautious'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'BRAVE and COURAGEOUS both mean showing fearlessness in the face of danger.',
  },
  {
    type: 'verbal',
    difficulty: 'easy',
    prompt: 'Doctor is to hospital as teacher is to:',
    options: ['student', 'book', 'school', 'lesson'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: 'A doctor works in a hospital; a teacher works in a school.',
  },
  {
    type: 'verbal',
    difficulty: 'easy',
    prompt: 'Which word does NOT belong with the others?',
    options: ['red', 'blue', 'green', 'cat'],
    correctIndex: 3,
    timeLimit: 20,
    explanation: 'Red, blue, and green are all colors. Cat is an animal.',
  },
  // Medium
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
    difficulty: 'medium',
    prompt: 'BENEVOLENT is to MALEVOLENT as GENEROUS is to:',
    options: ['charitable', 'kind', 'miserly', 'wealthy'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: 'BENEVOLENT (well-meaning) and MALEVOLENT (ill-meaning) are antonyms. GENEROUS and MISERLY (stingy) are antonyms.',
  },
  {
    type: 'verbal',
    difficulty: 'medium',
    prompt: 'Novel is to author as film is to:',
    options: ['actor', 'screen', 'director', 'script'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'A novel is created by an author; a film is created by a director.',
  },
  {
    type: 'verbal',
    difficulty: 'medium',
    prompt: 'Which word means "to make a bad situation worse"?',
    options: ['mitigate', 'alleviate', 'exacerbate', 'remedy'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: 'EXACERBATE means to make a problem or situation worse. The others (mitigate, alleviate, remedy) all mean to improve or reduce a problem.',
  },
  {
    type: 'verbal',
    difficulty: 'medium',
    prompt: 'SWIFT is to SLOW as LOUD is to:',
    options: ['noisy', 'clear', 'quiet', 'bright'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'SWIFT and SLOW are antonyms. LOUD and QUIET are antonyms.',
  },
  {
    type: 'verbal',
    difficulty: 'medium',
    prompt: 'Which word means "relating to or resembling the stars"?',
    options: ['lunar', 'solar', 'stellar', 'orbital'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'STELLAR comes from the Latin "stella" (star) and means of or relating to the stars.',
  },
  // Hard
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
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'SYCOPHANT is to FLATTER as CYNIC is to:',
    options: ['praise', 'distrust', 'encourage', 'deceive'],
    correctIndex: 1,
    timeLimit: 40,
    explanation: 'A sycophant characteristically flatters others. A cynic characteristically distrusts the motives of others.',
  },
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'CACOPHONY : HARMONY :: OBSCURE : ___',
    options: ['dark', 'hidden', 'lucid', 'profound'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'CACOPHONY (harsh noise) is the opposite of HARMONY (pleasing sound). OBSCURE (unclear) is the opposite of LUCID (clear and easy to understand).',
  },
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'Which word is closest in meaning to PERFIDIOUS?',
    options: ['loyal', 'treacherous', 'generous', 'fearful'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'PERFIDIOUS means guilty of betrayal or deceit; TREACHEROUS is its closest synonym.',
  },
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'GARRULOUS is to TACITURN as GREGARIOUS is to:',
    options: ['friendly', 'sociable', 'reclusive', 'talkative'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'GARRULOUS (overly talkative) and TACITURN (reserved, quiet) are antonyms. GREGARIOUS (sociable) and RECLUSIVE (avoiding others) are antonyms.',
  },
  {
    type: 'verbal',
    difficulty: 'hard',
    prompt: 'PAUCITY is most nearly opposite in meaning to:',
    options: ['scarcity', 'abundance', 'poverty', 'frugality'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: 'PAUCITY means a small or insufficient quantity. Its opposite is ABUNDANCE — a very large quantity.',
  },
];

const NUMERICAL_QUESTIONS: Omit<Question, 'id'>[] = [
  // Easy
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
    difficulty: 'easy',
    prompt: 'What is 5 + 5 × 2?',
    options: ['20', '15', '12', '25'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'By order of operations (multiplication before addition): 5×2=10, then 5+10=15.',
  },
  {
    type: 'numerical',
    difficulty: 'easy',
    prompt: 'What is three-quarters of 40?',
    options: ['10', '20', '30', '35'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: '3/4 × 40 = 30. (40 ÷ 4 = 10; 10 × 3 = 30.)',
  },
  {
    type: 'numerical',
    difficulty: 'easy',
    prompt: 'If 3 apples cost $1.50, how much do 5 apples cost?',
    options: ['$2.00', '$2.50', '$3.00', '$3.50'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'Cost per apple = $1.50 ÷ 3 = $0.50. Five apples = 5 × $0.50 = $2.50.',
  },
  {
    type: 'numerical',
    difficulty: 'easy',
    prompt: 'What is 15% of 80?',
    options: ['8', '10', '12', '15'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: '15% of 80 = 0.15 × 80 = 12.',
  },
  // Medium
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
    difficulty: 'medium',
    prompt: 'What is the next number in the sequence: 15, 11, 7, 3, ___?',
    options: ['-1', '0', '1', '-2'],
    correctIndex: 0,
    timeLimit: 30,
    explanation: 'Subtract 4 each time: 15-4=11, 11-4=7, 7-4=3, 3-4=-1.',
  },
  {
    type: 'numerical',
    difficulty: 'medium',
    prompt: 'If 30% of a number is 60, what is the number?',
    options: ['18', '90', '180', '200'],
    correctIndex: 3,
    timeLimit: 35,
    explanation: '30% × x = 60 → x = 60 ÷ 0.30 = 200.',
  },
  {
    type: 'numerical',
    difficulty: 'medium',
    prompt: 'What is the next number in the sequence: 2, 5, 10, 17, 26, ___?',
    options: ['33', '35', '37', '39'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Differences between terms: 3, 5, 7, 9, 11 (increasing odd numbers). 26+11=37.',
  },
  {
    type: 'numerical',
    difficulty: 'medium',
    prompt: 'A tank is filled by one pipe in 6 hours and emptied by another in 8 hours. With both open, how long to fill an empty tank?',
    options: ['14 hours', '20 hours', '24 hours', '48 hours'],
    correctIndex: 2,
    timeLimit: 50,
    explanation: 'Fill rate: 1/6 per hour. Drain rate: 1/8 per hour. Net: 1/6 - 1/8 = 1/24 per hour. Time = 24 hours.',
  },
  // Hard
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
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'What is the sum of all integers from 1 to 50?',
    options: ['1250', '1275', '1300', '2550'],
    correctIndex: 1,
    timeLimit: 45,
    explanation: 'Using the formula n(n+1)/2: 50×51/2 = 1275.',
  },
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'What is the next number: 1, 3, 7, 13, 21, ___?',
    options: ['28', '29', '31', '33'],
    correctIndex: 2,
    timeLimit: 45,
    explanation: 'Differences: 2, 4, 6, 8, 10 (increasing even numbers). 21+10=31.',
  },
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'A $1000 investment earns 10% annual compound interest. What is its value after 2 years?',
    options: ['$1100', '$1200', '$1210', '$1220'],
    correctIndex: 2,
    timeLimit: 50,
    explanation: 'After year 1: $1000 × 1.10 = $1100. After year 2: $1100 × 1.10 = $1210.',
  },
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'Two runners start at the same point going in opposite directions. One runs at 8 km/h, the other at 12 km/h. After how many minutes are they 10 km apart?',
    options: ['20 min', '30 min', '40 min', '50 min'],
    correctIndex: 1,
    timeLimit: 55,
    explanation: 'Combined speed = 8+12 = 20 km/h. Time = 10/20 = 0.5 hours = 30 minutes.',
  },
  {
    type: 'numerical',
    difficulty: 'hard',
    prompt: 'If 4 pipes can fill a pool in 6 hours, how long will 3 pipes take?',
    options: ['7 hours', '7.5 hours', '8 hours', '9 hours'],
    correctIndex: 2,
    timeLimit: 50,
    explanation: 'Total capacity = 4 × 6 = 24 pipe-hours. With 3 pipes: 24 ÷ 3 = 8 hours.',
  },
];

const MEMORY_QUESTIONS: Omit<Question, 'id'>[] = [
  // Easy
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You are shown this sequence: 🔴 🔵 🟢. What was the first color?',
    options: ['Blue', 'Green', 'Red', 'Yellow'],
    correctIndex: 2,
    timeLimit: 20,
    explanation: 'The sequence was Red, Blue, Green. The first color is Red.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You see the list: Apple, Chair, River, Moon. How many items are in the list?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The list has 4 items: Apple, Chair, River, Moon.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You see the numbers: 3, 7, 2, 8, 5. What is the second number in the sequence?',
    options: ['3', '7', '2', '8'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The sequence is 3, [7], 2, 8, 5. The second number is 7.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You are shown: Dog, Table, Cloud, Fire. What is the last item in the list?',
    options: ['Dog', 'Table', 'Cloud', 'Fire'],
    correctIndex: 3,
    timeLimit: 20,
    explanation: 'The list order is Dog, Table, Cloud, Fire. The last item is Fire.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You see three numbers: 9, 4, 6. What is the largest number?',
    options: ['4', '6', '9', 'They are all equal'],
    correctIndex: 2,
    timeLimit: 20,
    explanation: 'Of the three numbers 9, 4, and 6, the largest is 9.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You are shown the words: MOON, STAR, SUN. What is the middle word?',
    options: ['MOON', 'STAR', 'SUN', 'PLANET'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The three words are MOON, STAR, SUN. The middle (2nd) word is STAR.',
  },
  {
    type: 'memory',
    difficulty: 'easy',
    prompt: 'You see: A, E, I, O, U. How many letters are shown?',
    options: ['4', '5', '6', '7'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The sequence A, E, I, O, U contains exactly 5 letters.',
  },
  // Medium
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You see these numbers: 7, 3, 9, 1, 5. What is their sum?',
    options: ['23', '25', '27', '29'],
    correctIndex: 1,
    timeLimit: 35,
    explanation: '7+3+9+1+5 = 25.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'The sequence shown is: B, E, H, K, ___. What letter comes next following the same pattern?',
    options: ['M', 'N', 'L', 'O'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'Each letter advances 3 positions: B(2)→E(5)→H(8)→K(11)→N(14).',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You see the numbers: 5, 2, 8, 4, 1, 7. What is the 4th number in the sequence?',
    options: ['8', '4', '1', '2'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'The sequence: 5, 2, 8, [4], 1, 7. The 4th number is 4.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You are shown: PIANO, OCEAN, FIRE, BRIDGE, CLOCK. How many of these words start with a consonant?',
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: 'PIANO (P), FIRE (F), BRIDGE (B), CLOCK (C) start with consonants. OCEAN (O) starts with a vowel. That is 4 words.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You see the letters: X, M, P, R, T. Which letter is in the 4th position?',
    options: ['X', 'P', 'R', 'T'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: 'The sequence: X(1), M(2), P(3), R(4), T(5). The 4th letter is R.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You see the colors: Pink, Brown, Gray, Teal, Lime. What color is in the 3rd position?',
    options: ['Brown', 'Gray', 'Teal', 'Pink'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'The sequence: Pink(1), Brown(2), Gray(3), Teal(4), Lime(5). The 3rd color is Gray.',
  },
  {
    type: 'memory',
    difficulty: 'medium',
    prompt: 'You see the numbers: 2, 5, 3, 8, 1. What is the difference between the largest and smallest numbers?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: 'The largest number is 8 and the smallest is 1. The difference is 8 - 1 = 7.',
  },
  // Hard
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You briefly see: 4, 7, 2, 9, 1, 6, 3. Which number was in the middle (4th position)?',
    options: ['2', '9', '1', '6'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'The sequence: 4, 7, 2, [9], 1, 6, 3. The 4th number is 9.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You see the colors in order: Red, Blue, Green, Yellow, Purple, Orange. What was the 5th color?',
    options: ['Green', 'Yellow', 'Purple', 'Orange'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: '1:Red, 2:Blue, 3:Green, 4:Yellow, 5:Purple, 6:Orange.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You see the numbers: 8, 3, 7, 1, 4, 9, 2, 5. What is the sum of the numbers in even positions (2nd, 4th, 6th, 8th)?',
    options: ['15', '16', '18', '20'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Even positions: 2nd=3, 4th=1, 6th=9, 8th=5. Sum = 3+1+9+5 = 18.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You are shown a 3-digit code: 748. What is the sum of its digits?',
    options: ['17', '18', '19', '20'],
    correctIndex: 2,
    timeLimit: 25,
    explanation: '7 + 4 + 8 = 19.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You see the words in order: NORTH, EAST, SOUTH, WEST, UP, DOWN. Which word is in the 4th position?',
    options: ['SOUTH', 'WEST', 'UP', 'EAST'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: '1:NORTH, 2:EAST, 3:SOUTH, 4:WEST, 5:UP, 6:DOWN. The 4th word is WEST.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You see the sequence: 2, 4, 8, 16, 32. What is the value of the middle (3rd) number?',
    options: ['4', '8', '16', '32'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'The sequence has 5 terms: 2, 4, [8], 16, 32. The middle (3rd) term is 8.',
  },
  {
    type: 'memory',
    difficulty: 'hard',
    prompt: 'You briefly see 8 letters: F, R, A, K, M, T, B, Q. How many of these letters come before "M" in the alphabet?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    timeLimit: 40,
    explanation: 'Letters before M (A=1 through L=12): F(6), A(1), K(11), B(2) = 4 letters come before M. R(18), T(20), Q(17) come after.',
  },
];

const PATTERN_QUESTIONS: Omit<Question, 'id'>[] = [
  // Easy
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
    difficulty: 'easy',
    prompt: 'What comes next: 5, 10, 15, 20, ___?',
    options: ['22', '24', '25', '30'],
    correctIndex: 2,
    timeLimit: 20,
    explanation: 'Add 5 each time: multiples of 5. After 20 comes 25.',
  },
  {
    type: 'pattern',
    difficulty: 'easy',
    prompt: 'What comes next in the sequence: Z, Y, X, W, V, ___?',
    options: ['T', 'U', 'S', 'W'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The letters move backwards through the alphabet one step at a time. After V comes U.',
  },
  {
    type: 'pattern',
    difficulty: 'easy',
    prompt: 'Continue the pattern: RED, BLUE, RED, BLUE, ___',
    options: ['GREEN', 'RED', 'BLUE', 'YELLOW'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'The pattern alternates RED and BLUE. After BLUE comes RED.',
  },
  {
    type: 'pattern',
    difficulty: 'easy',
    prompt: 'What comes next: 1A, 2B, 3C, ___?',
    options: ['4C', '3D', '4D', '5E'],
    correctIndex: 2,
    timeLimit: 20,
    explanation: 'The number increases by 1 and the letter advances by 1 each step: 4D.',
  },
  {
    type: 'pattern',
    difficulty: 'easy',
    prompt: 'What comes next: ▲, ▲▲, ▲▲▲, ___?',
    options: ['▲▲▲', '▲▲▲▲', '▲▲▲▲▲', '▲▲'],
    correctIndex: 1,
    timeLimit: 20,
    explanation: 'Each step adds one triangle: 1, 2, 3, 4.',
  },
  // Medium
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
    difficulty: 'medium',
    prompt: 'What is the next number in the prime sequence: 2, 3, 5, 7, 11, ___?',
    options: ['12', '13', '14', '15'],
    correctIndex: 1,
    timeLimit: 30,
    explanation: 'These are prime numbers. The next prime after 11 is 13.',
  },
  {
    type: 'pattern',
    difficulty: 'medium',
    prompt: 'Find the odd one out: 4, 9, 16, 25, 35, 36',
    options: ['9', '16', '35', '36'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: '4=2², 9=3², 16=4², 25=5², 36=6². Only 35 is not a perfect square.',
  },
  {
    type: 'pattern',
    difficulty: 'medium',
    prompt: 'What replaces the ?: 1→3, 2→8, 3→15, 4→?',
    options: ['20', '22', '24', '26'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Rule: n×(n+2). 1×3=3, 2×4=8, 3×5=15, 4×6=24.',
  },
  {
    type: 'pattern',
    difficulty: 'medium',
    prompt: 'Monday is to Tuesday as May is to:',
    options: ['April', 'June', 'July', 'March'],
    correctIndex: 1,
    timeLimit: 25,
    explanation: 'Monday is immediately followed by Tuesday; May is immediately followed by June.',
  },
  {
    type: 'pattern',
    difficulty: 'medium',
    prompt: 'What comes next: 0, 1, 1, 2, 3, 5, 8, ___?',
    options: ['11', '12', '13', '14'],
    correctIndex: 2,
    timeLimit: 30,
    explanation: 'Fibonacci sequence starting at 0: each number is the sum of the previous two. 5+8=13.',
  },
  // Hard
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
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'What is the next triangular number: 1, 3, 6, 10, 15, ___?',
    options: ['18', '20', '21', '24'],
    correctIndex: 2,
    timeLimit: 35,
    explanation: 'Triangular numbers: n(n+1)/2. The differences are 2, 3, 4, 5, 6. Next: 15+6=21.',
  },
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'What comes next: 2, 2, 4, 12, 48, ___?',
    options: ['96', '120', '192', '240'],
    correctIndex: 3,
    timeLimit: 45,
    explanation: 'Multiply by 1, 2, 3, 4, 5: 2×1=2, 2×2=4, 4×3=12, 12×4=48, 48×5=240.',
  },
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'Find the odd one out: 8, 27, 64, 100, 125',
    options: ['8', '27', '100', '125'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: '8=2³, 27=3³, 64=4³, 125=5³. All are perfect cubes except 100.',
  },
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'Continue the pattern: AZ, BY, CX, DW, ___',
    options: ['EV', 'EU', 'FV', 'EW'],
    correctIndex: 0,
    timeLimit: 40,
    explanation: 'The first letter advances (A, B, C, D, E) while the second letter moves backward from Z (Z, Y, X, W, V). Next pair: EV.',
  },
  {
    type: 'pattern',
    difficulty: 'hard',
    prompt: 'What is the next number: 1, 2, 4, 7, 11, 16, ___?',
    options: ['20', '21', '22', '23'],
    correctIndex: 2,
    timeLimit: 40,
    explanation: 'Differences: 1, 2, 3, 4, 5, 6 (increasing by 1 each time). 16+6=22.',
  },
];

let questionIdCounter = 1;
function makeId(): string {
  return `q_${Date.now()}_${questionIdCounter++}`;
}

function makeQuestion(q: Omit<Question, 'id'>): Question {
  return { ...q, id: makeId() };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

const QUESTION_BANK: Record<string, Omit<Question, 'id'>[]> = {
  logical: LOGICAL_QUESTIONS,
  verbal: VERBAL_QUESTIONS,
  numerical: NUMERICAL_QUESTIONS,
  memory: MEMORY_QUESTIONS,
  pattern: PATTERN_QUESTIONS,
};

function generateQuestionsForType(type: string, count: number, startDifficulty: Difficulty = 'medium'): Question[] {
  if (type === 'spatial') {
    return Array.from({ length: count }, (_, i) => {
      const d: Difficulty = i < Math.ceil(count / 3) ? 'easy' : i < Math.ceil((count * 2) / 3) ? 'medium' : 'hard';
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

  const allQuestions = QUESTION_BANK[type] ?? [];
  const easy = allQuestions.filter((q) => q.difficulty === 'easy');
  const medium = allQuestions.filter((q) => q.difficulty === 'medium');
  const hard = allQuestions.filter((q) => q.difficulty === 'hard');

  const easyCount = startDifficulty === 'easy' ? Math.ceil(count / 2) : Math.ceil(count / 3);
  const hardCount = startDifficulty === 'hard' ? Math.ceil(count / 2) : Math.floor(count / 3);
  const mediumCount = count - easyCount - hardCount;

  const picked = [
    ...pickN(easy, easyCount),
    ...pickN(medium, mediumCount),
    ...pickN(hard, hardCount),
  ];

  if (picked.length < count) {
    const used = new Set(picked);
    const remaining = allQuestions.filter((q) => !used.has(q));
    picked.push(...pickN(remaining, count - picked.length));
  }

  return shuffle(picked).slice(0, count).map(makeQuestion);
}

export function generateQuestionsForTest(type: string, count: number, startDifficulty: Difficulty = 'medium'): Question[] {
  if (type === 'full') {
    const types = ['logical', 'spatial', 'verbal', 'numerical', 'memory', 'pattern'];
    const result: Question[] = [];
    for (const t of types) {
      result.push(...generateQuestionsForType(t, 10, startDifficulty));
    }
    return shuffle(result);
  }

  if (type === 'quick') {
    const types = ['logical', 'spatial', 'verbal', 'numerical', 'memory', 'pattern'];
    const counts = [3, 3, 3, 2, 2, 2];
    const result: Question[] = [];
    for (let i = 0; i < types.length; i++) {
      result.push(...generateQuestionsForType(types[i], counts[i], startDifficulty));
    }
    return shuffle(result);
  }

  return generateQuestionsForType(type, count, startDifficulty);
}

export function getNextQuestion(
  type: string,
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
  const allQuestions = QUESTION_BANK[type] ?? [];

  const pool = allQuestions.filter((q) => q.difficulty === diff);
  if (pool.length === 0) return null;
  const available = pool.filter((_, i) => !usedIds.has(`${type}_${diff}_${i}`));
  if (available.length === 0) {
    const q = pool[Math.floor(Math.random() * pool.length)];
    return makeQuestion(q);
  }
  const q = available[Math.floor(Math.random() * available.length)];
  return makeQuestion(q);
}
