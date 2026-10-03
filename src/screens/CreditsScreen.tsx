import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { GlassCard } from '../components/GlassCard';

const APP_VERSION = '1.0.0';

export function CreditsScreen() {
  const navigation = useNavigation<any>();

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
          <Text style={styles.title}>ℹ️ About QI</Text>
        </View>

        {/* App Identity */}
        <GlassCard style={styles.appCard}>
          <Text style={styles.appLogo}>⚡ QI</Text>
          <Text style={styles.appSubtitle}>Intelligence Measurement</Text>
          <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
        </GlassCard>

        {/* Mission */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Our Mission</Text>
          <Text style={styles.sectionText}>
            QI is a free, privacy-first IQ testing app. All your results stay on
            your device — no accounts, no tracking, no servers. We believe
            measuring intelligence should be accessible to everyone.
          </Text>
        </GlassCard>

        {/* How It Works */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 How It Works</Text>
          {[
            { icon: '🎯', text: 'Adaptive difficulty adjusts questions to your level in real time' },
            { icon: '📐', text: 'IQ score normalized to mean 100, standard deviation 15' },
            { icon: '🛡️', text: 'Bot-detection prevents gaming the system' },
            { icon: '💾', text: 'Results stored locally with AsyncStorage — no cloud uploads' },
            { icon: '🔷', text: 'Spatial questions use procedurally generated 3×3 matrix puzzles' },
          ].map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listIcon}>{item.icon}</Text>
              <Text style={styles.listText}>{item.text}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Test Categories */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Test Categories</Text>
          {[
            { icon: '🧩', label: 'Logical Reasoning', desc: 'Syllogisms, deductions, logic puzzles' },
            { icon: '🔷', label: 'Spatial Intelligence', desc: 'Matrix puzzles, visual reasoning' },
            { icon: '🧠', label: 'Working Memory', desc: 'Recall, sequencing, attention' },
            { icon: '🔮', label: 'Pattern Recognition', desc: 'Sequences, rules, abstract thinking' },
            { icon: '📚', label: 'Verbal Intelligence', desc: 'Analogies, vocabulary, comprehension' },
            { icon: '🔢', label: 'Numerical Reasoning', desc: 'Series, arithmetic, word problems' },
          ].map((item, i) => (
            <View key={i} style={styles.categoryItem}>
              <Text style={styles.listIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryLabel}>{item.label}</Text>
                <Text style={styles.categoryDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Tech Stack */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Built With</Text>
          {[
            'React Native + Expo',
            'TypeScript',
            'React Navigation',
            'Expo Linear Gradient & Blur',
            'React Native SVG',
            'React Native Reanimated',
            'AsyncStorage (local only)',
          ].map((tech, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.listText}>{tech}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Disclaimer */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Disclaimer</Text>
          <Text style={styles.sectionText}>
            QI provides an estimate of cognitive abilities for entertainment and
            self-improvement purposes only. Scores should not be used for clinical
            diagnosis or major life decisions. Certified psychometric evaluations
            require a licensed professional.
          </Text>
        </GlassCard>

        <Text style={styles.footer}>Made with ❤️ — QI {APP_VERSION}</Text>
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
  appCard: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 16,
    gap: 6,
  },
  appLogo: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
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
  sectionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  listIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  bulletDot: {
    color: COLORS.pastelBlue,
    fontSize: 16,
    marginTop: 1,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  categoryDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
