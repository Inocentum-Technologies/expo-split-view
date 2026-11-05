import { Platform, Pressable, Text, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SplitViewSidebarHeaderProps } from './types';
import { BackIcon } from './BackIcon';
import { useTheme } from 'expo-router';

export function SplitViewSidebarHeader({
    title,
    renderBackIcon,
    backIconColor,
    height = 56,
    canGoBack,
    onBack,
}: SplitViewSidebarHeaderProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme();

    const tintColor: ColorValue =
        backIconColor ??
        (Platform.OS === 'ios'
            ? ((theme?.colors?.primary as ColorValue) || (theme?.dark ? '#0A84FF' : '#007AFF'))
            : ((theme?.colors?.text as ColorValue) || (theme?.dark ? '#FFFFFF' : '#111827')));

    return (
        <View
            style={{
                paddingTop: insets.top,
                height: height + insets.top,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            {canGoBack && (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    hitSlop={8}
                    onPress={onBack}
                >
                    {renderBackIcon?.() ?? <BackIcon color={tintColor} />}
                </Pressable>
            )}
            {title ? <Text numberOfLines={1} style={{ marginStart: 8 }}>{title}</Text> : null}
        </View>
    );
}