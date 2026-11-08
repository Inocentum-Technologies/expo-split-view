import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SplitView } from 'expo-split-view';
import { Button, DatePicker, Select, Text, Textarea, useToast, type DateRange } from 'panelui-native';
import { LEAVE_TYPES, getEmployee } from '@/data/employees';

type Range = DateRange;

const fmt = (d?: Date) =>
  d ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const daysBetween = (r?: Range) =>
  r?.from && r?.to ? Math.round((r.to.getTime() - r.from.getTime()) / 86_400_000) + 1 : 0;

/**
 * Pushed onto the right pane's stack from the details screen, so on a tablet
 * it opens in the right pane and the employee list stays visible on the left.
 */
export default function RequestLeave() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const employee = getEmployee(id);

  const [type, setType] = useState<string>();
  const [range, setRange] = useState<Range>();
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<{ type?: string; range?: string }>({});
  const [saving, setSaving] = useState(false);

  const days = daysBetween(range);

  const submit = async () => {
    const next = {
      type: type ? undefined : 'Choose a leave type',
      range: range?.from && range?.to ? undefined : 'Pick a start and end date',
    };
    setErrors(next);
    if (next.type || next.range) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // pretend API call
    setSaving(false);
    toast.show({
      variant: 'success',
      label: 'Leave requested',
      description: `${days} day${days > 1 ? 's' : ''} for ${employee?.name}. Sent for approval.`,
    });
    router.back();
  };

  return (
    <SplitView.Detail
      backOptions={{
        title: 'Request leave',
        fallbackRoute: `/employees/${id}`,
      }}
    >
      <ScrollView contentContainerClassName="gap-5 p-4" keyboardShouldPersistTaps="handled">
        <View className="gap-1">
          <Text size="lg" weight="semibold">{employee?.name}</Text>
          <Text muted>{employee?.leaveBalance} days of leave remaining</Text>
        </View>

        <View className="gap-2">
          <Text size="sm" weight="semibold">Leave type</Text>
          <Select value={type} onValueChange={setType} placeholder="Select a leave type">
            {LEAVE_TYPES.map((t) => (
              <Select.Item key={t.value} value={t.value} label={t.label} />
            ))}
          </Select>
          {errors.type ? <Text size="sm" className="text-destructive">{errors.type}</Text> : null}
        </View>

        <View className="gap-2">
          <Text size="sm" weight="semibold">Dates</Text>
          <DatePicker
            mode="range"
            selected={range}
            onSelect={setRange}
            minDate={new Date()}
            placeholder="Pick start and end date"
            format={(r) => (r?.from ? `${fmt(r.from)}${r.to ? ` – ${fmt(r.to)}` : ''}` : '')}
          />
          {errors.range ? <Text size="sm" className="text-destructive">{errors.range}</Text> : null}
          {days > 0 ? <Text size="sm" muted>{days} day{days > 1 ? 's' : ''} requested</Text> : null}
        </View>

        <Textarea
          label="Reason"
          description="Optional"
          rows={4}
          maxLength={280}
          showCount
          value={reason}
          onChangeText={setReason}
          avoidKeyboard
        />

        <View className="gap-3">
          <Button fullWidth loading={saving} onPress={submit}>Submit request</Button>
          <Button fullWidth variant="ghost" onPress={() => router.back()}>Cancel</Button>
        </View>
      </ScrollView>
    </SplitView.Detail>
  );
}
