import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { MatrixData } from '../types';
import { generateMatrixSvg } from '../utils/matrixGenerator';
import { COLORS } from '../constants/colors';
import { GlassCard } from './GlassCard';

interface MatrixPuzzleProps {
  data: MatrixData;
  selectedOption?: number;
  onSelectOption: (index: number) => void;
  showAnswer?: boolean;
  disabled?: boolean;
}

export function MatrixPuzzle({ data, selectedOption, onSelectOption, showAnswer, disabled }: MatrixPuzzleProps) {
  const gridSvg = generateMatrixSvg(data);
  const OPTION_SIZE = 70;

  function getBorderColor(index: number): string {
    if (!showAnswer) {
      return selectedOption === index ? COLORS.pastelBlue : COLORS.glassBorder;
    }
    if (index === data.answerIndex) return COLORS.success;
    if (selectedOption === index) return COLORS.error;
    return COLORS.glassBorder;
  }

  function getBackgroundColor(index: number): string {
    if (!showAnswer) {
      return selectedOption === index ? 'rgba(179,212,255,0.15)' : 'transparent';
    }
    if (index === data.answerIndex) return 'rgba(79,255,176,0.15)';
    if (selectedOption === index && index !== data.answerIndex) return 'rgba(255,107,138,0.15)';
    return 'transparent';
  }

  return (
    <View style={styles.container}>
      {/* Matrix Grid */}
      <GlassCard style={styles.matrixCard} noPad>
        <SvgXml xml={gridSvg} width="100%" height={260} />
      </GlassCard>

      {/* Options */}
      <View style={styles.optionsRow}>
        {data.options.map((optSvg, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              {
                borderColor: getBorderColor(index),
                backgroundColor: getBackgroundColor(index),
              },
            ]}
            onPress={() => !disabled && onSelectOption(index)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <SvgXml xml={optSvg} width={OPTION_SIZE} height={OPTION_SIZE} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  matrixCard: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    width: 84,
    height: 84,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
