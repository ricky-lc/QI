import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  noPad?: boolean;
}

export function GlassCard({ children, style, intensity = 20, noPad = false }: GlassCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.border, StyleSheet.absoluteFill]} />
      <View style={noPad ? styles.contentNoPad : styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.glass,
  },
  border: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  content: {
    padding: 16,
  },
  contentNoPad: {
    padding: 0,
  },
});
