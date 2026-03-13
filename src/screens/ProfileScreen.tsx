import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { COLORS, CATEGORY_GRADIENTS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ResultsChart } from '../components/ResultsChart';
import { getRecentResults, getUserProfile, clearAllData } from '../utils/storage';
import { getIQLabel } from '../utils/scoreCalculator';
import { TestResult } from '../types';
import { TEST_CONFIGS } from '../constants/tests';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [results, setResults] = useState<TestResult[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [r, profile] = await Promise.all([getRecentResults(20), getUserProfile()]);
    setResults(r);
    setUserId(profile.id);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear All Data?',
      'This will permanently delete all your test results and history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            setResults([]);
          },
        },
      ]
    );
  };

  // Stats summary
  const avgIQ = results.length
    ? Math.round(results.reduce((s, r) => s + r.iqScore, 0) / results.length)
    : null;
  const bestIQ = results.length ? Math.max(...results.map((r) => r.iqScore)) : null;
  const bestLabel = bestIQ ? getIQLabel(bestIQ) : null;
  const totalTests = results.length;

  // By type breakdown
  const typeStats: Record<string, { count: number; avg: number }> = {};
  results.forEach((r) => {
    if (!typeStats[r.type]) typeStats[r.type] = { count: 0, avg: 0 };
    typeStats[r.type].count++;
    typeStats[r.type].avg = Math.round(
      (typeStats[r.type].avg * (typeStats[r.type].count - 1) + r.iqScore) / typeStats[r.type].count
    );
  });

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
          <Text style={styles.title}>📊 Your History</Text>
          <Text style={styles.userId}>ID: {userId.slice(0, 8)}...</Text>
        </View>

        {/* Summary */}
        <GlassCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalTests}</Text>
              <Text style={styles.summaryLabel}>Tests Taken</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{avgIQ || '—'}</Text>
              <Text style={styles.summaryLabel}>Avg IQ</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{bestIQ || '—'}</Text>
              <Text style={styles.summaryLabel}>Best IQ</Text>
            </View>
          </View>
          {bestLabel && (
            <View style={styles.bestRow}>
              <Text style={styles.bestEmoji}>{bestLabel.emoji}</Text>
              <Text style={styles.bestLabel}>Personal Best: {bestLabel.label}</Text>
            </View>
          )}
        </GlassCard>

        {/* Chart */}
        {results.length > 0 && (
          <GlassCard style={styles.chartCard}>
            <Text style={styles.sectionLabel}>Score History</Text>
            <ResultsChart results={results.slice(0, 7)} />
          </GlassCard>
        )}

        {/* By type */}
        {Object.keys(typeStats).length > 0 && (
          <>
            <Text style={styles.sectionLabel}>By Category</Text>
            <View style={styles.typeGrid}>
              {Object.entries(typeStats).map(([type, stats]) => {
                const config = TEST_CONFIGS.find((c) => c.id === type);
                const grad = CATEGORY_GRADIENTS[type] || ['#667eea', '#764ba2'];
                return (
                  <View key={type} style={styles.typeCard}>
                    <LinearGradient colors={[grad[0] + '33', grad[1] + '22']} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
                    <Text style={styles.typeIcon}>{config?.icon || '🧪'}</Text>
                    <Text style={styles.typeIQ}>{stats.avg}</Text>
                    <Text style={styles.typeCount}>{stats.count} tests</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Recent results list */}
        {results.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Recent Tests</Text>
            <GlassCard style={styles.listCard} noPad>
              {results.slice(0, 10).map((r, i) => {
                const config = TEST_CONFIGS.find((c) => c.id === r.type);
                const label = getIQLabel(r.iqScore);
                const date = new Date(r.completedAt).toLocaleDateString();
                return (
                  <View key={r.id} style={[styles.resultItem, i > 0 && styles.resultBorder]}>
                    <Text style={styles.resultIcon}>{config?.icon || '🧪'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultType}>{config?.title || r.type}</Text>
                      <Text style={styles.resultDate}>{date} · {r.correctAnswers}/{r.totalQuestions} correct</Text>
                    </View>
                    <View style={styles.resultScore}>
                      <Text style={styles.resultIQ}>{r.iqScore}</Text>
                      <Text style={styles.resultLabel}>{label.emoji}</Text>
                    </View>
                  </View>
                );
              })}
            </GlassCard>
          </>
        )}

        {results.length === 0 && (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No results yet</Text>
            <Text style={styles.emptyText}>Take a test to see your history here.</Text>
            <GlassButton
              title="Start a Test"
              onPress={() => navigation.navigate('Home')}
              gradient={['#667eea', '#764ba2']}
              style={{ marginTop: 12 }}
              size="md"
            />
          </GlassCard>
        )}

        {results.length > 0 && (
          <GlassButton
            title="🗑 Clear All Data"
            onPress={handleClear}
            variant="danger"
            size="sm"
            style={styles.clearBtn}
          />
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
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.glassBorder,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.glassBorder,
  },
  bestEmoji: {
    fontSize: 20,
  },
  bestLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    marginBottom: 20,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  typeCard: {
    width: '30%',
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  typeIcon: {
    fontSize: 24,
  },
  typeIQ: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  typeCount: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  listCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  resultBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  resultIcon: {
    fontSize: 24,
  },
  resultType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  resultDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  resultScore: {
    alignItems: 'center',
    gap: 2,
  },
  resultIQ: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  resultLabel: {
    fontSize: 14,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  clearBtn: {
    alignSelf: 'center',
    width: 180,
    marginTop: 8,
  },
});
