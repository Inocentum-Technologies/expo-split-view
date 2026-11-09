import '../global.css';
import { Stack } from 'expo-router';
import { PanelUIProvider } from 'panelui-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PanelUIProvider statusBarTranslucent navigationBarTranslucent>
        <Stack
          screenOptions={{
            unstable_nativeProps: {
              headerConfig: {
                disableBottomInsetApplication: true,
              },
            },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
          {/* The employees group owns its own headers via SplitView. */}
          <Stack.Screen name="employees" options={{ headerShown: false }} />
        </Stack>
      </PanelUIProvider>
    </SafeAreaProvider>
  );
}
