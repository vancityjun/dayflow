import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  defaultOnboardingAnswers,
  getVisibleOnboardingSteps,
  onboardingSteps,
} from '../features/onboarding';
import { getDarkModeEnabled } from '../services/appearance';
import { getOnboardingProfile, saveOnboardingProfile } from '../services/onboardingProfile';
import { OnboardingView, type OnboardingAnswer } from '../views/OnboardingView';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation, route }: Props) {
  const editMode = route.params?.mode === 'edit';
  const [currentStepId, setCurrentStepId] = useState(onboardingSteps[0].id);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] =
    useState<Record<string, OnboardingAnswer>>(defaultOnboardingAnswers);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    getDarkModeEnabled()
      .then(setDarkModeEnabled)
      .catch(() => setDarkModeEnabled(false));
  }, []);

  useEffect(() => {
    if (!editMode) return;

    getOnboardingProfile()
      .then((profile) => {
        if (!profile) return;
        setAnswers({ ...defaultOnboardingAnswers, ...profile });
      })
      .catch(() => {
        setAnswers(defaultOnboardingAnswers);
      });
  }, [editMode]);

  const visibleSteps = getVisibleOnboardingSteps(answers);
  const stepIndex = Math.max(
    0,
    visibleSteps.findIndex((step) => step.id === currentStepId),
  );
  const step = visibleSteps[stepIndex] ?? visibleSteps[0];

  return (
    <OnboardingView
      steps={visibleSteps}
      stepIndex={stepIndex}
      selectedValue={answers[step.id]}
      completed={completed}
      darkModeEnabled={darkModeEnabled}
      onSelect={(value) => setAnswers((current) => ({ ...current, [step.id]: value }))}
      onBack={() => {
        const previousStep = visibleSteps[stepIndex - 1];
        if (!previousStep) return;
        setCurrentStepId(previousStep.id);
      }}
      onNext={async () => {
        if (completed) {
          navigation.navigate('Home');
          return;
        }
        const nextStep = visibleSteps[stepIndex + 1];
        if (!nextStep) {
          await saveOnboardingProfile(answers);
          setCompleted(true);
          return;
        }
        setCurrentStepId(nextStep.id);
      }}
    />
  );
}
