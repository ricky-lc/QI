import React, { useState } from 'react';
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
import { TEST_CONFIGS } from '../constants/tests';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { TestType } from '../types';

type RouteParams = { type?: string };

const DRILLS = [
  {
    id: 'speed',
    title: 'Speed Drill',
    description: 'Answer 5 questions as fast as possible. No time limits.',
    icon: '⚡',
    count: 5,
    difficulty: 'easy' as const,
  },
  {
    id: 'accuracy',
    title: 'Accuracy Challenge',
    description: 'Take your time. Focus on getting every answer correct.',
    icon: '🎯',
    count: 8,
    difficulty: 'medium' as const,
  },
  {
    id: 'endurance',
    title: 'Endurance Mode',
    description: 'Extended practice session with increasing difficulty.',
    icon: '🏆',
    count: 15,
    difficulty: 'hard' as const,
  },
];

export function TrainingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const typeParam = route.params?.type;

  const [selectedType, setSelectedType] = useState<TestType | null>(
    (typeParam as TestType) || null
  );

  const gradient = selectedType
    ? CATEGORY_GRADIENTS[selectedType] || ['#667eea', '#764ba2']
    : ['#667eea', '#764ba2'];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} style={{ backgroundColor: COLORS.bgPrimary }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏋️ Practice Mode</Text>
          <Text style={styles.subtitle}>
            Improve your skills without pressure. Full explanations after each answer.
          </Text>
        </View>

        {/* Category Selector */}
        {!typeParam && (
          <>
            <Text style={styles.sectionLabel}>Choose Category</Text>
            <View style={styles.categoryGrid}>
              {TEST_CONFIGS.map((config) => {
                const grad = CATEGORY_GRADIENTS[config.id] || ['#667eea', '#764ba2'];
                const isSelected = selectedType === config.id;
                return (
                  <TouchableOpacity
                    key={config.id}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    onPress={() => setSelectedType(config.id as TestType)}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={[grad[0] + '44', grad[1] + '33']}
                        style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                      />
                    )}
                    <Text style={styles.categoryIcon}>{config.icon}</Text>
                    <Text style={styles.categoryName}>{config.title}</Text>
                    {isSelected && (
                      <View style={[styles.selectedDot, { backgroundColor: grad[0] }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Selected category info */}
        {selectedType && (
          <>
            <GlassCard style={styles.selectedCard}>
              <Text style={styles.selectedIcon}>
                {TEST_CONFIGS.find((c) => c.id === selectedType)?.icon}
              </Text>
              <Text style={styles.selectedTitle}>
                {TEST_CONFIGS.find((c) => c.id === selectedType)?.title}
              </Text>
              {typeParam && (
                <TouchableOpacity onPress={() => navigation.navigate('Training')}>
                  <Text style={styles.changeBtn}>Change →</Text>
                </TouchableOpacity>
              )}
            </GlassCard>

            {/* Practice drills */}
            <Text style={styles.sectionLabel}>Practice Drills</Text>
            <View style={styles.drills}>
              {DRILLS.map((drill) => (
                <TouchableOpacity
                  key={drill.id}
                  style={styles.drillCard}
                  onPress={() =>
                    navigation.navigate('Test', {
                      type: selectedType,
                      mode: 'practice',
                    })
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[gradient[0] + '22', gradient[1] + '11']}
                    style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
                  />
                  <View style={styles.drillHeader}>
                    <Text style={styles.drillIcon}>{drill.icon}</Text>
                    <View>
                      <Text style={styles.drillTitle}>{drill.title}</Text>
                      <Text style={styles.drillCount}>{drill.count} questions</Text>
                    </View>
                  </View>
                  <Text style={styles.drillDesc}>{drill.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tips */}
            <GlassCard style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Practice Tips</Text>
              {[
                'Read explanations carefully after wrong answers',
                'Focus on patterns, not memorization',
                'Practice consistently — even 5 min/day helps',
                'Challenge yourself with harder difficulties',
              ].map((tip, i) => (
                <View key={i} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        {!selectedType && (
          <View style={styles.noSelection}>
            <Text style={styles.noSelectionText}>Select a category above to start practicing</Text>
          </View>
        )}
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
  header: {
    marginBottom: 24,
  },
  back: {
    marginBottom: 16,
  },
  backText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
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
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: '30%',
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  categoryCardSelected: {
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  selectedIcon: {
    fontSize: 32,
  },
  selectedTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  changeBtn: {
    color: COLORS.pastelBlue,
    fontSize: 14,
  },
  drills: {
    gap: 12,
    marginBottom: 20,
  },
  drillCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
    gap: 8,
  },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drillIcon: {
    fontSize: 28,
  },
  drillTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  drillCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  drillDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  tipsCard: {
    gap: 10,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: COLORS.pastelBlue,
    fontSize: 16,
    lineHeight: 20,
  },
  tipText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  noSelection: {
    marginTop: 20,
    alignItems: 'center',
  },
  noSelectionText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
