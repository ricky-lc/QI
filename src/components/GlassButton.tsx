import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/colors';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: [string, string];
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function GlassButton({
  title,
  onPress,
  style,
  textStyle,
  gradient,
  disabled,
  loading,
  variant = 'primary',
  size = 'md',
}: GlassButtonProps) {
  const sizeStyle = SIZE_STYLES[size];

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        style={[styles.ghostButton, sizeStyle.button, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
        <Text style={[styles.ghostText, sizeStyle.text, textStyle]}>
          {loading ? '' : title}
        </Text>
        {loading && <ActivityIndicator color={COLORS.textPrimary} />}
      </TouchableOpacity>
    );
  }

  const colors: [string, string] = gradient || (variant === 'danger' ? ['#FF6B8A', '#FF4466'] : ['#667eea', '#764ba2']);

  return (
    <TouchableOpacity
      style={[styles.button, sizeStyle.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient colors={colors} style={[StyleSheet.absoluteFill, { borderRadius: 16 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={[styles.text, sizeStyle.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const SIZE_STYLES = {
  sm: {
    button: { height: 38, borderRadius: 12, paddingHorizontal: 14 },
    text: { fontSize: 14 },
  },
  md: {
    button: { height: 52, borderRadius: 16, paddingHorizontal: 24 },
    text: { fontSize: 16 },
  },
  lg: {
    button: { height: 60, borderRadius: 18, paddingHorizontal: 32 },
    text: { fontSize: 18 },
  },
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ghostButton: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
  },
  text: {
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ghostText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.4,
  },
});
