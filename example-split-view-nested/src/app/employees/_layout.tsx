import { SplitView } from 'expo-split-view';
import { EmployeeList } from '@/components/employee-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tablet / wide: EmployeeList on the left, an Expo Router <Stack /> on the right.
 * Phone: a normal full-screen stack. Every route in this folder
 * (index, [id], leave) renders in the right pane.
 */
export default function EmployeesLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SplitView
      masterList={<EmployeeList />}
      masterListWidth={340}
      safeAreaEdges={[]}
      leftHeader
      leftHeaderTitle="Employees"
      masterStyle={{ paddingLeft: insets.left }}
    />
  );
}
