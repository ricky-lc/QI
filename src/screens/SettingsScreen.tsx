import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { getUserProfile, clearAllData, getRecentResults } from '../utils/storage';
import { TestResult } from '../types';

const APP_VERSION = '1.0.0';

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState('');
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const [profile, results] = await Promise.all([getUserProfile(), getRecentResults(100)]);
    setUserId(profile.id);
    setResultCount(results.length);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear All Data?',
      `This will permanently delete all ${resultCount} test result(s) and history. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            setResultCount(0);
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientMid, COLORS.bgGradientEnd]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: COLORS.bgPrimary }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>⚙️ Settings</Text>
        </View>

        {/* Profile */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Profile</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device ID</Text>
            <Text style={styles.infoValue}>{userId.slice(0, 12)}...</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tests Saved</Text>
            <Text style={styles.infoValue}>{resultCount}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Storage</Text>
            <Text style={styles.infoValue}>Local only — no cloud</Text>
          </View>
        </GlassCard>

        {/* About */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>QI — Intelligence Measurement</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IQ Scale</Text>
            <Text style={styles.infoValue}>Mean 100, SD 15 (standard)</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Credits')} style={styles.linkRow}>
            <Text style={styles.linkText}>View Full Credits & Info →</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* How IQ is Calculated */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>📐 Score Calculation</Text>
          {[
            'Adaptive difficulty: questions get harder as you succeed',
            'Accuracy: correct answers form the base score',
            'Speed: time per question adjusts score by ±10%',
            'Difficulty bonus: harder questions yield higher scores',
            'Final score clamped between 40 and 160',
          ].map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Privacy */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Privacy</Text>
          <Text style={styles.bodyText}>
            QI stores all data exclusively on your device using AsyncStorage.
            No personal information is collected, no analytics are sent, and
            no internet connection is required to use the app.
          </Text>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, { color: COLORS.error }]}>🗑️ Data Management</Text>
          <Text style={styles.bodyText}>
            {resultCount > 0
              ? `You have ${resultCount} saved test result(s).`
              : 'No saved test results.'}
          </Text>
          {resultCount > 0 && (
            <GlassButton
              title="Clear All Data"
              onPress={handleClear}
              variant="danger"
              size="md"
              style={{ marginTop: 4 }}
            />
          )}
        </GlassCard>
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
    paddingBottom: 48,
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
  },
  section: {
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  linkRow: {
    paddingTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.pastelBlue,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    color: COLORS.pastelPurple,
    fontSize: 16,
    marginTop: 1,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: 'rgba(255,107,138,0.25)',
  },
});
