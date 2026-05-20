import { useEffect, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import {
  defaultOnboardingAnswers,
  getVisibleOnboardingSteps,
  onboardingSteps,
} from '../features/onboarding';
import { getOnboardingProfile, saveOnboardingProfile } from '../services/onboardingProfile';
import { OnboardingView, type OnboardingAnswer } from '../views/OnboardingView';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation, route }: Props) {
  const editMode = route.params?.mode === 'edit';
  const [currentStepId, setCurrentStepId] = useState(onboardingSteps[0].id);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] =
    useState<Record<string, OnboardingAnswer>>(defaultOnboardingAnswers);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!editMode) {
      setLoadingProfile(false);
      return;
    }

    let mounted = true;
    setLoadingProfile(true);
    getOnboardingProfile()
      .then((profile) => {
        if (!mounted) return;
        if (!profile) return;
        setAnswers({ ...defaultOnboardingAnswers, ...profile });
      })
      .catch(() => {
        if (!mounted) return;
        setAnswers(defaultOnboardingAnswers);
      })
      .finally(() => {
        if (mounted) setLoadingProfile(false);
      });

    return () => {
      mounted = false;
    };
  }, [editMode]);

  if (loadingProfile) return null;

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
      saving={saving}
      errorMessage={saveError ?? undefined}
      onSelect={(value) => {
        setSaveError(null);
        setAnswers((current) => ({ ...current, [step.id]: value }));
      }}
      onBack={() => {
        setSaveError(null);
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
          if (savingRef.current) return;
          savingRef.current = true;
          setSaving(true);
          try {
            setSaveError(null);
            await saveOnboardingProfile(answers);
            setCompleted(true);
          } catch {
            setSaveError("Couldn't save your onboarding profile. Please try again.");
          } finally {
            savingRef.current = false;
            setSaving(false);
          }
          return;
        }
        setSaveError(null);
        setCurrentStepId(nextStep.id);
      }}
    />
  );
}
