import { useTheme } from 'expo-router';
import React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';
import type { SplitViewDetailProps } from './types';
import { useDetailScreenBack } from './useDetailScreenBack';

/**
 * Convenience container view for SplitView detail screens.
 * Automatically wires up the iOS edge-swipe back gesture handlers so you don't have to spread panHandlers manually.
 */
export function SplitViewDetail({
    children,
    style,
    backOptions,
}: SplitViewDetailProps) {
    const theme = useTheme();
    const { panHandlers } = useDetailScreenBack(backOptions);

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: (theme?.colors?.background ?? '#ffffff') as ColorValue },
                style,
            ]}
            {...panHandlers}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
