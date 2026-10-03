import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

interface TestTimerProps {
  totalSeconds: number;
  onExpire?: () => void;
  paused?: boolean;
}

export function TestTimer({ totalSeconds, onExpire, paused }: TestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, totalSeconds, onExpire]);

  useEffect(() => {
    if (secondsLeft <= 5 && secondsLeft > 0) {
      pulseAnim.value = withRepeat(withTiming(1.3, { duration: 400 }), -1, true);
    } else {
      pulseAnim.value = 1;
    }
  }, [secondsLeft, pulseAnim]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const progress = secondsLeft / totalSeconds;
  const isWarning = progress < 0.3;
  const isCritical = progress < 0.15;

  const color = isCritical ? COLORS.error : isWarning ? COLORS.warning : COLORS.success;

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <View style={[styles.ring, { borderColor: color + '55' }]}>
        <View style={[styles.innerRing, { borderColor: color }]}>
          <Text style={[styles.time, { color }]}>
            {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
            {String(secondsLeft % 60).padStart(2, '0')}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
