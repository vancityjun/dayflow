import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { CurrentTaskCard } from '../components/CurrentTaskCard';
import { TaskTimelineRow } from '../components/TaskTimelineRow';
import { colors } from '../theme/colors';
import type { Task } from '../types/task';

type Props = {
  weekday: string;
  dayMonth: string;
  tasks: Task[];
  currentTask?: Task;
  nextTask?: Task;
  loading: boolean;
  error: string | null;
  onDismissError: () => void;
  onRefresh: () => void;
  onPressTask: (taskId: string) => void;
  onCompleteCurrent?: () => void;
  onSkipCurrent?: () => void;
  onCreateTask: () => void;
  onOpenAiSchedule: () => void;
  onOpenSettings: () => void;
};

export function HomeScreenView({
  weekday,
  dayMonth,
  tasks,
  currentTask,
  nextTask,
  loading,
  error,
  onDismissError,
  onRefresh,
  onPressTask,
  onCompleteCurrent,
  onSkipCurrent,
  onCreateTask,
  onOpenAiSchedule,
  onOpenSettings,
}: Props) {
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const total = tasks.length || 1;

  return (
    <View className="flex-1 bg-paper">
      <ScrollView
        contentContainerClassName="pb-32 pt-16"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.ink} />
        }
      >
        <View className="px-6 pb-7">
          <View className="flex-row items-start justify-between gap-4">
            <View>
              <Text className="text-xs font-medium uppercase tracking-[2px] text-warm">
                {weekday}
              </Text>
              <Text className="mt-1.5 text-4xl font-bold tracking-tight text-ink">{dayMonth}</Text>
            </View>
            <View className="items-end gap-2">
              <Text className="text-lg font-medium text-warm">
                {completed}
                <Text className="text-warm2">/{tasks.length}</Text>
              </Text>
              <Button
                mode="outlined"
                onPress={onOpenSettings}
                textColor={colors.ink}
                style={{ borderRadius: 999, borderColor: colors.warm3 }}
                compact
              >
                Settings
              </Button>
            </View>
          </View>
          <View className="mt-5 h-0.5 overflow-hidden rounded-full bg-warm3">
            <View
              style={{ width: `${(completed / total) * 100}%` }}
              className="h-full rounded-full bg-ink"
            />
          </View>
        </View>

        <CurrentTaskCard
          task={currentTask}
          nextTask={nextTask}
          onComplete={onCompleteCurrent}
          onSkip={onSkipCurrent}
        />

        <View className="mt-6 flex-row items-baseline justify-between px-6 pb-1.5">
          <Text className="text-xs font-semibold uppercase tracking-[2px] text-warm">Today</Text>
          <Text className="text-xs font-medium text-warm2">{tasks.length} tasks</Text>
        </View>

        {tasks.length === 0 ? (
          <View className="px-6 py-8">
            <Text className="text-base font-medium text-ink">No tasks yet.</Text>
            <Text className="mt-2 text-sm leading-6 text-warm">
              Create a task manually or generate a schedule from a rough plan.
            </Text>
          </View>
        ) : (
          tasks.map((task, index) => (
            <TaskTimelineRow
              key={task.id}
              task={task}
              isCurrent={task.id === currentTask?.id}
              isFirst={index === 0}
              isLast={index === tasks.length - 1}
              onPress={() => onPressTask(task.id)}
            />
          ))
        )}

        <View className="flex-row items-center gap-2 px-6 py-8">
          <View className="h-px flex-1 bg-warm3" />
          <Text className="text-xs font-medium uppercase tracking-[2px] text-warm2">
            End of day
          </Text>
          <View className="h-px flex-1 bg-warm3" />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 gap-2 bg-paper px-5 pb-7 pt-3">
        <Button
          mode="contained"
          buttonColor={colors.ink}
          textColor={colors.white}
          onPress={onCreateTask}
          style={{ borderRadius: 999 }}
        >
          Create Task
        </Button>
        <Button
          mode="contained"
          buttonColor={colors.accent}
          textColor={colors.ink}
          onPress={onOpenAiSchedule}
          style={{ borderRadius: 999 }}
        >
          Generate Schedule with AI
        </Button>
      </View>

      <Snackbar visible={Boolean(error)} onDismiss={onDismissError} duration={4000}>
        {error}
      </Snackbar>
    </View>
  );
}
