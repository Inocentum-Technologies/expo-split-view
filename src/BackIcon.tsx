import {
    Image,
    I18nManager,
    Platform,
    useColorScheme,
    type ColorValue,
    type ImageStyle,
    type StyleProp,
} from 'react-native';

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

export function BackIcon({ color, size = DEFAULT_SIZE, style }: BackIconProps) {
    const scheme = useColorScheme();
    const tint = color ?? (scheme === 'dark' ? '#FFFFFF' : '#000000');

    return (
        <Image
            source={ICON}
            resizeMode="contain"
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[
                {
                    width: size,
                    height: size,
                    tintColor: tint,
                    // React Native doesn't mirror image assets in RTL, so flip manually.
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                },
                style,
            ]}
        />
    );
}