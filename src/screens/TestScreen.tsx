import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { COLORS, CATEGORY_GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ProgressBar } from '../components/ProgressBar';
import { TestTimer } from '../components/TestTimer';
import { MatrixPuzzle } from '../components/MatrixPuzzle';
import { generateQuestionsForTest, updateAdaptiveState, createInitialAdaptiveState } from '../utils/adaptiveEngine';
import { processTestSession } from '../utils/scoreCalculator';
import { saveResult } from '../utils/storage';
import { detectBot, isBotLikely } from '../utils/botDetection';
import { Question, Answer, TestSession, TestType, Difficulty } from '../types';

type RouteParams = { type: string; mode: 'assessment' | 'practice' };

const QUESTIONS_PER_TEST = 12;

export function TestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { type, mode = 'assessment' } = route.params || {};

  const testType = type as TestType;
  const gradient = CATEGORY_GRADIENTS[testType] || ['#667eea', '#764ba2'];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState(false);
  const [adaptiveState, setAdaptiveState] = useState(createInitialAdaptiveState(4));
  const [isLoading, setIsLoading] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  const questionStartTime = useRef(Date.now());
  const sessionId = useRef(Date.now().toString());
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const qs = generateQuestionsForTest(testType, QUESTIONS_PER_TEST);
    setQuestions(qs);
    setIsLoading(false);
  }, [testType]);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      questionStartTime.current = Date.now();
      setTimerKey((k) => k + 1);
      slideIn();
    }
  }, [currentIndex, isLoading]);

  const slideIn = () => {
    slideAnim.setValue(50);
    Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }).start();
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? currentIndex / questions.length : 0;

  const handleSelectOption = useCallback((index: number) => {
    if (showFeedback || selectedOption !== undefined) return;
    setSelectedOption(index);

    const timeTaken = Date.now() - questionStartTime.current;
    const isCorrect = index === currentQuestion.correctIndex;

    if (mode === 'assessment') {
      Haptics.impactAsync(isCorrect ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    }

    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedIndex: index,
      isCorrect,
      timeTaken,
    };

    setAnswers((prev) => [...prev, answer]);
    setAdaptiveState((prev) => updateAdaptiveState(prev, answer));

    if (mode === 'practice') {
      setShowFeedback(true);
      Animated.timing(feedbackAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      // Assessment: brief pause then advance
      setTimeout(() => advanceQuestion(answer), 600);
    }
  }, [showFeedback, selectedOption, currentQuestion, mode]);

  const advanceQuestion = useCallback((lastAnswer?: Answer) => {
    const allAnswers = lastAnswer
      ? [...answers, lastAnswer]
      : answers;

    if (currentIndex + 1 >= questions.length) {
      finishTest(allAnswers);
    } else {
      setSelectedOption(undefined);
      setShowFeedback(false);
      feedbackAnim.setValue(0);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length, answers]);

  const finishTest = async (allAnswers: Answer[]) => {
    const session: TestSession = {
      id: sessionId.current,
      type: testType,
      mode,
      startedAt: Number(sessionId.current),
      completedAt: Date.now(),
      questions,
      answers: allAnswers,
      difficulty: 'medium',
    };

    // Bot check
    const botSignal = detectBot(allAnswers);
    if (isBotLikely(botSignal)) {
      Alert.alert(
        'Unusual Activity Detected',
        'Your response pattern was unusual. Results may not be accurate.',
        [{ text: 'Continue', style: 'default' }]
      );
    }

    if (mode === 'assessment') {
      const result = processTestSession(session);
      await saveResult(result);
      navigation.replace('Results', { session: JSON.stringify(session), result: JSON.stringify(result) });
    } else {
      // Practice mode — just show summary
      navigation.replace('Results', { session: JSON.stringify(session), isPractice: 'true' });
    }
  };

  const handleTimeExpire = useCallback(() => {
    if (selectedOption === undefined) {
      const answer: Answer = {
        questionId: currentQuestion.id,
        selectedIndex: -1,
        isCorrect: false,
        timeTaken: currentQuestion.timeLimit * 1000,
      };
      setAnswers((prev) => [...prev, answer]);
      setAdaptiveState((prev) => updateAdaptiveState(prev, answer));
      setTimeout(() => advanceQuestion(answer), 400);
    }
  }, [selectedOption, currentQuestion, advanceQuestion]);

  const handleQuit = () => {
    Alert.alert('Quit Test?', 'Your progress will be lost.', [
      { text: 'Continue', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  if (isLoading || !currentQuestion) {
    return (
      <View style={[styles.screen, styles.center]}>
        <LinearGradient colors={[COLORS.bgGradientStart, COLORS.bgGradientMid]} style={StyleSheet.absoluteFill} />
        <Text style={styles.loadingText}>Preparing your test...</Text>
      </View>
    );
  }

  const isMatrix = currentQuestion.type === 'spatial' && currentQuestion.svgData;
  const optionColors = ['#667eea', '#f093fb', '#43e97b', '#fa709a'];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitBtn}>
          <Text style={styles.quitText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.questionCount}>
            {currentIndex + 1} / {questions.length}
          </Text>
          {mode === 'practice' && (
            <View style={styles.practiceBadge}>
              <Text style={styles.practiceBadgeText}>Practice</Text>
            </View>
          )}
        </View>
        <TestTimer
          key={timerKey}
          totalSeconds={currentQuestion.timeLimit}
          onExpire={handleTimeExpire}
          paused={showFeedback}
        />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color={gradient[0]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          {/* Question Type Badge */}
          <View style={styles.typeBadge}>
            <LinearGradient colors={gradient as [string, string]} style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
            <Text style={styles.typeText}>{currentQuestion.type.toUpperCase()}</Text>
          </View>

          {/* Question Card */}
          <GlassCard style={styles.questionCard}>
            <Text style={styles.question}>{currentQuestion.prompt}</Text>
          </GlassCard>

          {/* Matrix or Options */}
          {isMatrix ? (
            <MatrixPuzzle
              data={currentQuestion.svgData!}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
              showAnswer={showFeedback}
              disabled={showFeedback || selectedOption !== undefined}
            />
          ) : (
            <View style={styles.options}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === currentQuestion.correctIndex;

                let borderColor = COLORS.glassBorder;
                let bgColor = 'rgba(255,255,255,0.05)';

                if (showFeedback) {
                  if (isCorrect) {
                    borderColor = COLORS.success;
                    bgColor = 'rgba(79,255,176,0.12)';
                  } else if (isSelected) {
                    borderColor = COLORS.error;
                    bgColor = 'rgba(255,107,138,0.12)';
                  }
                } else if (isSelected) {
                  borderColor = optionColors[index % optionColors.length];
                  bgColor = optionColors[index % optionColors.length] + '22';
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.option, { borderColor, backgroundColor: bgColor }]}
                    onPress={() => handleSelectOption(index)}
                    disabled={showFeedback || selectedOption !== undefined}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.optionLabel, { backgroundColor: optionColors[index % optionColors.length] + '33' }]}>
                      <Text style={[styles.optionLetter, { color: optionColors[index % optionColors.length] }]}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={styles.optionText}>{option}</Text>
                    {showFeedback && isCorrect && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <Text style={styles.crossmark}>✗</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Feedback Panel (practice mode) */}
          {showFeedback && mode === 'practice' && (
            <Animated.View style={{ opacity: feedbackAnim }}>
              <GlassCard style={[styles.feedbackCard, {
                borderColor: selectedOption === currentQuestion.correctIndex ? COLORS.success : COLORS.error
              }]}>
                <Text style={[styles.feedbackTitle, {
                  color: selectedOption === currentQuestion.correctIndex ? COLORS.success : COLORS.error
                }]}>
                  {selectedOption === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
                </Text>
                {currentQuestion.explanation && (
                  <Text style={styles.explanation}>{currentQuestion.explanation}</Text>
                )}
                <GlassButton
                  title={currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish'}
                  onPress={() => advanceQuestion()}
                  gradient={gradient as [string, string]}
                  style={styles.nextBtn}
                  size="md"
                />
              </GlassCard>
            </Animated.View>
          )}

          {/* Difficulty indicator */}
          <View style={styles.diffRow}>
            <Text style={styles.diffLabel}>Difficulty:</Text>
            {[1, 2, 3].map((dot) => (
              <View
                key={dot}
                style={[
                  styles.diffDot,
                  {
                    backgroundColor:
                      (currentQuestion.difficulty === 'hard' && dot <= 3) ||
                      (currentQuestion.difficulty === 'medium' && dot <= 2) ||
                      (currentQuestion.difficulty === 'easy' && dot <= 1)
                        ? gradient[0]
                        : 'rgba(255,255,255,0.15)',
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  quitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  headerCenter: {
    alignItems: 'center',
    gap: 4,
  },
  questionCount: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  practiceBadge: {
    backgroundColor: 'rgba(79,255,176,0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  practiceBadgeText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  scroll: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  typeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  questionCard: {
    marginBottom: 20,
  },
  question: {
    color: COLORS.white,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
  },
  options: {
    gap: 10,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  optionLabel: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    lineHeight: 22,
  },
  checkmark: {
    color: COLORS.success,
    fontSize: 18,
    fontWeight: '700',
  },
  crossmark: {
    color: COLORS.error,
    fontSize: 18,
    fontWeight: '700',
  },
  feedbackCard: {
    marginTop: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  explanation: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  nextBtn: {
    width: '100%',
    marginTop: 4,
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  diffLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  diffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
