export const theme = {
  colors: {
    // Brand palette — deep teal + electric violet + coral accent
    primary: '#00C9A7',          // Teal mint
    primaryDark: '#00A88D',
    primaryLight: '#E0FFF8',
    secondary: '#7C3AED',        // Electric violet
    secondaryLight: '#EDE9FE',
    accent: '#FF6B6B',           // Coral red
    accentLight: '#FFF0F0',
    gold: '#F59E0B',
    goldLight: '#FEF3C7',

    // Status
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',

    // Backgrounds — warm off-white with subtle tint
    background: '#F4F7FF',
    backgroundDeep: '#E8EEFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F8FAFF',
    surfaceTinted: '#F0F4FF',
    card: '#FFFFFF',

    // Text
    text: '#12143A',
    textSecondary: '#4A5270',
    textTertiary: '#8B93B5',
    textOnDark: '#FFFFFF',

    // Borders
    border: '#DDE3F0',
    borderLight: '#EEF1FB',

    // Gradients (expressed as pairs for use with LinearGradient)
    gradientPrimary: ['#00C9A7', '#00A0E8'] as string[],
    gradientSecondary: ['#7C3AED', '#C026D3'] as string[],
    gradientWarm: ['#FF6B6B', '#FFA500'] as string[],
    gradientCard: ['#667EEA', '#764BA2'] as string[],
    gradientDark: ['#12143A', '#1E2060'] as string[],
    gradientGold: ['#F59E0B', '#EF4444'] as string[],

    // Role colors
    admin: '#00C9A7',
    family: '#7C3AED',
    guest: '#8B93B5',

    // Bill status colors
    overdue: '#EF4444',
    dueSoon: '#F59E0B',
    paid: '#10B981',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },

  fontSize: {
    xs: 11,
    sm: 13,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  shadows: {
    sm: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    teal: {
      shadowColor: '#00C9A7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    violet: {
      shadowColor: '#7C3AED',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};
