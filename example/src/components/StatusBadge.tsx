import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/use-theme';

export type EstimateStatus = 'Approved' | 'Pending' | 'Draft' | 'In Review';

interface StatusBadgeProps {
  status: EstimateStatus;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG_LIGHT: Record<
  EstimateStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  Approved: {
    label: 'Approved',
    bg: '#DCFCE7',
    text: '#15803D',
    border: '#86EFAC',
  },
  Pending: {
    label: 'Pending',
    bg: '#FEF9C3',
    text: '#A16207',
    border: '#FDE047',
  },
  Draft: {
    label: 'Draft',
    bg: '#F1F5F9',
    text: '#475569',
    border: '#CBD5E1',
  },
  'In Review': {
    label: 'In Review',
    bg: '#E0F2FE',
    text: '#0369A1',
    border: '#BAE6FD',
  },
};

const STATUS_CONFIG_DARK: Record<
  EstimateStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  Approved: {
    label: 'Approved',
    bg: '#052E16',
    text: '#4ADE80',
    border: '#14532D',
  },
  Pending: {
    label: 'Pending',
    bg: '#422006',
    text: '#FDE047',
    border: '#713F12',
  },
  Draft: {
    label: 'Draft',
    bg: '#1E293B',
    text: '#94A3B8',
    border: '#334155',
  },
  'In Review': {
    label: 'In Review',
    bg: '#082F49',
    text: '#38BDF8',
    border: '#0369A1',
  },
};

export function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  const theme = useTheme();
  const configMap = theme.isDark ? STATUS_CONFIG_DARK : STATUS_CONFIG_LIGHT;
  const config = configMap[status] ?? configMap.Draft;
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.border },
        isSmall ? styles.smallBadge : styles.mediumBadge,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.text },
          isSmall ? styles.smallText : styles.mediumText,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  mediumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 13,
  },
});
