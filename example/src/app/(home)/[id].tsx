import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDetailScreenBack } from 'expo-split-view';
import { useMemo } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FRAMEWORKS, FrameworkItem } from '@/data/frameworks';
import { useTheme } from '@/hooks/use-theme';

export default function FrameworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const nav = useRouter();

  const framework = useMemo<FrameworkItem>(() => {
    return (
      FRAMEWORKS.find((item) => item.id === id) ?? {
        id: id ?? 'unknown',
        name: id ? id.toUpperCase() : 'Unknown Framework',
        icon: '📦',
        category: 'UI Library',
        creator: 'Open Source Community',
        year: 2024,
        tagline: 'JavaScript UI Library or Framework',
        description: 'Details for this framework are currently being updated.',
        accentColor: '#0284C7',
        badgeBg: '#F0F9FF',
        badgeText: '#0369A1',
        darkBadgeBg: '#082F49',
        darkBadgeText: '#7DD3FC',
        website: 'https://github.com',
        githubStars: 'N/A',
        highlights: ['Modular Component Architecture', 'Developer Experience', 'Cross-Platform'],
      }
    );
  }, [id]);

  useDetailScreenBack({
    title: framework.name,
    fallbackRoute: '/(home)',
  });

  const badgeBg = theme.isDark ? framework.darkBadgeBg : framework.badgeBg;
  const badgeText = theme.isDark ? framework.darkBadgeText : framework.badgeText;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Framework Hero Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.heroTop}>
          <View
            style={[styles.iconCircle, { backgroundColor: badgeBg }]}
          >
            <Text style={styles.iconEmoji}>{framework.icon}</Text>
          </View>
          <View style={styles.heroInfo}>
            <Text style={[styles.title, { color: theme.text }]}>
              {framework.name}
            </Text>
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.categoryPill,
                  { backgroundColor: badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: badgeText },
                  ]}
                >
                  {framework.category}
                </Text>
              </View>
              <Text
                style={[
                  styles.creatorMeta,
                  { color: theme.textMuted },
                ]}
              >
                {framework.creator} • Est. {framework.year}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.tagline,
            { color: theme.textSecondary },
          ]}
        >
          {framework.tagline}
        </Text>
      </View>

      {/* Description Section */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Overview
        </Text>
        <Text
          style={[
            styles.bodyText,
            { color: theme.textSecondary },
          ]}
        >
          {framework.description}
        </Text>
      </View>

      {/* Highlights Section */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Key Highlights
        </Text>
        <View style={styles.highlightList}>
          {framework.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <Text style={styles.bulletCheck}>✓</Text>
              <Text
                style={[
                  styles.highlightText,
                  { color: theme.textSecondary },
                ]}
              >
                {highlight}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Stats & Links */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: theme.statBoxBg,
              borderColor: theme.statBoxBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.statLabel,
              { color: theme.textMuted },
            ]}
          >
            GitHub Stars
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: theme.text },
            ]}
          >
            ⭐ {framework.githubStars}
          </Text>
        </View>
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: theme.statBoxBg,
              borderColor: theme.statBoxBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.statLabel,
              { color: theme.textMuted },
            ]}
          >
            Released
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: theme.text },
            ]}
          >
            {framework.year}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
        <Pressable
          onPress={() => nav.navigate({ pathname: "/subpage", params: { source: id, id } })}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: framework.accentColor },
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>
            Navigate to sub Page
          </Text>
        </Pressable>

        {/* Official Link Button */}
        <Pressable
          onPress={() => Linking.openURL(framework.website)}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: framework.accentColor },
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>
            Visit {framework.name} Website ↗
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heroCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 26,
  },
  heroInfo: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  creatorMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  highlightList: {
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletCheck: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 4,
  },
  actionButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
