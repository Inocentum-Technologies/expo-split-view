import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SplitViewSidebarHeaderProps } from './types';
import { BackIcon } from './BackIcon';

export function SplitViewSidebarHeader({
    title,
    renderBackIcon,
    backIconColor,
    height = 56,
    canGoBack,
    onBack,
}: SplitViewSidebarHeaderProps) {
    const insets = useSafeAreaInsets();

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
                    {renderBackIcon?.() ?? <BackIcon color={backIconColor} />}
                </Pressable>
            )}
            {title ? <Text numberOfLines={1} style={{ marginStart: 8 }}>{title}</Text> : null}
        </View>
    );
}