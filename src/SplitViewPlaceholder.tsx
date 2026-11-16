import {
    Stack,
    useNavigation,
    useRouter,
    useTheme,
    type NativeStackNavigationOptions,
} from 'expo-router';
import { StyleSheet, Text, View, type ColorValue } from 'react-native';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { SplitViewPlaceholderProps } from './types';
import { useIsTablet } from './SplitViewBreakpointContext';
import { useSplitViewFallbackRoute } from './SplitViewFallbackContext';
import { HeaderBackButton } from './HeaderBackButton';

// Stable references so <Stack.Screen> only re-applies options when the mode changes.
const renderNoHeaderLeft = () => null;
const PHONE_OPTIONS: NativeStackNavigationOptions = { headerBackVisible: true };
const TABLET_OPTIONS: NativeStackNavigationOptions = {
    headerBackVisible: false,
    headerLeft: renderNoHeaderLeft,
};

export function SplitViewPlaceholder({
    masterList,
    placeholderText = 'Select an item from the left pane',
    placeholder,
    placeholderContainerStyle,
    placeholderTextStyle,
}: SplitViewPlaceholderProps) {
    const theme = useTheme();
    // The breakpoint is configured once, on the parent <SplitView>.
    // Re-renders only when the window width crosses it, not on every resize tick.
    const isTablet = useIsTablet();
    const navigation = useNavigation();
    const router = useRouter();
    const fallbackRoute = useSplitViewFallbackRoute();

    // Parent bubbling is intended here: before a reload the outer stack provides the
    // back arrow to the screen that pushed the split view. After a reload it cannot.
    const subscribe = useCallback(
        (notify: () => void) => navigation.addListener('state', notify),
        [navigation]
    );
    const checkCanGoBack = useCallback(() => navigation.canGoBack(), [navigation]);
    const canGoBack = useSyncExternalStore(subscribe, checkCanGoBack, checkCanGoBack);

    // After a reload on the master list itself there is nothing to pop, so inject the
    // same fallback back affordance the detail screens use.
    const showCustomBack = !isTablet && !canGoBack && fallbackRoute !== null;

    const onBack = useCallback(() => {
        if (fallbackRoute) router.dismissTo(fallbackRoute);
    }, [router, fallbackRoute]);

    const phoneOptions = useMemo<NativeStackNavigationOptions>(() => {
        if (!showCustomBack) return PHONE_OPTIONS;
        return {
            headerBackVisible: false,
            headerLeft: () => <HeaderBackButton onPress={onBack} />,
        };
    }, [showCustomBack, onBack]);

    // If phone, render the Master List inside the full-screen stack
    if (!isTablet) {
        return (
            <>
                <Stack.Screen options={phoneOptions} />
                {masterList}
            </>
        );
    }

    // If tablet, render custom placeholder if passed, else default placeholder view
    return (
        <>
            <Stack.Screen options={TABLET_OPTIONS} />
            {placeholder ?? (
                <View
                    style={[
                        styles.container,
                        { backgroundColor: (theme?.colors?.background ?? '#ffffff') as ColorValue },
                        placeholderContainerStyle,
                    ]}
                >
                    <Text
                        style={[
                            styles.text,
                            { color: (theme?.dark ? '#8E8E93' : '#888888') as ColorValue },
                            placeholderTextStyle,
                        ]}
                    >
                        {placeholderText}
                    </Text>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        color: '#888',
        fontSize: 16,
    },
});
