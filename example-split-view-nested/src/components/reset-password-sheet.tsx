import { useState } from 'react';
import {
  BottomSheet,
  Button,
  createForm,
  Input,
  Switch,
  Field,
  useToast,
} from 'panelui-native';
import type { Employee } from '@/data/employees';

type Values = { password: string; confirm: string; forceChange: boolean };
const ResetForm = createForm<Values>();

type Props = {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ResetPasswordSheet({ employee, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const form = ResetForm.useForm({
    defaultValues: { password: '', confirm: '', forceChange: true },
    validate: (v) =>
      v.confirm && v.password !== v.confirm ? { confirm: 'Passwords do not match' } : {},
    onSubmit: async () => {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 800)); // pretend API call
      setSaving(false);
      onOpenChange(false);
      form.reset();
      toast.show({
        variant: 'success',
        label: 'Password reset',
        description: `A new password was set for ${employee.name}.`,
      });
    },
  });

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheet.Content size="half">
        <BottomSheet.Header
          title="Reset password"
          description={`Set a new password for ${employee.name}.`}
        />
        <BottomSheet.Body contentContainerClassName="gap-4 p-4">
          <ResetForm form={form}>
            <ResetForm.Field
              name="password"
              validate={(v) => (v.length >= 8 ? undefined : 'Use at least 8 characters')}
            >
              {(field) => (
                <Input
                  label="New password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  errorMessage={field.error}
                />
              )}
            </ResetForm.Field>

            <ResetForm.Field
              name="confirm"
              validate={(v, values) => (v === values.password ? undefined : 'Passwords do not match')}
            >
              {(field) => (
                <Input
                  label="Confirm password"
                  secureTextEntry
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  errorMessage={field.error}
                />
              )}
            </ResetForm.Field>

            <ResetForm.Field name="forceChange">
              {(field) => (
                <Field orientation="horizontal">
                  <Field.Content>
                    <Field.Title>Require change at next sign-in</Field.Title>
                    <Field.Description>They must choose their own password.</Field.Description>
                  </Field.Content>
                  <Switch value={field.value} onValueChange={field.onChange} />
                </Field>
              )}
            </ResetForm.Field>
          </ResetForm>
        </BottomSheet.Body>
        <BottomSheet.Footer className="p-4">
          <Button fullWidth loading={saving} onPress={form.handleSubmit}>
            Reset password
          </Button>
        </BottomSheet.Footer>
      </BottomSheet.Content>
    </BottomSheet>
  );
}
