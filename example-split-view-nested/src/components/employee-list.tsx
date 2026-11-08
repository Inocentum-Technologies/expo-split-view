import { FlatList } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useSplitView } from 'expo-split-view';
import { Avatar, Badge, ChevronRightIcon, Item } from 'panelui-native';
import { EMPLOYEES, STATUS_LABEL, STATUS_VARIANT, initials } from '@/data/employees';

/**
 * The master list. SplitView renders this in the left pane on tablets, and
 * SplitView.Placeholder renders it as the index screen on phones.
 */
export function EmployeeList() {
  // Works from outside the screens, so the row stays highlighted in the left pane.
  const { id: selectedId } = useGlobalSearchParams<{ id?: string }>();
  // replace() on tablets (no right-pane history build-up), push() on phones.
  const { navigate } = useSplitView();

  return (
    <FlatList
      data={EMPLOYEES}
      keyExtractor={(e) => e.id}
      contentContainerClassName="gap-1 p-2"
      renderItem={({ item }) => (
        <Item
          variant={item.id === selectedId ? 'muted' : 'default'}
          onPress={() => navigate(`/employees/${item.id}`)}
        >
          <Item.Media>
            <Avatar fallback={initials(item.name)} />
          </Item.Media>
          <Item.Content>
            <Item.Title>{item.name}</Item.Title>
            <Item.Description>{item.role}</Item.Description>
          </Item.Content>
          <Item.Actions>
            <Badge variant={STATUS_VARIANT[item.status]} size="sm">
              {STATUS_LABEL[item.status]}
            </Badge>
            <ChevronRightIcon size={16} />
          </Item.Actions>
        </Item>
      )}
    />
  );
}
