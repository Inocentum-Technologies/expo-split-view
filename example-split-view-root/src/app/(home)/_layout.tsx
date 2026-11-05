import { SplitView } from 'expo-split-view';
import { MasterList } from '@/components/MasterList';
import { useTheme } from '@/hooks/use-theme';

export default function HomeLayout() {
    const theme = useTheme();

    return (
        <SplitView
            masterList={<MasterList />}
            masterListWidth={340}
            tabletBreakpoint={768}
            safeAreaEdges={['left', 'right']}
            stackScreenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: theme.headerBg },
                headerTitleStyle: { fontWeight: '700', fontSize: 17, color: theme.text },
                headerTintColor: theme.primary,
                headerShadowVisible: false,
                animation: 'none',
            }}
        />
    );
}
