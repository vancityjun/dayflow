import { useState } from 'react';
import {
  defaultOnboardingAnswers,
  getVisibleOnboardingSteps,
  onboardingSteps,
} from '../features/onboarding';
import { OnboardingView, type OnboardingAnswer } from '../views/OnboardingView';

type Props = {
  darkModeEnabled?: boolean;
  onExit: () => void;
};

export function OnboardingPreview({ darkModeEnabled = false, onExit }: Props) {
  const [currentStepId, setCurrentStepId] = useState(onboardingSteps[0].id);
  const [answers, setAnswers] =
    useState<Record<string, OnboardingAnswer>>(defaultOnboardingAnswers);
  const [completed, setCompleted] = useState(false);
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
      onSelect={(value) => {
        setAnswers((current) => ({ ...current, [step.id]: value }));
      }}
      onBack={() => {
        if (completed) {
          setCompleted(false);
          setCurrentStepId(visibleSteps[visibleSteps.length - 1].id);
          return;
        }
        const previousStep = visibleSteps[stepIndex - 1];
        if (!previousStep) {
          onExit();
          return;
        }
        setCurrentStepId(previousStep.id);
      }}
      onNext={() => {
        if (completed) {
          onExit();
          return;
        }
        const nextStep = visibleSteps[stepIndex + 1];
        if (!nextStep) {
          setCompleted(true);
          return;
        }
        setCurrentStepId(nextStep.id);
      }}
    />
  );
}
