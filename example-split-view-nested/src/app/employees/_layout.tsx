import { SplitView } from 'expo-split-view';
import { EmployeeList } from '@/components/employee-list';

/**
 * Tablet / wide: EmployeeList on the left, an Expo Router <Stack /> on the right.
 * Phone: a normal full-screen stack. Every route in this folder
 * (index, [id], leave) renders in the right pane.
 */
export default function EmployeesLayout() {
  return (
    <SplitView
      masterList={<EmployeeList />}
      masterListWidth={340}
      safeAreaEdges={['left', 'right']}
      leftHeader
      leftHeaderTitle="Employees"
    />
  );
}
