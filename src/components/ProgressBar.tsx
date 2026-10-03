import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ progress, color = COLORS.pastelBlue, height = 6, animated = true }: ProgressBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.spring(widthAnim, {
        toValue: Math.max(0, Math.min(1, progress)),
        useNativeDriver: false,
        friction: 6,
      }).start();
    } else {
      widthAnim.setValue(Math.max(0, Math.min(1, progress)));
    }
  }, [progress, animated, widthAnim]);

  const widthPercent = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={[styles.fill, { width: widthPercent, height }]}>
        <LinearGradient
          colors={[color, color + 'AA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 100,
    overflow: 'hidden',
  },
});
