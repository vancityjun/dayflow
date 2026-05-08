import { useEffect, useState } from 'react';
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

export function AIScheduleScreen({ navigation }: Props) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [roughPlan, setRoughPlan] = useState('');
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
    getOpenAIApiKey()
      .then(setApiKey)
      .catch(() => setApiKey(null));
    return () => clearPreviewTasks();
  }, [clearPreviewTasks]);

  const parsedStartTime = parseTimeInput(startTime);
  const canGenerate = Boolean(apiKey && roughPlan.trim() && parsedStartTime && !generating);
  const canConfirmPreview =
    previewTasks.length > 0 &&
    previewTasks.every((task) => task.title.trim() && task.durationMinutes >= 10);

  const generate = async () => {
    if (!apiKey) {
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
      const generated = await generateScheduleFromText(apiKey, roughPlan);
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

  const confirm = async () => {
    await confirmPreviewTasks();
    navigation.navigate('Home');
  };

  return (
    <AIScheduleView
      apiKeyPresent={Boolean(apiKey)}
      roughPlan={roughPlan}
      startTime={startTime}
      generating={generating}
      localError={localError}
      storeError={error}
      loading={loading}
      previewTasks={previewTasks}
      canGenerate={canGenerate}
      canConfirmPreview={canConfirmPreview}
      onDismissError={() => {
        setLocalError(null);
        clearError();
      }}
      onChangeRoughPlan={setRoughPlan}
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
