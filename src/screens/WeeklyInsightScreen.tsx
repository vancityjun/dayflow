import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import type { RootStackParamList } from '../navigation/types';
import { getOpenAIApiKey } from '../services/apiKey';
import { useTaskStore } from '../store/taskStore';
import { buildWeeklyInsightSummary } from '../utils/weeklyInsight';
import { WeeklyInsightView } from '../views/WeeklyInsightView';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyInsight'>;

export function WeeklyInsightScreen({ navigation }: Props) {
  const tasks = useTaskStore((state) => state.tasks);
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(false);

  useEffect(() => {
    getOpenAIApiKey()
      .then((key) => setAiInsightsEnabled(Boolean(key)))
      .catch(() => setAiInsightsEnabled(false));
  }, []);

  // TODO: Replace this local summary builder with the real backend/OpenAI insight payload
  // once that integration exists. Keep WeeklyInsightView consuming the same view-model shape.
  const summary = buildWeeklyInsightSummary(tasks);

  return (
    <WeeklyInsightView
      summary={summary}
      aiInsightsEnabled={aiInsightsEnabled}
      onOptimizeTomorrow={() => navigation.navigate('AISchedule')}
    />
  );
}
