import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useTaskStore } from '../store/taskStore';
import { buildWeeklyInsightSummary } from '../utils/weeklyInsight';
import { WeeklyInsightView } from '../views/WeeklyInsightView';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyInsight'>;

export function WeeklyInsightScreen({ navigation }: Props) {
  const tasks = useTaskStore((state) => state.tasks);

  // TODO: Replace this local summary builder with the real backend/OpenAI insight payload
  // once that integration exists. Keep WeeklyInsightView consuming the same view-model shape.
  const summary = buildWeeklyInsightSummary(tasks);

  return (
    <WeeklyInsightView
      summary={summary}
      onOptimizeTomorrow={() => navigation.navigate('AISchedule')}
    />
  );
}
