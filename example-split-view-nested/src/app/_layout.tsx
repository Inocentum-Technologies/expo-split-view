import '../global.css';
import { Stack } from 'expo-router';
import { PanelUIProvider } from 'panelui-native';
import { KeyboardProvider } from "react-native-keyboard-controller";


export default function RootLayout() {
  return (
    <KeyboardProvider navigationBarTranslucent statusBarTranslucent preserveEdgeToEdge>
      <PanelUIProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
          {/* The employees group owns its own headers via SplitView. */}
          <Stack.Screen name="employees" options={{ headerShown: false }} />
        </Stack>
      </PanelUIProvider>
    </KeyboardProvider>
  );
}
