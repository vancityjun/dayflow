import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompletionState, PillActionButton } from '../components/LightScreenPrimitives';

export type OnboardingCommitmentAnswer = {
  option: string;
  startTime?: string;
  endTime?: string;
};

export type OnboardingAnswer = string | OnboardingCommitmentAnswer;

export type OnboardingStep = {
  id: string;
  question: string;
  kind: 'time' | 'options' | 'commitments';
  helperLabel?: string;
  options?: readonly string[];
};

type Props = {
  steps: readonly OnboardingStep[];
  stepIndex: number;
  selectedValue: OnboardingAnswer | undefined;
  completed: boolean;
  errorMessage?: string;
  completionActionLabel?: string;
  onSelect: (value: OnboardingAnswer) => void;
  onBack: () => void;
  onNext: () => void;
};

const wheelItemHeight = 34;
const wheelHeight = 182;
const hourOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
const minuteOptions = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, '0'));
const meridiemOptions = ['AM', 'PM'];
const customCommitmentOption = 'Custom';

function OnboardingProgress({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <View className="flex-row items-center gap-4" testID="onboarding-progress">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-[4px] flex-1 rounded-full ${index === activeIndex ? 'bg-ink' : 'bg-warm3'}`}
        />
      ))}
    </View>
  );
}

function parseTimeValue(value: string | undefined) {
  const match = /^(\d{1,2}):(\d{2})\s(AM|PM)$/.exec(value ?? '');
  return {
    hour: match?.[1] ?? '7',
    minute: match?.[2] ?? '00',
    meridiem: match?.[3] ?? 'AM',
  };
}

function composeTimeValue(hour: string, minute: string, meridiem: string) {
  return `${hour}:${minute} ${meridiem}`;
}

function isCommitmentAnswer(
  value: OnboardingAnswer | undefined,
): value is OnboardingCommitmentAnswer {
  return typeof value === 'object' && value !== null && 'option' in value;
}

function WheelColumn({
  options,
  selectedValue,
  onChange,
  width,
  align = 'center',
  testID,
}: {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  width: number;
  align?: 'left' | 'center' | 'right';
  testID?: string;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, options.indexOf(selectedValue));
  const commitScrollSelection = (offsetY: number) => {
    const nextIndex = Math.round(offsetY / wheelItemHeight);
    const optionIndex = Math.max(0, Math.min(options.length - 1, nextIndex));
    onChange(options[optionIndex]);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * wheelItemHeight,
      animated: false,
    });
  }, [selectedIndex]);

  return (
    <View style={{ width, height: wheelHeight }}>
      <ScrollView
        ref={scrollRef}
        testID={testID}
        showsVerticalScrollIndicator={false}
        snapToInterval={wheelItemHeight}
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingVertical: (wheelHeight - wheelItemHeight) / 2 }}
        onScrollEndDrag={(event) => {
          commitScrollSelection(event.nativeEvent.contentOffset.y);
        }}
        onMomentumScrollEnd={(event) => {
          commitScrollSelection(event.nativeEvent.contentOffset.y);
        }}
      >
        {options.map((item, index) => {
          const distance = Math.abs(index - selectedIndex);
          const selected = distance === 0;
          const fontSize = selected ? 24 : distance === 1 ? 22 : distance === 2 ? 18 : 13;
          const opacity = selected ? 1 : distance === 1 ? 0.55 : distance === 2 ? 0.32 : 0.18;
          const justifyClassName =
            align === 'right' ? 'items-end' : align === 'left' ? 'items-start' : 'items-center';
          return (
            <Pressable
              key={`${item}-${index}`}
              onPress={() => onChange(item)}
              style={{ height: wheelItemHeight, paddingHorizontal: 8 }}
              className={`${justifyClassName} justify-center`}
              testID={`onboarding-wheel-option-${item}`}
            >
              <Text
                className={`${selected ? 'font-medium text-ink' : 'font-normal text-ink'}`}
                style={{ fontSize, opacity }}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function TimeWheelPicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const parsed = parseTimeValue(value);

  return (
    <View
      className="relative items-center"
      style={{ height: wheelHeight, width: '100%', maxWidth: 326 }}
      testID="onboarding-time-picker"
    >
      <View
        className="absolute left-0 right-0 rounded-[10px] bg-[rgba(35,36,34,0.05)]"
        style={{
          top: (wheelHeight - 36) / 2,
          height: 36,
        }}
      />
      <View
        className="absolute left-0 right-0 flex-row items-center justify-center"
        style={{ height: wheelHeight }}
      >
        <WheelColumn
          options={hourOptions}
          selectedValue={parsed.hour}
          width={84}
          align="right"
          testID="onboarding-hour-wheel"
          onChange={(nextHour) =>
            onChange(composeTimeValue(nextHour, parsed.minute, parsed.meridiem))
          }
        />
        <WheelColumn
          options={minuteOptions}
          selectedValue={parsed.minute}
          width={86}
          testID="onboarding-minute-wheel"
          onChange={(nextMinute) =>
            onChange(composeTimeValue(parsed.hour, nextMinute, parsed.meridiem))
          }
        />
        <WheelColumn
          options={meridiemOptions}
          selectedValue={parsed.meridiem}
          width={92}
          align="left"
          testID="onboarding-meridiem-wheel"
          onChange={(nextMeridiem) =>
            onChange(composeTimeValue(parsed.hour, parsed.minute, nextMeridiem))
          }
        />
      </View>
    </View>
  );
}

function renderOptionCard({
  option,
  selected,
  onPress,
}: {
  option: string;
  selected: boolean;
  onPress: () => void;
}) {
  const selectedCardClass = 'bg-ink';
  const unselectedCardClass = 'border border-warm3 bg-paper';
  const optionTextClass = selected ? 'font-semibold text-white' : 'font-medium text-ink';

  return (
    <Pressable
      key={option}
      onPress={onPress}
      className={`min-h-[53px] flex-row items-center justify-between rounded-2xl px-5 ${
        selected ? selectedCardClass : unselectedCardClass
      }`}
    >
      <Text className={`text-base ${optionTextClass}`}>{option}</Text>
      {selected ? (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-accent">
          <View className="h-[13px] w-[15px]">
            <View
              className="absolute h-[2.5px] w-[8px] rounded-full bg-black"
              style={{ transform: [{ rotate: '45deg' }], left: 0, top: 7 }}
            />
            <View
              className="absolute h-[2.5px] w-[12px] rounded-full bg-black"
              style={{ transform: [{ rotate: '-45deg' }], left: 4, top: 5 }}
            />
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

export function OnboardingView({
  steps,
  stepIndex,
  selectedValue,
  completed,
  errorMessage,
  completionActionLabel = 'Get Started',
  onSelect,
  onBack,
  onNext,
}: Props) {
  if (completed) {
    return (
      <CompletionState
        title="All set!"
        body="We'll build your perfect daily schedule around your rhythm."
        actionLabel={completionActionLabel}
        onAction={onNext}
      />
    );
  }

  const step = steps[stepIndex];
  const progressLabel = `${stepIndex + 1}/${steps.length}`;
  const useMutedNextButton = stepIndex > 0;
  const canNext =
    step.kind === 'commitments'
      ? (() => {
          if (!isCommitmentAnswer(selectedValue)) return false;
          if (selectedValue.option !== customCommitmentOption) return Boolean(selectedValue.option);
          return Boolean(
            selectedValue.option &&
            selectedValue.startTime?.trim() &&
            selectedValue.endTime?.trim(),
          );
        })()
      : Boolean(selectedValue);

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={['top', 'bottom']} testID="onboarding-root">
      <ScrollView contentContainerClassName="flex-grow pb-28 pt-20">
        <View className="flex-row items-center gap-4 px-6">
          <Pressable
            onPress={onBack}
            disabled={stepIndex === 0}
            testID="onboarding-back-button"
            className={`h-[34px] w-[34px] items-center justify-center rounded-full ${
              stepIndex === 0 ? 'opacity-0' : 'bg-warm4'
            }`}
          >
            <View className="h-[14px] w-[10px] justify-center">
              <View
                className="absolute h-[2px] w-[13px] rounded-full bg-warm"
                style={{ transform: [{ rotate: '-45deg' }], top: 2, left: -1 }}
              />
              <View
                className="absolute h-[2px] w-[13px] rounded-full bg-warm"
                style={{ transform: [{ rotate: '45deg' }], bottom: 2, left: -1 }}
              />
            </View>
          </Pressable>
          <View className="flex-1">
            <OnboardingProgress total={steps.length} activeIndex={stepIndex} />
          </View>
          <Text className="text-[12px] font-medium tracking-[0.1px] text-warm">
            {progressLabel}
          </Text>
        </View>

        <View className="px-6 pt-11">
          <Text className="text-[11px] font-medium uppercase tracking-[0.4px] text-warm">
            Question {stepIndex + 1}
          </Text>
          <Text className="mt-3 max-w-[320px] text-[25px] font-bold leading-[31px] text-ink">
            {step.question}
          </Text>
        </View>

        {step.kind === 'time' ? (
          <View className="flex-1 items-center justify-center px-6 pb-14 pt-10">
            <TimeWheelPicker
              value={typeof selectedValue === 'string' ? selectedValue : undefined}
              onChange={onSelect}
            />
            <Text
              className="mt-6 text-center text-[11px] text-warm"
              testID="onboarding-time-helper"
            >
              {step.helperLabel}:{' '}
              <Text className="font-semibold text-ink2">
                {typeof selectedValue === 'string' ? selectedValue : ''}
              </Text>
            </Text>
          </View>
        ) : step.kind === 'commitments' ? (
          <View className="gap-3 px-6 pt-8">
            {step.options?.map((option) => {
              const selectedOption = isCommitmentAnswer(selectedValue) ? selectedValue.option : '';
              const selected = selectedOption === option;
              return renderOptionCard({
                option,
                selected,
                onPress: () =>
                  onSelect(
                    option === customCommitmentOption
                      ? {
                          option,
                          startTime:
                            isCommitmentAnswer(selectedValue) && selectedValue.option === option
                              ? (selectedValue.startTime ?? '7:00 AM')
                              : '7:00 AM',
                          endTime:
                            isCommitmentAnswer(selectedValue) && selectedValue.option === option
                              ? (selectedValue.endTime ?? '7:00 AM')
                              : '7:00 AM',
                        }
                      : { option },
                  ),
              });
            })}

            {isCommitmentAnswer(selectedValue) &&
            selectedValue.option === customCommitmentOption ? (
              <View className="mt-1 rounded-[20px] border border-warm3 bg-paper px-5 pb-4 pt-3">
                <Text className="pb-1 text-[11px] font-medium uppercase tracking-[1.43px] text-warm">
                  Start
                </Text>
                <TimeWheelPicker
                  value={selectedValue.startTime}
                  onChange={(startTime) =>
                    onSelect({
                      ...selectedValue,
                      startTime,
                    })
                  }
                />
                <View className="py-5">
                  <View className="h-px bg-warm3" />
                </View>
                <Text className="pb-1 text-[11px] font-medium uppercase tracking-[1.43px] text-warm">
                  End
                </Text>
                <TimeWheelPicker
                  value={selectedValue.endTime}
                  onChange={(endTime) =>
                    onSelect({
                      ...selectedValue,
                      endTime,
                    })
                  }
                />
              </View>
            ) : null}
          </View>
        ) : (
          <View className="gap-3 px-6 pt-8">
            {step.options?.map((option) => {
              const selected = option === selectedValue;
              return renderOptionCard({
                option,
                selected,
                onPress: () => onSelect(option),
              });
            })}
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-paper px-6 pb-7 pt-5">
        {errorMessage ? (
          <Text className="mb-3 text-center text-sm text-danger">{errorMessage}</Text>
        ) : null}
        <PillActionButton
          label="Next"
          disabled={!canNext}
          buttonColor={useMutedNextButton || !canNext ? '#E8E3D7' : undefined}
          textColor={useMutedNextButton || !canNext ? '#8A857A' : undefined}
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}
