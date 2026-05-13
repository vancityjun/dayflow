import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../theme/colors';

const timeOptions = [
  '4:00 AM',
  '4:30 AM',
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
] as const;

const focusOptions = [
  'Early morning',
  'Mid-morning',
  'Early afternoon',
  'Late afternoon',
  'Evening',
  'It varies',
] as const;

const structureOptions = [
  'Tightly scheduled',
  'Loose blocks',
  'Flexible / flow',
  'React as things come',
] as const;

type Props = {
  scenarioId: string;
  onBack: () => void;
};

export function OnboardingPreview({ scenarioId, onBack }: Props) {
  const [wakeTime, setWakeTime] = useState('7:00 AM');
  const [workStart, setWorkStart] = useState('9:00 AM');
  const [peakFocus, setPeakFocus] = useState<(typeof focusOptions)[number]>('Mid-morning');
  const [scheduleStyle, setScheduleStyle] =
    useState<(typeof structureOptions)[number]>('Loose blocks');

  if (scenarioId === 'onboarding-wake-time') {
    return (
      <QuestionPreview
        step={1}
        title="What time do you usually wake up?"
        helper={`Wake-up time: ${wakeTime}`}
        ctaLabel="Next"
      >
        <TimeOptionList value={wakeTime} onChange={setWakeTime} />
      </QuestionPreview>
    );
  }

  if (scenarioId === 'onboarding-work-start') {
    return (
      <QuestionPreview
        step={2}
        title="When do you usually start working?"
        helper={`Work start: ${workStart}`}
        ctaLabel="Next"
        onBack={onBack}
      >
        <TimeOptionList value={workStart} onChange={setWorkStart} />
      </QuestionPreview>
    );
  }

  if (scenarioId === 'onboarding-peak-focus') {
    return (
      <QuestionPreview step={3} title="When are you most focused?" ctaLabel="Next" onBack={onBack}>
        <OptionList
          options={focusOptions}
          value={peakFocus}
          onChange={(value) => setPeakFocus(value)}
        />
      </QuestionPreview>
    );
  }

  if (scenarioId === 'onboarding-structure') {
    return (
      <QuestionPreview
        step={4}
        title="How do you prefer to structure your day?"
        ctaLabel="Next"
        onBack={onBack}
      >
        <OptionList
          options={structureOptions}
          value={scheduleStyle}
          onChange={(value) => setScheduleStyle(value)}
        />
      </QuestionPreview>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-paper px-6">
      <Text className="text-lg font-semibold text-ink">Unknown onboarding preview.</Text>
    </View>
  );
}

function QuestionPreview({
  step,
  title,
  helper,
  ctaLabel,
  onBack,
  children,
}: {
  step: number;
  title: string;
  helper?: string;
  ctaLabel: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="flex-grow px-6 pb-28 pt-16">
        <StepHeader step={step} title={title} onBack={onBack} />
        <View className="mt-8">{children}</View>
        {helper ? <Text className="mt-5 text-center text-sm text-warm">{helper}</Text> : null}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-paper px-6 pb-8 pt-4">
        <Button
          mode="contained"
          buttonColor={colors.ink}
          textColor={colors.white}
          onPress={onBack}
          style={{ borderRadius: 999 }}
        >
          {ctaLabel}
        </Button>
      </View>
    </View>
  );
}

function StepHeader({ step, title, onBack }: { step: number; title: string; onBack?: () => void }) {
  return (
    <>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          className={`h-9 w-9 items-center justify-center rounded-full ${
            onBack ? 'bg-warm3' : 'opacity-0'
          }`}
        >
          <Text className="text-xl text-ink2">‹</Text>
        </Pressable>
        <View className="flex-1 flex-row gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              className={`h-[3px] flex-1 rounded-full ${index < step ? 'bg-ink' : 'bg-warm3'}`}
            />
          ))}
        </View>
        <Text className="text-xs font-medium tracking-[1px] text-warm">{step}/4</Text>
      </View>

      <Text className="mt-10 text-[11px] font-medium uppercase tracking-[3px] text-warm">
        Question {step}
      </Text>
      <Text className="mt-3 text-[28px] font-bold leading-9 text-ink">{title}</Text>
    </>
  );
}

function TimeOptionList({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <View className="overflow-hidden rounded-3xl bg-warm4">
      {timeOptions.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={`flex-row items-center justify-between border-b border-paper px-5 py-4 ${
              selected ? 'bg-ink' : 'bg-white'
            }`}
          >
            <Text className={`text-base ${selected ? 'font-semibold text-white' : 'text-ink'}`}>
              {option}
            </Text>
            {selected ? (
              <View className="h-5 w-5 items-center justify-center rounded-full bg-accent">
                <Text className="text-xs font-bold text-ink">✓</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function OptionList<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className="gap-3">
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={`flex-row items-center justify-between rounded-2xl px-5 py-4 ${
              selected ? 'bg-ink' : 'border border-warm3 bg-white'
            }`}
          >
            <Text className={`text-base ${selected ? 'font-semibold text-white' : 'text-ink'}`}>
              {option}
            </Text>
            {selected ? (
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-accent">
                <Text className="text-xs font-bold text-ink">✓</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
