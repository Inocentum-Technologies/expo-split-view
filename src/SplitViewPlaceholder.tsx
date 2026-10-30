import { useTheme } from 'expo-router';
import { ColorValue, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { SplitViewPlaceholderProps } from './types';

export function SplitViewPlaceholder({
    masterList,
    placeholderText = 'Select an item from the left pane',
    placeholder,
    tabletBreakpoint = 768,
    placeholderContainerStyle,
    placeholderTextStyle,
}: SplitViewPlaceholderProps) {
    const { width } = useWindowDimensions();
    const theme = useTheme();
    const isTablet = width >= tabletBreakpoint;

    // If phone, render the Master List inside the full-screen stack
    if (!isTablet) {
        return <>{masterList}</>;
    }

    // If tablet, render custom placeholder if passed
    if (placeholder) {
        return <>{placeholder}</>;
    }

    // Default right-pane placeholder view before user selects an item
    return (
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
