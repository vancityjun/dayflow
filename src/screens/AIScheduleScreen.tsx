import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getOpenAIApiKey } from '../services/apiKey';
import { generateScheduleFromText } from '../services/openai';
import { useTaskStore } from '../store/taskStore';
import { makeSequentialPreview } from '../utils/scheduling';
import { addMinutes, formatInputTime, parseTimeInput } from '../utils/time';
import type { GeneratedTaskPreview } from '../types/task';
import { AIScheduleView } from '../views/AIScheduleView';

type Props = NativeStackScreenProps<RootStackParamList, 'AISchedule'>;
type TaskInputRow = {
  id: string;
  title: string;
};

function createTaskInputRow(title = ''): TaskInputRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    title,
  };
}

export function AIScheduleScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [taskRows, setTaskRows] = useState<TaskInputRow[]>(() => [createTaskInputRow()]);
  const [startTime, setStartTime] = useState(() => {
    const date = new Date();
    date.setMinutes(Math.ceil(date.getMinutes() / 5) * 5, 0, 0);
    return formatInputTime(date);
  });
  const [generating, setGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    previewTasks,
    setPreviewTasks,
    updatePreviewTask,
    clearPreviewTasks,
    confirmPreviewTasks,
    error,
    clearError,
    loading,
  } = useTaskStore();

  useEffect(() => {
    if (!isFocused) return;

    getOpenAIApiKey()
      .then(setApiKey)
      .catch(() => setApiKey(null));
  }, [isFocused]);

  useEffect(() => {
    return () => clearPreviewTasks();
  }, [clearPreviewTasks]);

  const parsedStartTime = parseTimeInput(startTime);
  const taskTitles = taskRows.map((task) => task.title.trim()).filter(Boolean);
  const generateDisabledReason = getGenerateDisabledReason({
    apiKeyPresent: Boolean(apiKey),
    taskCount: taskTitles.length,
    startTimeValid: Boolean(parsedStartTime),
    generating,
  });
  const canGenerate = !generateDisabledReason;
  const canConfirmPreview =
    previewTasks.length > 0 &&
    previewTasks.every((task) => task.title.trim() && task.durationMinutes >= 10);

  const generate = async () => {
    const latestApiKey = await getOpenAIApiKey();
    setApiKey(latestApiKey);

    if (!latestApiKey) {
      setLocalError('Add your OpenAI API key in Settings first.');
      return;
    }
    if (!parsedStartTime) {
      setLocalError('Use 24-hour start time like 09:00.');
      return;
    }

    setGenerating(true);
    setLocalError(null);
    try {
      const generated = await generateScheduleFromText(latestApiKey, taskTitles);
      setPreviewTasks(makeSequentialPreview(generated, parsedStartTime));
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to generate a schedule.');
    } finally {
      setGenerating(false);
    }
  };

  const updateDuration = (taskId: string, rawValue: string) => {
    const duration = Math.max(10, Number(rawValue.replace(/[^0-9]/g, '')) || 10);
    const updated = previewTasks.map((task) =>
      task.id === taskId ? { ...task, durationMinutes: duration } : task,
    );
    setPreviewTasks(reflowPreviewTasks(updated));
  };

  const updateTaskRow = (rowId: string, title: string) => {
    setTaskRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, title } : row)));
  };

  const addTaskRow = () => {
    setTaskRows((rows) => [...rows, createTaskInputRow()]);
  };

  const removeTaskRow = (rowId: string) => {
    setTaskRows((rows) => {
      const nextRows = rows.filter((row) => row.id !== rowId);
      return nextRows.length > 0 ? nextRows : [createTaskInputRow()];
    });
  };

  const confirm = async () => {
    await confirmPreviewTasks();
    navigation.navigate('Home');
  };

  return (
    <AIScheduleView
      apiKeyPresent={Boolean(apiKey)}
      taskRows={taskRows}
      startTime={startTime}
      generating={generating}
      localError={localError}
      storeError={error}
      loading={loading}
      previewTasks={previewTasks}
      canGenerate={canGenerate}
      generateStatus={generateDisabledReason ?? 'Ready to generate a schedule.'}
      canConfirmPreview={canConfirmPreview}
      onDismissError={() => {
        setLocalError(null);
        clearError();
      }}
      onChangeTaskTitle={updateTaskRow}
      onAddTaskRow={addTaskRow}
      onRemoveTaskRow={removeTaskRow}
      onChangeStartTime={setStartTime}
      onGenerate={generate}
      onOpenSettings={() => navigation.navigate('Settings')}
      onCancel={() => navigation.goBack()}
      onConfirm={confirm}
      onClearPreview={clearPreviewTasks}
      onChangePreviewTitle={(taskId, title) => updatePreviewTask(taskId, { title })}
      onChangePreviewDuration={updateDuration}
    />
  );
}

function getGenerateDisabledReason({
  apiKeyPresent,
  taskCount,
  startTimeValid,
  generating,
}: {
  apiKeyPresent: boolean;
  taskCount: number;
  startTimeValid: boolean;
  generating: boolean;
}): string | null {
  if (generating) return 'Generating your schedule...';
  if (!apiKeyPresent) return 'Add and verify your OpenAI API key in Settings first.';
  if (taskCount === 0) return 'Add at least one task to schedule.';
  if (!startTimeValid) return 'Use a valid 24-hour start time like 09:00.';
  return null;
}

function reflowPreviewTasks(tasks: GeneratedTaskPreview[]): GeneratedTaskPreview[] {
  if (tasks.length === 0) return tasks;

  let cursor = tasks[0].startTime;
  return tasks.map((task) => {
    const start = cursor;
    const end = addMinutes(start, task.durationMinutes);
    cursor = addMinutes(end, 5);
    return { ...task, startTime: start, endTime: end };
  });
}
