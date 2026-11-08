import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRightIcon, Kpi, Text } from 'panelui-native';
import { EMPLOYEES } from '@/data/employees';

const headcountTrend = [
  { v: 41 }, { v: 42 }, { v: 42 }, { v: 44 }, { v: 45 }, { v: 47 }, { v: EMPLOYEES.length + 40 },
];
const leaveTrend = [{ v: 3 }, { v: 5 }, { v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 6 }];

export default function Dashboard() {
  const router = useRouter();
  const onLeave = EMPLOYEES.filter((e) => e.status === 'on-leave').length;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 p-4"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-1">
        <Text size="xl" weight="semibold">Good evening, Admin</Text>
        <Text muted>Here is what is happening across the organisation.</Text>
      </View>

      {/* Tapping this card opens the employee split view. */}
      <Pressable
        onPress={() => router.push('/employees')}
        accessibilityRole="button"
        accessibilityLabel="Open employees"
      >
        <Kpi colorIndex={1} goodDirection="up">
          <Kpi.Header>
            <Kpi.Title>Employees</Kpi.Title>
            <Kpi.Actions>
              <ChevronRightIcon size={18} />
            </Kpi.Actions>
          </Kpi.Header>
          <Kpi.Content layout="inline">
            <Kpi.Stat>
              <Kpi.Value>{EMPLOYEES.length}</Kpi.Value>
              <Kpi.Trend value={4.2} caption="vs last quarter" />
            </Kpi.Stat>
            <Kpi.Chart data={headcountTrend} dataKey="v" inline />
          </Kpi.Content>
          <Kpi.Separator />
          <Kpi.Footer>
            <Text size="sm" muted>Tap to view and manage employees</Text>
          </Kpi.Footer>
        </Kpi>
      </Pressable>

      <Kpi colorIndex={2} goodDirection="none">
        <Kpi.Header>
          <Kpi.Title>On leave today</Kpi.Title>
        </Kpi.Header>
        <Kpi.Content layout="inline">
          <Kpi.Stat>
            <Kpi.Value>{onLeave}</Kpi.Value>
            <Kpi.Trend value={12.5} caption="vs last week" />
          </Kpi.Stat>
          <Kpi.Chart data={leaveTrend} dataKey="v" inline />
        </Kpi.Content>
      </Kpi>

      <Kpi colorIndex={3} goodDirection="down">
        <Kpi.Header>
          <Kpi.Title>Pending approvals</Kpi.Title>
        </Kpi.Header>
        <Kpi.Content>
          <Kpi.Value>5</Kpi.Value>
          <Kpi.Trend value={-16.7} caption="vs last week" />
        </Kpi.Content>
        <Kpi.Progress value={60} label="Cleared this week" showValueLabel />
      </Kpi>
    </ScrollView>
  );
}
