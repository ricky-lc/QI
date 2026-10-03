import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, CATEGORY_GRADIENTS } from '../constants/colors';
import { TestResult } from '../types';

const { width } = Dimensions.get('window');

interface ResultsChartProps {
  results: TestResult[];
}

export function ResultsChart({ results }: ResultsChartProps) {
  if (results.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No results yet</Text>
      </View>
    );
  }

  const maxIQ = Math.max(...results.map((r) => r.iqScore), 160);
  const minIQ = Math.min(...results.map((r) => r.iqScore), 70);
  const range = maxIQ - minIQ || 1;

  return (
    <View style={styles.container}>
      {/* Bar chart */}
      <View style={styles.chart}>
        {results.slice(0, 7).map((result, index) => {
          const heightPercent = ((result.iqScore - minIQ) / range) * 0.7 + 0.1;
          const colors = CATEGORY_GRADIENTS[result.type] || ['#667eea', '#764ba2'];
          return (
            <View key={result.id} style={styles.barWrapper}>
              <Text style={styles.barValue}>{result.iqScore}</Text>
              <View style={[styles.barTrack]}>
                <LinearGradient
                  colors={colors}
                  style={[styles.bar, { height: `${heightPercent * 100}%` }]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                />
              </View>
              <Text style={styles.barLabel}>{result.type.substring(0, 3).toUpperCase()}</Text>
            </View>
          );
        })}
      </View>

      {/* Average line */}
      <View style={styles.avgRow}>
        <View style={styles.avgLine} />
        <Text style={styles.avgLabel}>
          Avg: {Math.round(results.reduce((s, r) => s + r.iqScore, 0) / results.length)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
    paddingHorizontal: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: '85%',
    justifyContent: 'flex-end',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  barValue: {
    color: COLORS.textSecondary,
    fontSize: 9,
    marginBottom: 2,
    fontWeight: '600',
  },
  barLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 4,
  },
  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  avgLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  avgLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  empty: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
