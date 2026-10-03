import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS, CATEGORY_GRADIENTS } from '../constants/colors';
import { TEST_CONFIGS, FULL_TEST_CONFIG, QUICK_TEST_CONFIG } from '../constants/tests';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { TestType } from '../types';

type RouteParams = { type: string };

export function TestSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const typeParam = route.params?.type || 'full';

  const config = typeParam === 'full'
    ? FULL_TEST_CONFIG
    : typeParam === 'quick'
    ? QUICK_TEST_CONFIG
    : TEST_CONFIGS.find((c) => c.id === typeParam);

  const gradient = CATEGORY_GRADIENTS[typeParam as TestType] || (typeParam === 'quick' ? ['#43e97b', '#38f9d7'] as [string, string] : ['#667eea', '#764ba2'] as [string, string]);

  if (!config) return null;

  const isFull = typeParam === 'full' || typeParam === 'quick';

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.orb, { backgroundColor: gradient[0] }]} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} style={{ backgroundColor: COLORS.bgPrimary }}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>{config.icon}</Text>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.description}</Text>
        </View>

        {/* Stats */}
        <GlassCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{config.questionCount}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{config.duration}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>IQ</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
          </View>
        </GlassCard>

        {/* Skills */}
        {!isFull && 'skills' in config && (
          <GlassCard style={styles.skillsCard}>
            <Text style={styles.cardTitle}>Skills Tested</Text>
            <View style={styles.skills}>
              {(config as any).skills.map((skill: string) => (
                <View key={skill} style={[styles.skillBadge, { borderColor: gradient[0] + '55' }]}>
                  <Text style={[styles.skillText, { color: gradient[0] }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Instructions */}
        <GlassCard style={styles.instrCard}>
          <Text style={styles.cardTitle}>Instructions</Text>
          <View style={styles.instrList}>
            {[
              'Read each question carefully before answering',
              'Questions adapt to your performance level',
              'Each question has a time limit — stay focused',
              'You cannot go back to previous questions',
              'Your results are saved locally on this device',
            ].map((instr, i) => (
              <View key={i} style={styles.instrItem}>
                <Text style={styles.instrNum}>{i + 1}</Text>
                <Text style={styles.instrText}>{instr}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Start Buttons */}
        <GlassButton
          title="🚀 Start Assessment"
          onPress={() =>
            navigation.navigate('Test', { type: typeParam, mode: 'assessment' })
          }
          gradient={gradient as [string, string]}
          size="lg"
          style={styles.startBtn}
        />
        <GlassButton
          title="🏋️ Practice Mode"
          onPress={() =>
            navigation.navigate('Training', { type: typeParam })
          }
          variant="ghost"
          size="md"
          style={styles.practiceBtn}
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  orb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.12,
    top: -40,
    right: -40,
  },
  back: {
    marginBottom: 20,
  },
  backText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.glassBorder,
  },
  skillsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  skillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  instrCard: {
    marginBottom: 24,
  },
  instrList: {
    gap: 12,
  },
  instrItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instrNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.1)',
    textAlign: 'center',
    lineHeight: 22,
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  instrText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  startBtn: {
    width: '100%',
    marginBottom: 12,
  },
  practiceBtn: {
    width: '100%',
  },
});
