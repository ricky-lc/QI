// Pastel glassmorphism color palette
export const COLORS = {
  // Backgrounds
  bgPrimary: '#0f0c29',
  bgSecondary: '#1a1040',
  bgGradientStart: '#0f0c29',
  bgGradientMid: '#302b63',
  bgGradientEnd: '#24243e',

  // Pastel accents
  pastelPink: '#FFB3C6',
  pastelBlue: '#B3D4FF',
  pastelPurple: '#D4B3FF',
  pastelGreen: '#B3FFD4',
  pastelYellow: '#FFF3B3',
  pastelCoral: '#FFD4B3',
  pastelMint: '#B3FFEE',
  pastelLavender: '#E8B3FF',

  // Glass surfaces
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassDark: 'rgba(0, 0, 0, 0.3)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.75)',
  textMuted: 'rgba(255, 255, 255, 0.45)',

  // Test category colors
  logical: '#B3D4FF',
  spatial: '#D4B3FF',
  memory: '#FFB3C6',
  pattern: '#B3FFD4',
  verbal: '#FFF3B3',
  numerical: '#FFD4B3',

  // Status
  success: '#4FFFB0',
  error: '#FF6B8A',
  warning: '#FFE066',
  info: '#66CFFF',

  // UI
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const CATEGORY_COLORS: Record<string, string> = {
  logical: COLORS.logical,
  spatial: COLORS.spatial,
  memory: COLORS.memory,
  pattern: COLORS.pattern,
  verbal: COLORS.verbal,
  numerical: COLORS.numerical,
};

export const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  logical: ['#667eea', '#764ba2'],
  spatial: ['#f093fb', '#f5576c'],
  memory: ['#4facfe', '#00f2fe'],
  pattern: ['#43e97b', '#38f9d7'],
  verbal: ['#fa709a', '#fee140'],
  numerical: ['#a18cd1', '#fbc2eb'],
};
