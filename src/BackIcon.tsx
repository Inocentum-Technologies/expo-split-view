import {
    Image,
    I18nManager,
    Platform,
    StyleSheet,
    useColorScheme,
    type ColorValue,
    type ImageStyle,
    type StyleProp,
} from 'react-native';
import { memo, useMemo } from 'react';

const ICON = Platform.select({
    ios: require('./assets/back-ios.png'),
    default: require('./assets/back-android.png'),
});

// Default rendered size per platform (dp). Adjust to match your artwork.
const DEFAULT_SIZE = Platform.select({ ios: 22, default: 24 });

export type BackIconProps = {
    /** Tint color. Defaults to black in light mode and white in dark mode. */
    color?: ColorValue;
    /** Rendered size in dp. Defaults to 22 on iOS and 24 elsewhere. */
    size?: number;
    style?: StyleProp<ImageStyle>;
};

function BackIconComponent({ color, size = DEFAULT_SIZE, style }: BackIconProps) {
    const scheme = useColorScheme();
    const tint = color ?? (scheme === 'dark' ? '#FFFFFF' : '#000000');

    const baseStyle = useMemo<ImageStyle>(
        () => ({ width: size, height: size, tintColor: tint }),
        [size, tint]
    );

    return (
        <Image
            source={ICON}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            // React Native doesn't mirror image assets in RTL, so flip manually.
            style={[baseStyle, I18nManager.isRTL && styles.rtlFlip, style]}
        />
    );
}

export const BackIcon = memo(BackIconComponent);

const styles = StyleSheet.create({
    rtlFlip: {
        transform: [{ scaleX: -1 }],
    },
});