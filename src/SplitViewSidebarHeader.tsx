import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
    useWindowDimensions,
    type ColorValue,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'expo-router';
import { BackIcon } from './BackIcon';

export interface SplitViewSidebarHeaderProps {
    title?: string;
    renderBackIcon?: () => ReactNode;
    backIconColor?: ColorValue;
    height?: number;
    canGoBack: boolean;
    onBack: () => void;
    titleAlign?: 'left' | 'center';
    titleStyle?: StyleProp<TextStyle>;
    headerStyle?: StyleProp<ViewStyle>;
}

const ANDROID_RIPPLE = {
    borderless: true,
    radius: 24,
};

interface BackButtonProps {
    isIOS: boolean;
    hitSlop: number;
    onPress: () => void;
    children: ReactNode;
}

function BackButton({ isIOS, hitSlop, onPress, children }: BackButtonProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={hitSlop}
            onPress={onPress}
            style={({ pressed }) => [
                isIOS ? styles.iosBackButton : styles.androidBackButton,
                pressed && (isIOS ? styles.iosButtonPressed : styles.androidButtonPressed),
            ]}
            android_ripple={!isIOS ? ANDROID_RIPPLE : undefined}
        >
            {children}
        </Pressable>
    );
}

export function SplitViewSidebarHeader({
    title,
    renderBackIcon,
    backIconColor,
    height,
    canGoBack,
    onBack,
    titleAlign,
    titleStyle,
    headerStyle,
}: SplitViewSidebarHeaderProps) {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const scheme = useColorScheme();
    const { width, height: windowHeight } = useWindowDimensions();
    const isIOS = Platform.OS === 'ios';

    // Standard native stack header heights:
    // - iPad: 50
    // - iPhone: 44 in portrait, 32 in landscape (compact UINavigationBar)
    // - Android tablet (sw600dp): 64 (Material 3 TopAppBar)
    // - Android phone: 56
    const isLandscape = width > windowHeight;
    const isTabletDevice = Math.min(width, windowHeight) >= 600;
    const isPad = Platform.OS === 'ios' && (Platform.isPad || isTabletDevice);

    const defaultHeight = isIOS
        ? (isPad ? 50 : isLandscape ? 32 : 44)
        : (isTabletDevice ? 64 : 56);
    const resolvedHeight = height ?? defaultHeight;

    // Standard native stack title alignment: center on iOS, left on Android/Web.
    const resolvedTitleAlign = titleAlign ?? (isIOS ? 'center' : 'left');

    const textColor = (theme?.colors?.text ?? (scheme === 'dark' ? '#ffffff' : '#000000')) as ColorValue;
    const borderColor = (theme?.colors?.border ?? (scheme === 'dark' ? '#272729' : '#e0e0e0')) as ColorValue;
    const defaultBackIconColor = isIOS
        ? ((theme?.colors?.primary ?? '#007AFF') as ColorValue)
        : textColor;
    const resolvedBackIconColor = backIconColor ?? defaultBackIconColor;

    const titlePlatformStyle = isIOS ? styles.iosTitle : styles.androidTitle;

    const backIcon = renderBackIcon?.() ?? <BackIcon color={resolvedBackIconColor} />;

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    height: resolvedHeight + insets.top,
                    borderBottomColor: borderColor,
                },
                headerStyle,
            ]}
        >
            <View style={[styles.content, { height: resolvedHeight }]}>
                {resolvedTitleAlign === 'center' ? (
                    // Centered title layout (standard iOS UINavigationBar)
                    <>
                        <View style={[styles.centerSideSlot, canGoBack ? styles.centerSideSlotWithButton : styles.centerSideSlotEmpty]}>
                            {canGoBack && (
                                <BackButton isIOS={isIOS} hitSlop={8} onPress={onBack}>
                                    {backIcon}
                                </BackButton>
                            )}
                        </View>

                        <View style={styles.centerTitleWrapper}>
                            {title ? (
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.titleBase,
                                        titlePlatformStyle,
                                        { color: textColor, textAlign: 'center' },
                                        titleStyle,
                                    ]}
                                >
                                    {title}
                                </Text>
                            ) : null}
                        </View>

                        {/* Balance the left slot so title stays centered */}
                        <View
                            style={[styles.centerSideSlot, canGoBack ? styles.centerSideSlotWithButton : styles.centerSideSlotEmpty]}
                            pointerEvents="none"
                        />
                    </>
                ) : (
                    // Left-aligned title layout (standard Android Toolbar & Web)
                    <View
                        style={[
                            styles.leftRow,
                            canGoBack
                                ? (isIOS ? styles.leftRowWithButtonIOS : styles.leftRowWithButtonAndroid)
                                : styles.leftRowWithoutButton,
                        ]}
                    >
                        {canGoBack && (
                            <BackButton isIOS={isIOS} hitSlop={isIOS ? 8 : 4} onPress={onBack}>
                                {backIcon}
                            </BackButton>
                        )}
                        {title ? (
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.titleBase,
                                    titlePlatformStyle,
                                    { color: textColor, textAlign: 'left' },
                                    canGoBack && (isIOS ? styles.iosTitleWithButtonLeft : styles.androidTitleWithButton),
                                    titleStyle,
                                ]}
                            >
                                {title}
                            </Text>
                        ) : null}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'flex-end',
    },
    content: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleBase: {
        includeFontPadding: false,
    },
    iosTitle: {
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.41,
    },
    androidTitle: {
        fontSize: 20,
        fontWeight: '500',
        letterSpacing: 0.15,
    },
    androidTitleWithButton: {
        marginStart: 4,
        flex: 1,
    },
    iosTitleWithButtonLeft: {
        marginStart: 8,
        flex: 1,
    },
    centerSideSlot: {
        justifyContent: 'center',
    },
    centerSideSlotWithButton: {
        width: 56,
        paddingStart: 16,
        alignItems: 'flex-start',
    },
    centerSideSlotEmpty: {
        width: 16,
    },
    centerTitleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    leftRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftRowWithoutButton: {
        paddingHorizontal: 16,
    },
    leftRowWithButtonAndroid: {
        paddingStart: 4,
        paddingEnd: 16,
    },
    leftRowWithButtonIOS: {
        paddingStart: 8,
        paddingEnd: 16,
    },
    iosBackButton: {
        minWidth: 40,
        minHeight: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    iosButtonPressed: {
        opacity: 0.4,
    },
    androidBackButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
    androidButtonPressed: {
        opacity: 0.6,
    },
});