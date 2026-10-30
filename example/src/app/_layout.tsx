import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B0F19',
    card: '#0F172A',
    border: '#1E293B',
    text: '#F8FAFC',
    primary: '#38BDF8',
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    primary: '#0284C7',
  },
};

// The root window / system-chrome background colour.
// This fills the status-bar strip, Android nav bar, and any edge-inset gaps
// that show the underlying system window — keeping them consistent with the
// app theme so there is no jarring white flash in dark mode.
const DARK_BG = CustomDarkTheme.colors.background;   // '#0B0F19'
const LIGHT_BG = CustomLightTheme.colors.background; // '#F8FAFC'

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Sync the Android navigation bar and root window background with the active
  // theme. expo-system-ui covers both the nav bar background colour and the
  // root-view background that peeks behind the React Native layout.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDark ? DARK_BG : LIGHT_BG);
  }, [isDark]);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
        <Slot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
