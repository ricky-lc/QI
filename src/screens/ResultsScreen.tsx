import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { COLORS, CATEGORY_GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ProgressBar } from '../components/ProgressBar';
import { getIQLabel } from '../utils/scoreCalculator';
import { TestSession, TestResult, Answer } from '../types';

type RouteParams = {
  session: string;
  result?: string;
  isPractice?: string;
};

export function ResultsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const { session: sessionStr, result: resultStr, isPractice } = route.params || {};

  const session: TestSession = JSON.parse(sessionStr || '{}');
  const result: TestResult | null = resultStr ? JSON.parse(resultStr) : null;
  const isPracticeMode = isPractice === 'true';

  const viewShotRef = useRef<any>(null);
  const [isSharing, setIsSharing] = useState(false);

  const correctAnswers = session.answers?.filter((a) => a.isCorrect).length || 0;
  const totalQuestions = session.questions?.length || 0;
  const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  const avgTime = session.answers?.length
    ? Math.round(session.answers.reduce((s, a) => s + a.timeTaken, 0) / session.answers.length / 1000)
    : 0;

  const iqLabel = result ? getIQLabel(result.iqScore) : null;
  const gradient = CATEGORY_GRADIENTS[session.type] || ['#667eea', '#764ba2'];

  const handleShare = async () => {
    if (!viewShotRef.current) return;
    setIsSharing(true);
    try {
      const uri: string = await viewShotRef.current.capture();
      if (Platform.OS === 'web') {
        // On web, download the image
        const link = document.createElement('a');
        link.href = uri;
        link.download = 'qi-result.png';
        link.click();
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your QI result' });
        } else {
          await Share.share({ url: uri, message: `My IQ Score: ${result?.iqScore || 'Practice'} — QI App` });
        }
      }
    } catch (e) {
      console.warn('Share failed:', e);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRetake = () => {
    navigation.replace('Test', { type: session.type, mode: isPracticeMode ? 'practice' : 'assessment' });
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} style={{ backgroundColor: COLORS.bgPrimary }}>
        {/* Shareable card */}
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
          <View style={styles.shareableArea}>
            <LinearGradient
              colors={[COLORS.bgGradientStart, COLORS.bgGradientMid]}
              style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
            />

            {/* App branding */}
            <View style={styles.branding}>
              <Text style={styles.brandLogo}>⚡ QI</Text>
              <Text style={styles.brandTagline}>Intelligence Measurement</Text>
            </View>

            {/* Main score */}
            {!isPracticeMode && result && iqLabel ? (
              <View style={styles.scoreSection}>
                <Text style={styles.iqEmoji}>{iqLabel.emoji}</Text>
                <Text style={styles.iqNumber}>{result.iqScore}</Text>
                <Text style={styles.iqLabel}>{iqLabel.label}</Text>
                <View style={styles.percentileRow}>
                  <LinearGradient colors={gradient as [string, string]} style={styles.percentileBadge}>
                    <Text style={styles.percentileText}>Top {100 - result.percentile}%</Text>
                  </LinearGradient>
                </View>
              </View>
            ) : (
              <View style={styles.practiceSection}>
                <Text style={styles.practiceEmoji}>🏋️</Text>
                <Text style={styles.practiceTitle}>Practice Complete</Text>
              </View>
            )}

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{correctAnswers}/{totalQuestions}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{Math.round(accuracy * 100)}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{avgTime}s</Text>
                <Text style={styles.statLabel}>Avg. Time</Text>
              </View>
            </View>

            {/* Accuracy bar */}
            <View style={styles.accuracyBar}>
              <Text style={styles.accuracyLabel}>Performance</Text>
              <ProgressBar progress={accuracy} color={gradient[0]} height={8} />
            </View>

            {/* Test type */}
            <View style={styles.testTypeBadge}>
              <LinearGradient colors={[gradient[0] + '33', gradient[1] + '22']} style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
              <Text style={styles.testTypeText}>{session.type?.toUpperCase()} TEST</Text>
            </View>
          </View>
        </ViewShot>

        {/* Answer review */}
        <Text style={styles.sectionLabel}>Answer Review</Text>
        <GlassCard style={styles.reviewCard} noPad>
          {session.questions?.slice(0, 8).map((q, i) => {
            const answer = session.answers?.[i];
            if (!answer) return null;
            return (
              <View key={q.id} style={[styles.reviewItem, i > 0 && styles.reviewItemBorder]}>
                <Text style={[styles.reviewNum, { color: answer.isCorrect ? COLORS.success : COLORS.error }]}>
                  {answer.isCorrect ? '✓' : '✗'}
                </Text>
                <Text style={styles.reviewQuestion} numberOfLines={2}>{q.prompt}</Text>
                <Text style={styles.reviewTime}>{Math.round(answer.timeTaken / 1000)}s</Text>
              </View>
            );
          })}
        </GlassCard>

        {/* Actions */}
        <GlassButton
          title={isSharing ? '' : '📤 Share Result'}
          onPress={handleShare}
          gradient={gradient as [string, string]}
          style={styles.actionBtn}
          size="lg"
          loading={isSharing}
        />
        <GlassButton
          title="🔄 Retake Test"
          onPress={handleRetake}
          variant="ghost"
          size="md"
          style={styles.actionBtn}
        />
        <GlassButton
          title="🏠 Back to Home"
          onPress={handleHome}
          variant="ghost"
          size="md"
          style={styles.actionBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scroll: {
    padding: 20,
    paddingTop: 52,
    paddingBottom: 40,
  },
  shareableArea: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.bgPrimary,
    gap: 16,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  brandLogo: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  brandTagline: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  scoreSection: {
    alignItems: 'center',
    gap: 4,
  },
  iqEmoji: {
    fontSize: 48,
  },
  iqNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -3,
    lineHeight: 90,
  },
  iqLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.pastelPurple,
  },
  percentileRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  percentileBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  percentileText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  practiceSection: {
    alignItems: 'center',
    gap: 8,
  },
  practiceEmoji: {
    fontSize: 48,
  },
  practiceTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.glassBorder,
  },
  accuracyBar: {
    gap: 8,
  },
  accuracyLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  testTypeBadge: {
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  testTypeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  reviewCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  reviewItemBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  reviewNum: {
    fontSize: 18,
    fontWeight: '700',
    width: 22,
    textAlign: 'center',
  },
  reviewQuestion: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  reviewTime: {
    color: COLORS.textMuted,
    fontSize: 12,
    width: 28,
    textAlign: 'right',
  },
  actionBtn: {
    width: '100%',
    marginBottom: 12,
  },
});
