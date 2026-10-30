import { useGlobalSearchParams, usePathname } from 'expo-router';
import { useSplitView } from 'expo-split-view';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FRAMEWORKS, FrameworkItem } from '../data/frameworks';
import { useTheme } from '../hooks/use-theme';

// Routes where no detail item is open — active selection is suppressed on these
const INDEX_ROUTES = new Set(['/', '/(home)', '/(home)/index']);

export function MasterList() {
  const { navigate, isTablet } = useSplitView();
  const pathname = usePathname();
  const globalParams = useGlobalSearchParams<{ id?: string | string[]; source?: string | string[] }>();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Map of known framework IDs for fast and reliable validation
  const frameworkMap = useMemo(
    () => new Map(FRAMEWORKS.map((item) => [item.id.toLowerCase(), item.id])),
    []
  );

  // Persistent in-memory selection so navigating through subpages keeps the active state
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Resolve active detail-pane item ID across root screens, detail screens, and subpages
  const activeId = useMemo(() => {
    const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
    if (INDEX_ROUTES.has(cleanPath) || INDEX_ROUTES.has(pathname)) {
      return null;
    }

    // 1. Direct match from route parameter `id`
    const rawId = Array.isArray(globalParams.id) ? globalParams.id[0] : globalParams.id;
    if (rawId && frameworkMap.has(rawId.toLowerCase())) {
      return frameworkMap.get(rawId.toLowerCase())!;
    }

    // 2. Match from query or navigation parameter `source`
    const rawSource = Array.isArray(globalParams.source) ? globalParams.source[0] : globalParams.source;
    if (rawSource && frameworkMap.has(rawSource.toLowerCase())) {
      return frameworkMap.get(rawSource.toLowerCase())!;
    }

    // 3. Match from pathname segments (e.g. /react or /(home)/react/subpage)
    const segments = cleanPath
      .split('/')
      .filter((seg) => seg && !seg.startsWith('(') && seg !== 'index');
    for (const seg of segments) {
      if (frameworkMap.has(seg.toLowerCase())) {
        return frameworkMap.get(seg.toLowerCase())!;
      }
    }

    // 4. Retain previously selected framework when navigating within subpages
    if (selectedId && frameworkMap.has(selectedId.toLowerCase())) {
      return selectedId;
    }

    return null;
  }, [pathname, globalParams.id, globalParams.source, frameworkMap, selectedId]);

  // Keep selectedId state synchronized with route changes
  useEffect(() => {
    const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
    if (INDEX_ROUTES.has(cleanPath) || INDEX_ROUTES.has(pathname)) {
      setSelectedId(null);
    } else if (activeId) {
      setSelectedId(activeId);
    }
  }, [pathname, activeId]);

  const categories = ['All', 'UI Library', 'Framework', 'Full-Stack'];

  const filteredFrameworks = useMemo(() => {
    return FRAMEWORKS.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        item.name.toLowerCase().includes(query) ||
        item.tagline.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Full-Stack' && item.category === 'Meta-Framework');

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.headerBg,
            borderBottomColor: theme.headerBorder,
            paddingTop: Math.max(insets.top, 16) + (isTablet ? 0 : 4),
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: theme.text }]}>JS Frameworks</Text>
          <View
            style={[
              styles.badgeContainer,
              {
                backgroundColor: theme.modeBadgeBg,
                borderColor: theme.modeBadgeBorder,
              },
            ]}
          >
            <Text style={[styles.modeBadge, { color: theme.modeBadgeText }]}>
              {isTablet ? '🖥️ Tablet Split' : '📱 Mobile Stack'}
            </Text>
          </View>
        </View>

        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {filteredFrameworks.length} of {FRAMEWORKS.length} frameworks
        </Text>

        {/* Search input */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.searchBg,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search React, Angular, Solid..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <Text style={[styles.clearText, { color: theme.textMuted }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category filter chips */}
        <View style={styles.chipRow}>
          {categories.map((category) => {
            const isChipSelected = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isChipSelected
                      ? theme.chipActiveBg
                      : theme.chipBg,
                    borderColor: isChipSelected
                      ? theme.chipActiveBg
                      : theme.chipBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isChipSelected
                        ? theme.chipActiveText
                        : theme.chipText,
                      fontWeight: isChipSelected ? '600' : '500',
                    },
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Frameworks FlatList */}
      <FlatList
        data={filteredFrameworks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }: { item: FrameworkItem }) => {
          // Visual active state is strictly tablet-only — never shown on mobile
          const isSelected = isTablet && activeId === item.id;
          const badgeBg = theme.isDark ? item.darkBadgeBg : item.badgeBg;
          const badgeText = theme.isDark ? item.darkBadgeText : item.badgeText;

          return (
            <Pressable
              onPress={() => {
                setSelectedId(item.id);
                navigate(`/(home)/${item.id}`);
              }}
              style={({ pressed }) => [
                styles.itemCard,
                {
                  backgroundColor: isSelected ? theme.selectedCardBg : theme.card,
                  borderColor: isSelected ? theme.selectedCardBorder : theme.cardBorder,
                  borderWidth: isSelected ? 2 : 1,
                  borderLeftWidth: isSelected ? 5 : 1,
                },
                isSelected && styles.itemCardSelected,
                pressed && styles.itemCardPressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: badgeBg },
                      isSelected && {
                        borderColor: theme.selectedCardBorder,
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.nameBlock}>
                    <View style={styles.nameHeaderRow}>
                      <Text
                        style={[
                          styles.frameworkName,
                          {
                            color: isSelected
                              ? theme.selectedCardText
                              : theme.text,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      {isSelected && (
                        <View
                          style={[
                            styles.activeIndicatorBadge,
                            {
                              backgroundColor: theme.selectedCardBorder,
                            },
                          ]}
                        >
                          <Text style={styles.activeIndicatorBadgeText}>ACTIVE</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.creatorText,
                        { color: theme.textMuted },
                      ]}
                    >
                      {item.creator} • {item.year}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: badgeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryBadgeText,
                      { color: badgeText },
                    ]}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.tagline,
                  {
                    color: isSelected
                      ? theme.isDark
                        ? '#CBD5E1'
                        : '#334155'
                      : theme.textSecondary,
                  },
                ]}
                numberOfLines={2}
              >
                {item.tagline}
              </Text>

              <View
                style={[
                  styles.cardFooter,
                  {
                    borderTopColor: isSelected
                      ? theme.isDark
                        ? '#164E63'
                        : '#BAE6FD'
                      : theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.starsText,
                    {
                      color: isSelected ? theme.selectedCardText : theme.textMuted,
                      fontWeight: isSelected ? '600' : '500',
                    },
                  ]}
                >
                  ⭐ {item.githubStars} stars
                </Text>
                <View
                  style={[
                    styles.actionPill,
                    isSelected && {
                      backgroundColor: theme.selectedCardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.learnMoreText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.primary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {isSelected ? 'Viewing ›' : 'Details ›'}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No frameworks found
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.textSecondary },
              ]}
            >
              Try searching for "React", "Angular", or "Solid".
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 14,
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  listContent: {
    padding: 12,
    paddingBottom: 32,
    gap: 10,
  },
  itemCard: {
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemCardSelected: {
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  itemCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 18,
  },
  nameBlock: {
    flex: 1,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  frameworkName: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeIndicatorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  activeIndicatorBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  creatorText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  starsText: {
    fontSize: 11,
  },
  actionPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  learnMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
