import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import type { Task } from '../types/task';
import { colors } from '../theme/colors';
import {
  durationBetween,
  formatDisplayTime,
  formatDuration,
  getRemainingMinutes,
} from '../utils/time';

type Props = {
  task?: Task;
  nextTask?: Task;
  onComplete?: () => void;
  onSkip?: () => void;
};

export function CurrentTaskCard({ task, nextTask, onComplete, onSkip }: Props) {
  if (!task) {
    return (
      <View className="mx-4 mt-3 rounded-[30px] bg-ink px-6 py-7">
        <Text className="text-xs font-medium uppercase tracking-[2px] text-white/50">
          No active task
        </Text>
        <Text className="mt-4 text-3xl font-bold tracking-tight text-white">
          Your schedule is clear right now.
        </Text>
        {nextTask ? (
          <Text className="mt-5 text-sm font-medium text-white/70">
            Next: {nextTask.title} at {formatDisplayTime(nextTask.startTime)}
          </Text>
        ) : (
          <Text className="mt-5 text-sm font-medium text-white/60">
            Create a task or generate a schedule to start the day.
          </Text>
        )}
      </View>
    );
  }

  const total = durationBetween(task.startTime, task.endTime);
  const remaining = getRemainingMinutes(task);
  const elapsed = Math.max(0, total - remaining);
  const progress = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;

  return (
    <View className="mx-4 mt-3 rounded-[30px] bg-ink px-6 py-7">
      <View className="flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-accent" />
        <Text className="text-xs font-medium uppercase tracking-[2px] text-white/50">
          In progress
        </Text>
      </View>

      <Text className="mt-4 text-3xl font-bold tracking-tight text-white">{task.title}</Text>

      <View className="mt-7 flex-row items-end gap-5">
        <View className="flex-1">
          <Text className="text-xs font-medium uppercase tracking-[1.8px] text-white/40">
            Schedule
          </Text>
          <Text className="mt-1.5 text-base font-semibold text-white">
            {formatDisplayTime(task.startTime)} - {formatDisplayTime(task.endTime)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-medium uppercase tracking-[1.8px] text-white/40">
            Remaining
          </Text>
          <Text className="mt-1 text-2xl font-semibold text-accent">
            {formatDuration(remaining)}
          </Text>
        </View>
      </View>

      <View className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/10">
        <View
          style={{ width: `${progress}%`, backgroundColor: colors.accent }}
          className="h-full rounded-full"
        />
      </View>

      {nextTask ? (
        <View className="mt-6 flex-row items-center gap-2">
          <Text className="text-xs font-medium uppercase tracking-[1.8px] text-white/40">Next</Text>
          <Text numberOfLines={1} className="min-w-0 flex-1 text-sm font-medium text-white/80">
            {nextTask.title}
          </Text>
          <Text className="text-xs font-semibold text-white/60">
            {formatDisplayTime(nextTask.startTime)}
          </Text>
        </View>
      ) : null}

      <View className="mt-7 flex-row gap-2">
        <Button
          mode="contained"
          onPress={onComplete}
          buttonColor={colors.accent}
          textColor={colors.ink}
          style={{ flex: 1, borderRadius: 999 }}
        >
          Complete
        </Button>
        <Button
          mode="outlined"
          onPress={onSkip}
          textColor={colors.white}
          style={{ flex: 1, borderRadius: 999, borderColor: 'rgba(255,255,255,0.25)' }}
        >
          Skip
        </Button>
      </View>
    </View>
  );
}
