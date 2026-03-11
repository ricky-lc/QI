import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { COLORS, CATEGORY_GRADIENTS } from '../constants/colors';
import { TEST_CONFIGS, FULL_TEST_CONFIG } from '../constants/tests';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ResultsChart } from '../components/ResultsChart';
import { getRecentResults } from '../utils/storage';
import { TestResult } from '../types';
import { getIQLabel } from '../utils/scoreCalculator';

const { width } = Dimensions.get('window');

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [recentResults, setRecentResults] = useState<TestResult[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    loadResults();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadResults = async () => {
    const results = await getRecentResults(5);
    setRecentResults(results);
  };

  const latestResult = recentResults[0];
  const latestLabel = latestResult ? getIQLabel(latestResult.iqScore) : null;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>⚡ QI</Text>
            <Text style={styles.tagline}>Measure Your Intelligence</Text>
          </View>

          {/* Latest Score Card */}
          {latestResult && latestLabel ? (
            <GlassCard style={styles.scoreCard}>
              <Text style={styles.sectionTitle}>Your Latest Score</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.iqScore}>{latestResult.iqScore}</Text>
                <View style={styles.scoreDetails}>
                  <Text style={styles.iqEmoji}>{latestLabel.emoji}</Text>
                  <Text style={styles.iqLabel}>{latestLabel.label}</Text>
                  <Text style={styles.percentile}>Top {100 - latestResult.percentile}%</Text>
                </View>
              </View>
              {recentResults.length > 1 && (
                <View style={{ marginTop: 12 }}>
                  <ResultsChart results={recentResults} />
                </View>
              )}
            </GlassCard>
          ) : (
            <GlassCard style={styles.scoreCard}>
              <Text style={styles.noScoreTitle}>Ready to discover your IQ?</Text>
              <Text style={styles.noScoreText}>
                Take any test below to get started. Results are saved locally — no account needed.
              </Text>
            </GlassCard>
          )}

          {/* Quick Start */}
          <Text style={styles.sectionLabel}>Quick Assessment</Text>
          <GlassButton
            title={`${FULL_TEST_CONFIG.icon} Full IQ Test (~${FULL_TEST_CONFIG.duration} min)`}
            onPress={() => navigation.navigate('TestSelection', { type: 'full' })}
            gradient={['#667eea', '#764ba2']}
            style={styles.fullTestBtn}
            size="lg"
          />

          {/* Test Categories */}
          <Text style={styles.sectionLabel}>Test by Category</Text>
          <View style={styles.grid}>
            {TEST_CONFIGS.map((config) => {
              const gradient = CATEGORY_GRADIENTS[config.id] || ['#667eea', '#764ba2'];
              return (
                <TouchableOpacity
                  key={config.id}
                  style={styles.testCard}
                  onPress={() => navigation.navigate('TestSelection', { type: config.id })}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[gradient[0] + '33', gradient[1] + '22']}
                    style={[StyleSheet.absoluteFill, { borderRadius: 18 }]}
                  />
                  <View style={styles.cardBorder} />
                  <Text style={styles.cardIcon}>{config.icon}</Text>
                  <Text style={styles.cardTitle}>{config.title}</Text>
                  <Text style={styles.cardDuration}>{config.duration} min • {config.questionCount} Q</Text>
                  <View style={[styles.cardDot, { backgroundColor: config.color }]} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Links */}
          <View style={styles.bottomLinks}>
            <GlassButton
              title="📊 History"
              onPress={() => navigation.navigate('Profile')}
              variant="ghost"
              size="sm"
              style={{ flex: 1 }}
            />
            <GlassButton
              title="🏋️ Practice"
              onPress={() => navigation.navigate('Training')}
              variant="ghost"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = (width - 48 - 12) / 2;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  scroll: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#667eea',
    top: -80,
    left: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#f093fb',
    top: 200,
    right: -60,
  },
  orb3: {
    width: 250,
    height: 250,
    backgroundColor: '#43e97b',
    bottom: 100,
    left: -60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  scoreCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iqScore: {
    fontSize: 72,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -2,
  },
  scoreDetails: {
    gap: 4,
  },
  iqEmoji: {
    fontSize: 28,
  },
  iqLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.pastelPurple,
  },
  percentile: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  noScoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  noScoreText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  fullTestBtn: {
    marginBottom: 20,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  testCard: {
    width: CARD_WIDTH,
    height: 130,
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    justifyContent: 'flex-end',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  cardIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  cardDuration: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  cardDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomLinks: {
    flexDirection: 'row',
    gap: 12,
  },
});
