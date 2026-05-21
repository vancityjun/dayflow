import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTaskStore } from '../store/taskStore';
import {
  formatDuration,
  formatInputTime,
  isSameLocalDay,
  parseTimeInput,
  sortByStartTime,
} from '../utils/time';
import { TaskFormView } from '../views/TaskFormView';

type CreateProps = NativeStackScreenProps<RootStackParamList, 'CreateTask'>;
type EditProps = NativeStackScreenProps<RootStackParamList, 'EditTask'>;

type Props = CreateProps | EditProps;

export function TaskFormScreen({ navigation, route }: Props) {
  const editingId = route.name === 'EditTask' ? route.params.taskId : undefined;
  const { tasks, addTask, updateTask, deleteTask, error, clearError, loading } = useTaskStore();
  const existing = tasks.find((task) => task.id === editingId);
  const dayTasks = existing
    ? sortByStartTime(
        tasks.filter((task) =>
          isSameLocalDay(new Date(task.startTime), new Date(existing.startTime)),
        ),
      )
    : [];
  const editingIndex = existing ? dayTasks.findIndex((task) => task.id === existing.id) : -1;
  const previousTask = editingIndex > 0 ? dayTasks[editingIndex - 1] : undefined;
  const nextTask = editingIndex >= 0 ? dayTasks[editingIndex + 1] : undefined;
  const dayLabel = existing
    ? new Date(existing.startTime)
        .toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
        .replace(',', ' ·')
    : undefined;

  const defaultStart = new Date();
  defaultStart.setMinutes(Math.ceil(defaultStart.getMinutes() / 5) * 5, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setMinutes(defaultEnd.getMinutes() + 45);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [start, setStart] = useState(
    existing ? formatInputTime(existing.startTime) : formatInputTime(defaultStart),
  );
  const [end, setEnd] = useState(
    existing ? formatInputTime(existing.endTime) : formatInputTime(defaultEnd),
  );
  const [status, setStatus] = useState(existing?.status ?? 'scheduled');

  const parsedStart = parseTimeInput(start, existing ? new Date(existing.startTime) : new Date());
  const parsedEnd = parseTimeInput(end, existing ? new Date(existing.endTime) : new Date());
  const duration =
    parsedStart && parsedEnd
      ? Math.round((new Date(parsedEnd).getTime() - new Date(parsedStart).getTime()) / 60000)
      : 0;

  const validation = useMemo(() => {
    if (!title.trim()) return 'Title is required.';
    if (!parsedStart || !parsedEnd) return 'Use 24-hour time like 09:30.';
    if (new Date(parsedEnd).getTime() <= new Date(parsedStart).getTime())
      return 'End time must be after start time.';
    return null;
  }, [title, parsedStart, parsedEnd]);

  const save = async () => {
    if (validation || !parsedStart || !parsedEnd) return;

    if (editingId) {
      await updateTask(editingId, { title, startTime: parsedStart, endTime: parsedEnd, status });
    } else {
      await addTask({ title, startTime: parsedStart, endTime: parsedEnd });
    }
    navigation.goBack();
  };

  const confirmDelete = () => {
    if (!editingId) return;
    Alert.alert('Delete this task?', "This can't be undone.", [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(editingId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <TaskFormView
      mode={editingId ? 'edit' : 'create'}
      title={title}
      start={start}
      end={end}
      status={status}
      durationLabel={formatDuration(duration)}
      dayLabel={dayLabel}
      previousTask={previousTask}
      nextTask={nextTask}
      validation={validation}
      loading={loading}
      error={error}
      onDismissError={clearError}
      onChangeTitle={setTitle}
      onChangeStart={setStart}
      onChangeEnd={setEnd}
      onChangeStatus={setStatus}
      onCancel={() => navigation.goBack()}
      onSave={save}
      onDelete={editingId ? confirmDelete : undefined}
    />
  );
}
