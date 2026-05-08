import { ScrollView, Text, View } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { ScreenTopBar } from '../components/ScreenTopBar';
import { colors } from '../theme/colors';
import type { GeneratedTaskPreview } from '../types/task';
import { durationBetween, formatDisplayTime } from '../utils/time';

type Props = {
  apiKeyPresent: boolean;
  roughPlan: string;
  startTime: string;
  generating: boolean;
  localError: string | null;
  storeError: string | null;
  loading: boolean;
  previewTasks: GeneratedTaskPreview[];
  canGenerate: boolean;
  canConfirmPreview: boolean;
  onDismissError: () => void;
  onChangeRoughPlan: (value: string) => void;
  onChangeStartTime: (value: string) => void;
  onGenerate: () => void;
  onOpenSettings: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onClearPreview: () => void;
  onChangePreviewTitle: (taskId: string, value: string) => void;
  onChangePreviewDuration: (taskId: string, value: string) => void;
};

export function AIScheduleView({
  apiKeyPresent,
  roughPlan,
  startTime,
  generating,
  localError,
  storeError,
  loading,
  previewTasks,
  canGenerate,
  canConfirmPreview,
  onDismissError,
  onChangeRoughPlan,
  onChangeStartTime,
  onGenerate,
  onOpenSettings,
  onCancel,
  onConfirm,
  onClearPreview,
  onChangePreviewTitle,
  onChangePreviewDuration,
}: Props) {
  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="pb-12 pt-14">
        <ScreenTopBar
          title="AI Schedule"
          saveLabel="Settings"
          onCancel={onCancel}
          onSave={onOpenSettings}
        />

        <View className="px-6 pt-6">
          <Text className="text-4xl font-bold tracking-tight text-ink">Plan your day</Text>
          <Text className="mt-2 text-base leading-6 text-warm">
            Tell DayFlow what you want to do. Review and edit the schedule before saving.
          </Text>

          {!apiKeyPresent ? (
            <View className="mt-5 rounded-2xl bg-warm4 p-4">
              <Text className="font-semibold text-ink">AI generation is disabled.</Text>
              <Text className="mt-1 text-sm leading-5 text-warm">
                Add your OpenAI API key in Settings to generate schedules.
              </Text>
              <Button
                mode="contained"
                buttonColor={colors.ink}
                textColor={colors.white}
                onPress={onOpenSettings}
                style={{ marginTop: 12, borderRadius: 999 }}
              >
                Open Settings
              </Button>
            </View>
          ) : null}

          <TextInput
            mode="outlined"
            label="Rough plan"
            value={roughPlan}
            onChangeText={onChangeRoughPlan}
            multiline
            numberOfLines={5}
            placeholder="study React, gym, groceries"
            style={{ marginTop: 24, minHeight: 120 }}
          />
          <TextInput
            mode="outlined"
            label="Schedule start time"
            value={startTime}
            onChangeText={onChangeStartTime}
            placeholder="09:00"
            keyboardType="numbers-and-punctuation"
            style={{ marginTop: 12 }}
          />
          <Button
            mode="contained"
            disabled={!canGenerate}
            loading={generating}
            onPress={onGenerate}
            buttonColor={colors.accent}
            textColor={colors.ink}
            style={{ marginTop: 16, borderRadius: 999 }}
          >
            Generate Schedule
          </Button>
        </View>

        {previewTasks.length > 0 ? (
          <View className="px-6 pt-8">
            <View className="mb-4 flex-row items-baseline justify-between">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-warm">
                Preview
              </Text>
              <Text className="text-xs text-warm2">{previewTasks.length} tasks</Text>
            </View>

            <View className="gap-4">
              {previewTasks.map((task) => (
                <View key={task.id} className="rounded-2xl bg-warm4 p-4">
                  <TextInput
                    mode="flat"
                    label="Title"
                    value={task.title}
                    onChangeText={(value) => onChangePreviewTitle(task.id, value)}
                  />
                  <TextInput
                    mode="flat"
                    label="Duration minutes"
                    value={String(task.durationMinutes)}
                    onChangeText={(value) => onChangePreviewDuration(task.id, value)}
                    keyboardType="number-pad"
                    style={{ marginTop: 8 }}
                  />
                  <Text className="mt-3 text-sm font-medium text-warm">
                    {formatDisplayTime(task.startTime)} - {formatDisplayTime(task.endTime)} ·{' '}
                    {durationBetween(task.startTime, task.endTime)}m
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-6 flex-row gap-3">
              <Button
                mode="outlined"
                onPress={onClearPreview}
                textColor={colors.ink}
                style={{ flex: 1, borderRadius: 999 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                disabled={!canConfirmPreview}
                loading={loading}
                onPress={onConfirm}
                buttonColor={colors.ink}
                textColor={colors.white}
                style={{ flex: 1, borderRadius: 999 }}
              >
                Confirm
              </Button>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <Snackbar
        visible={Boolean(localError || storeError)}
        onDismiss={onDismissError}
        duration={5000}
      >
        {localError || storeError}
      </Snackbar>
    </View>
  );
}
