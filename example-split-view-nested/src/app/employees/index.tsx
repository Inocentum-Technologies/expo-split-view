import { SplitView } from 'expo-split-view';
import { EmployeeList } from '@/components/employee-list';
import { Stack } from 'expo-router';

/**
 * Tablet: placeholder in the right pane.
 * Phone: the employee list itself (this is the first screen of the stack).
 */
export default function EmployeesIndex() {

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Employees" }} />
      <SplitView.Placeholder
        masterList={<EmployeeList />}
        placeholderText="Select an employee to view their details"
      />
    </>
  );
}
