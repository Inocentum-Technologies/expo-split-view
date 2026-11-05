import { Stack } from 'expo-router';
import { SplitView } from 'expo-split-view';
import { StyleSheet, Text, View } from 'react-native';
import { MasterList } from '@/components/MasterList';
import { useTheme } from '@/hooks/use-theme';

export default function BaseIndex() {
    const theme = useTheme();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SplitView.Placeholder
                masterList={<MasterList />}
                placeholder={
                    <View
                        style={[
                            styles.placeholderContainer,
                            { backgroundColor: theme.background },
                        ]}
                    >
                        <View
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: theme.cardBorder,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.iconCircle,
                                    {
                                        backgroundColor: theme.placeholderIconBg,
                                        borderColor: theme.placeholderIconBorder,
                                    },
                                ]}
                            >
                                <Text style={styles.iconEmoji}>⚛️</Text>
                            </View>

                            <Text style={[styles.title, { color: theme.text }]}>
                                No Framework Selected
                            </Text>
                            <Text
                                style={[
                                    styles.subtitle,
                                    { color: theme.textSecondary },
                                ]}
                            >
                                Select any framework from the master list on the left to view details.
                            </Text>

                            <View
                                style={[
                                    styles.divider,
                                    { backgroundColor: theme.divider },
                                ]}
                            />

                            <View
                                style={[
                                    styles.tipBox,
                                    {
                                        backgroundColor: theme.tipBoxBg,
                                        borderColor: theme.tipBoxBorder,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tipTitle,
                                        { color: theme.tipBoxTitle },
                                    ]}
                                >
                                    💡 Responsive Split View
                                </Text>
                                <Text
                                    style={[
                                        styles.tipText,
                                        { color: theme.tipBoxText },
                                    ]}
                                >
                                    On tablet, selecting an item uses `router.replace` to prevent right-pane back
                                    stack buildup. Resize your browser window or rotate the screen to see it
                                    seamlessly transition to a mobile stack!
                                </Text>
                            </View>
                        </View>
                    </View>
                }
            />
        </>
    );
}

const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    card: {
        borderRadius: 20,
        padding: 32,
        maxWidth: 480,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconEmoji: {
        fontSize: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
    },
    tipBox: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        width: '100%',
    },
    tipTitle: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 12,
        lineHeight: 18,
    },
});
