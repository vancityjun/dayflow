import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTaskStore } from '../store/taskStore';
import { formatDisplayDate } from '../utils/time';
import { HomeScreenView } from '../views/HomeScreenView';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [tick, setTick] = useState(Date.now());
  const {
    loading,
    error,
    clearError,
    reloadTasks,
    todayTasks,
    currentTask,
    upcomingTasks,
    markCompleted,
    markSkipped,
  } = useTaskStore();

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const date = formatDisplayDate(new Date(tick));
  const tasks = todayTasks();
  const current = currentTask();
  const next = upcomingTasks()[0];

  return (
    <HomeScreenView
      weekday={date.weekday}
      dayMonth={date.dayMonth}
      tasks={tasks}
      currentTask={current}
      nextTask={next}
      loading={loading}
      error={error}
      onDismissError={clearError}
      onRefresh={reloadTasks}
      onPressTask={(taskId) => navigation.navigate('EditTask', { taskId })}
      onCompleteCurrent={current ? () => markCompleted(current.id) : undefined}
      onSkipCurrent={current ? () => markSkipped(current.id) : undefined}
      onCreateTask={() => navigation.navigate('CreateTask')}
      onOpenAiSchedule={() => navigation.navigate('AISchedule')}
      onOpenSettings={() => navigation.navigate('Settings')}
    />
  );
}
