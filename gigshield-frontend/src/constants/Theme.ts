// Helion Material Design 3 Dark Theme
// Based on the approved HTML design mockups

export const COLORS = {
    // Core surfaces
    background: '#131313',
    surface: '#131313',
    surfaceDim: '#131313',
    surfaceContainerLowest: '#0e0e0e',
    surfaceContainerLow: '#1c1b1b',
    surfaceContainer: '#201f1f',
    surfaceContainerHigh: '#2a2a2a',
    surfaceContainerHighest: '#353534',
    surfaceBright: '#3a3939',

    // Primary
    primary: '#cebdff',
    primaryContainer: '#9a80e7',
    onPrimary: '#37177f',
    onPrimaryContainer: '#310c78',
    inversePrimary: '#674db0',

    // Secondary (green)
    secondary: '#80d9a4',
    secondaryContainer: '#006d42',
    onSecondary: '#003920',
    onSecondaryContainer: '#92ebb5',

    // Tertiary (soft purple)
    tertiary: '#cdc1e5',
    tertiaryContainer: '#978bae',
    onTertiary: '#342c49',
    onTertiaryContainer: '#2e2541',

    // Error
    error: '#ffb4ab',
    errorContainer: '#93000a',
    onError: '#690005',
    onErrorContainer: '#ffdad6',

    // Text / on-surface
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#cac4d3',
    onBackground: '#e5e2e1',
    inverseSurface: '#e5e2e1',
    inverseOnSurface: '#313030',

    // Outlines
    outline: '#948e9d',
    outlineVariant: '#494552',

    // Legacy aliases (for backward compat)
    text: '#e5e2e1',
    textMuted: '#cac4d3',
    border: 'rgba(73, 69, 82, 0.3)',
    glass: 'rgba(255, 255, 255, 0.05)',
    cardShadow: 'rgba(0, 0, 0, 0.4)',

    // Semantic
    success: '#80d9a4',
    warning: '#FFB74D',
    danger: '#ffb4ab',
};

export const GRADIENTS = {
    primary: ['#cebdff', '#9a80e7'],
    secondary: ['#80d9a4', '#006d42'],
    success: ['#80d9a4', '#006d42'],
    warning: ['#FFB74D', '#FF9800'],
    danger: ['#ffb4ab', '#93000a'],
    dark: [COLORS.surfaceContainerHigh, COLORS.surfaceContainer],
    glass: ['rgba(206, 189, 255, 0.08)', 'rgba(206, 189, 255, 0.02)'],
    editorial: ['#cebdff', '#9a80e7'],
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    round: 9999,
};

export const SHADOWS = {
    light: {
        shadowColor: COLORS.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    medium: {
        shadowColor: COLORS.cardShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    premium: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
};
