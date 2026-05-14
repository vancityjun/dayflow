import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  return (
    <SafeAreaView className="flex-1 bg-paper" edges={['top']}>
      <ScrollView
        contentContainerClassName="pb-28 pt-3"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.ink} />
        }
      >
        <View className="flex-row items-start justify-between gap-4 px-4 pb-7">
          <View>
            <Text className="text-[11px] font-normal uppercase text-warm">{weekday}</Text>
            <Text className="mt-1.5 text-4xl font-bold tracking-[-1.4px] text-ink">{dayMonth}</Text>
          </View>
          <Button mode="text" compact onPress={onOpenSettings} textColor={colors.warm}>
            Settings
          </Button>
        </View>

        <CurrentTaskCard
          task={currentTask}
          nextTask={nextTask}
          onComplete={onCompleteCurrent}
          onSkip={onSkipCurrent}
        />

        <View className="mt-7 flex-row items-baseline justify-between px-4 pb-1.5">
          <Text className="text-[11px] font-normal uppercase tracking-[1.5px] text-ink">Today</Text>
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
    </SafeAreaView>
  );
}
