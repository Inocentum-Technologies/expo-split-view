/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Dynamically switches based on system preferences.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#E0F2FE',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    headerBg: '#FFFFFF',
    headerBorder: '#E2E8F0',
    searchBg: '#F1F5F9',
    chipBg: '#F1F5F9',
    chipBorder: '#E2E8F0',
    chipText: '#475569',
    chipActiveBg: '#0284C7',
    chipActiveText: '#FFFFFF',
    primary: '#0284C7',
    modeBadgeBg: '#EEF2FF',
    modeBadgeBorder: '#C7D2FE',
    modeBadgeText: '#4338CA',
    selectedCardBg: '#F0F9FF',
    selectedCardBorder: '#0284C7',
    selectedCardText: '#0369A1',
    statBoxBg: '#FFFFFF',
    statBoxBorder: '#E2E8F0',
    divider: '#F1F5F9',
    tipBoxBg: '#F0FDF4',
    tipBoxBorder: '#BBF7D0',
    tipBoxTitle: '#15803D',
    tipBoxText: '#166534',
    placeholderIconBg: '#F0F9FF',
    placeholderIconBorder: '#BAE6FD',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#0B0F19',
    backgroundElement: '#1E293B',
    backgroundSelected: '#0C4A6E',
    card: '#111827',
    cardBorder: '#1E293B',
    headerBg: '#0F172A',
    headerBorder: '#1E293B',
    searchBg: '#1E293B',
    chipBg: '#1E293B',
    chipBorder: '#334155',
    chipText: '#94A3B8',
    chipActiveBg: '#0284C7',
    chipActiveText: '#FFFFFF',
    primary: '#38BDF8',
    modeBadgeBg: '#1E1B4B',
    modeBadgeBorder: '#3730A3',
    modeBadgeText: '#A5B4FC',
    selectedCardBg: '#082F49',
    selectedCardBorder: '#38BDF8',
    selectedCardText: '#38BDF8',
    statBoxBg: '#111827',
    statBoxBorder: '#1E293B',
    divider: '#1E293B',
    tipBoxBg: '#052E16',
    tipBoxBorder: '#14532D',
    tipBoxTitle: '#4ADE80',
    tipBoxText: '#86EFAC',
    placeholderIconBg: '#0C4A6E',
    placeholderIconBorder: '#0284C7',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
