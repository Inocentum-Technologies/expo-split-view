import { useLocalSearchParams, useRouter } from 'expo-router';
import { SplitView, useDetailScreenBack } from 'expo-split-view';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FRAMEWORKS, FrameworkItem } from '@/data/frameworks';
import { useTheme } from '@/hooks/use-theme';

export default function SubPage() {
  const { source, id } = useLocalSearchParams<{ source?: string; id?: string }>();
  const activeFrameworkId = id || source;
  const router = useRouter();
  const theme = useTheme();

  const framework = useMemo<FrameworkItem | undefined>(() => {
    return FRAMEWORKS.find((item) => item.id === activeFrameworkId);
  }, [activeFrameworkId]);

  useDetailScreenBack({
    title: framework ? `${framework.name} Subpage` : 'Subpage',
    fallbackRoute: framework ? `/(home)/${framework.id}` : '/(home)',
  });

  const accentColor = framework?.accentColor ?? theme.primary;

  return (
    <SplitView.Detail style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Text style={[styles.badge, { color: accentColor }]}>
          SUBPAGE NAVIGATION
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>
          {framework ? `${framework.icon} ${framework.name}` : 'Subpage'}
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          You are currently viewing a subpage within{' '}
          <Text style={{ fontWeight: '700', color: theme.text }}>
            {framework?.name ?? activeFrameworkId ?? 'the selected item'}
          </Text>
          . The left sidebar item remains actively highlighted while navigating within subpages.
        </Text>

        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.tipBoxBg,
              borderColor: theme.tipBoxBorder,
            },
          ]}
        >
          <Text style={[styles.infoTitle, { color: theme.tipBoxTitle }]}>
            💡 Master Sidebar State Retained
          </Text>
          <Text style={[styles.infoText, { color: theme.tipBoxText }]}>
            Active selection stays sticky across all subpages in the detail stack until you select a different item or return to the root index.
          </Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: accentColor },
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonText}>
            ← Back to {framework?.name ?? 'Details'}
          </Text>
        </Pressable>
      </View>
    </SplitView.Detail>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoTitle: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
