import type { ReactNode } from 'react';
import { useTheme } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, type ColorValue } from 'react-native';
import { BackIcon } from './BackIcon';

export interface HeaderBackButtonProps {
    onPress: () => void;
    tintColor?: ColorValue;
    backTitle?: string | null;
    renderBackIcon?: (props: { color?: ColorValue }) => ReactNode;
}

/** Back button injected into a native stack header (detail screens and phone placeholder). */
export function HeaderBackButton({
    onPress,
    tintColor,
    backTitle = 'Back',
    renderBackIcon,
}: HeaderBackButtonProps) {
    // Follow the navigation theme, like the native header does. Using the raw system
    // color scheme here makes the icon invisible whenever the app's navigation theme
    // disagrees with it (e.g. dark OS + light header).
    const theme = useTheme();
    const defaultTintColor = Platform.OS === 'ios' ? theme?.colors?.primary : theme?.colors?.text;
    const resolvedTintColor = tintColor ?? defaultTintColor;

    return (
        <Pressable
            onPress={onPress}
            hitSlop={12}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Back"
        >
            {renderBackIcon?.({ color: resolvedTintColor }) ?? <BackIcon color={resolvedTintColor} />}
            {Platform.OS === 'ios' && backTitle && (
                <Text
                    style={[
                        styles.backText,
                        resolvedTintColor ? { color: resolvedTintColor } : undefined,
                    ]}
                >
                    {backTitle}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingRight: 8,
        // iOS is placed by the native header with its own inset; the web header keeps
        // the native back link at an 11px left margin, so match it here.
        marginLeft: Platform.OS === 'ios' ? -8 : Platform.OS === 'web' ? 11 : 0,
    },
    backButtonPressed: {
        opacity: 0.5,
    },
    backText: {
        fontSize: 17,
        marginLeft: 4,
    },
});
