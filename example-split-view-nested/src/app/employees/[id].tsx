import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SplitView } from 'expo-split-view';
import { Avatar, Badge, Button, Card, EmptyState, Item, Text } from 'panelui-native';
import { ResetPasswordSheet } from '@/components/reset-password-sheet';
import { STATUS_LABEL, STATUS_VARIANT, getEmployee, initials } from '@/data/employees';

export default function EmployeeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const employee = getEmployee(id);
  const [resetOpen, setResetOpen] = useState(false);

  if (!employee) {
    return (
      <SplitView.Detail backOptions={{ fallbackRoute: '/employees', title: 'Employee' }}>
        <EmptyState>
          <EmptyState.Header>
            <EmptyState.Title>Employee not found</EmptyState.Title>
          </EmptyState.Header>
        </EmptyState>
      </SplitView.Detail>
    );
  }

  const rows: [string, string][] = [
    ['Email', employee.email],
    ['Phone', employee.phone],
    ['Department', employee.department],
    ['Location', employee.location],
    ['Joined', employee.joined],
    ['Leave balance', `${employee.leaveBalance} days`],
  ];

  return (
    <SplitView.Detail
      backOptions={{ fallbackRoute: '/employees', title: employee.name }}
    >
      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="items-center gap-2 py-2">
          <Avatar size="xl" fallback={initials(employee.name)} />
          <Text size="xl" weight="semibold">{employee.name}</Text>
          <Text muted>{employee.role}</Text>
          <Badge variant={STATUS_VARIANT[employee.status]}>{STATUS_LABEL[employee.status]}</Badge>
        </View>

        <Card>
          <Card.Header>
            <Card.Title>Details</Card.Title>
          </Card.Header>
          <Card.Content>
            <Item.Group>
              {rows.map(([label, value], i) => (
                <View key={label}>
                  {i > 0 && <Item.Separator />}
                  <Item size="sm">
                    <Item.Content>
                      <Item.Description>{label}</Item.Description>
                      <Item.Title>{value}</Item.Title>
                    </Item.Content>
                  </Item>
                </View>
              ))}
            </Item.Group>
          </Card.Content>
        </Card>

        <View className="gap-3">
          {/* A new screen, pushed onto the right pane's stack. */}
          <Button
            fullWidth
            onPress={() =>
              router.push({ pathname: '/employees/leave', params: { id: employee.id } })
            }
          >
            Request leave
          </Button>
          {/* A BottomSheet, not a screen. */}
          <Button fullWidth variant="outline" onPress={() => setResetOpen(true)}>
            Reset password
          </Button>
        </View>
      </ScrollView>

      <ResetPasswordSheet employee={employee} open={resetOpen} onOpenChange={setResetOpen} />
    </SplitView.Detail>
  );
}
