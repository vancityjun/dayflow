import { ScrollView, Text, View } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { ScreenTopBar } from '../components/ScreenTopBar';
import { colors } from '../theme/colors';
import type { TaskStatus } from '../types/task';

type Props = {
  mode: 'create' | 'edit';
  title: string;
  start: string;
  end: string;
  status: TaskStatus;
  durationLabel: string;
  validation: string | null;
  loading: boolean;
  error: string | null;
  onDismissError: () => void;
  onChangeTitle: (value: string) => void;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  onChangeStatus: (value: TaskStatus) => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete?: () => void;
};

export function TaskFormView({
  mode,
  title,
  start,
  end,
  status,
  durationLabel,
  validation,
  loading,
  error,
  onDismissError,
  onChangeTitle,
  onChangeStart,
  onChangeEnd,
  onChangeStatus,
  onCancel,
  onSave,
  onDelete,
}: Props) {
  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="pb-12 pt-14">
        <ScreenTopBar
          title={mode === 'edit' ? 'Edit Task' : 'New Task'}
          canSave={!validation && !loading}
          onCancel={onCancel}
          onSave={onSave}
        />

        <View className="px-6 pb-7 pt-6">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-warm">
            Task
          </Text>
          <TextInput
            mode="flat"
            value={title}
            onChangeText={onChangeTitle}
            placeholder="Enter task name"
            underlineColor={colors.warm3}
            activeUnderlineColor={colors.ink}
            style={{ backgroundColor: colors.paper, fontSize: 28, fontWeight: '700' }}
          />
        </View>

        <View className="px-6">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-warm">
            Schedule
          </Text>
          <View className="gap-3">
            <TextInput
              mode="outlined"
              label="Start time"
              value={start}
              onChangeText={onChangeStart}
              placeholder="09:00"
              keyboardType="numbers-and-punctuation"
            />
            <TextInput
              mode="outlined"
              label="End time"
              value={end}
              onChangeText={onChangeEnd}
              placeholder="10:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <Text className="mt-3 text-sm font-medium text-warm">Duration: {durationLabel}</Text>
          {validation ? <Text className="mt-3 text-sm text-danger">{validation}</Text> : null}
        </View>

        {mode === 'edit' ? (
          <View className="px-6 pt-7">
            <Text className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-warm">
              State
            </Text>
            <View className="flex-row rounded-full bg-warm4 p-1">
              {(['scheduled', 'skipped', 'completed'] as const).map((option) => (
                <Button
                  key={option}
                  mode={status === option ? 'contained' : 'text'}
                  onPress={() => onChangeStatus(option)}
                  buttonColor={status === option ? colors.paper : 'transparent'}
                  textColor={status === option ? colors.ink : colors.warm}
                  style={{ flex: 1, borderRadius: 999 }}
                >
                  {option === 'scheduled' ? 'Active' : option}
                </Button>
              ))}
            </View>
            {onDelete ? (
              <Button
                mode="text"
                textColor={colors.danger}
                onPress={onDelete}
                style={{ marginTop: 24 }}
              >
                Delete task
              </Button>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <Snackbar visible={Boolean(error)} onDismiss={onDismissError} duration={4000}>
        {error}
      </Snackbar>
    </View>
  );
}
