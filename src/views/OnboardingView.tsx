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
  selectionStyle?: 'default' | 'centered';
};

type Props = {
  steps: readonly OnboardingStep[];
  stepIndex: number;
  selectedValue: OnboardingAnswer | undefined;
  completed: boolean;
  onSelect: (value: OnboardingAnswer) => void;
  onBack: () => void;
  onNext: () => void;
};

const wheelItemHeight = 34;
const wheelHeight = 182;
const hourOptions = Array.from({ length: 9 }, (_, index) => String(index + 3));
const minuteOptions = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, '0'));
const meridiemOptions = ['AM', 'PM'];
const customCommitmentOption = 'Custom';

function OnboardingProgress({ total, activeIndex }: { total: number; activeIndex: number }) {
  return (
    <View className="flex-row items-center justify-between">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-[3px] rounded-full ${index === activeIndex ? 'bg-ink' : 'bg-warm3'}`}
          style={{ width: 27 }}
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
}: {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  width: number;
  align?: 'left' | 'center' | 'right';
}) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, options.indexOf(selectedValue));

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
        showsVerticalScrollIndicator={false}
        snapToInterval={wheelItemHeight}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingVertical: (wheelHeight - wheelItemHeight) / 2 }}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.y / wheelItemHeight);
          onChange(options[Math.max(0, Math.min(options.length - 1, nextIndex))]);
        }}
      >
        {options.map((item, index) => {
          const selected = index === selectedIndex;
          const justifyClassName =
            align === 'right' ? 'items-end' : align === 'left' ? 'items-start' : 'items-center';
          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              style={{ height: wheelItemHeight, paddingHorizontal: 8 }}
              className={`${justifyClassName} justify-center`}
            >
              <Text
                className={`tracking-[-0.2px] ${
                  selected
                    ? 'text-[24px] font-medium text-ink'
                    : 'text-[18px] font-normal text-ink opacity-30'
                }`}
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
    <View className="relative items-center" style={{ height: wheelHeight, width: 324 }}>
      <View
        className="absolute left-0 right-0 rounded-[10px] bg-[rgba(35,36,34,0.04)]"
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
          onChange={(nextHour) =>
            onChange(composeTimeValue(nextHour, parsed.minute, parsed.meridiem))
          }
        />
        <WheelColumn
          options={minuteOptions}
          selectedValue={parsed.minute}
          width={86}
          onChange={(nextMinute) =>
            onChange(composeTimeValue(parsed.hour, nextMinute, parsed.meridiem))
          }
        />
        <WheelColumn
          options={meridiemOptions}
          selectedValue={parsed.meridiem}
          width={92}
          align="left"
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
  centered = false,
}: {
  option: string;
  selected: boolean;
  onPress: () => void;
  centered?: boolean;
}) {
  return (
    <Pressable
      key={option}
      onPress={onPress}
      className={`flex-row items-center justify-between px-5 ${
        centered
          ? `h-[59px] rounded-[20px] border border-warm3 ${selected ? 'bg-ink' : 'bg-paper'}`
          : `min-h-[53px] rounded-2xl ${selected ? 'bg-ink' : 'border border-warm3 bg-paper'}`
      }`}
    >
      <Text
        className={`${
          centered
            ? `w-full text-center text-[22px] font-bold leading-[31px] tracking-[-0.44px] ${selected ? 'text-white' : 'text-ink'}`
            : `text-base ${selected ? 'font-semibold text-white' : 'text-ink'}`
        }`}
      >
        {option}
      </Text>
      {!centered && selected ? <Text className="text-base font-bold text-accent">✓</Text> : null}
    </Pressable>
  );
}

export function OnboardingView({
  steps,
  stepIndex,
  selectedValue,
  completed,
  onSelect,
  onBack,
  onNext,
}: Props) {
  if (completed) {
    return (
      <CompletionState
        title="All set!"
        body="We'll build your perfect daily schedule around your rhythm."
        actionLabel="Start planning"
        onAction={onNext}
      />
    );
  }

  const step = steps[stepIndex];
  const progressLabel = `${stepIndex + 1}/${steps.length}`;
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
    <SafeAreaView className="flex-1 bg-paper" edges={['top', 'bottom']}>
      <ScrollView contentContainerClassName="flex-grow pb-28 pt-20">
        <View className="flex-row items-center gap-3 px-6">
          <Pressable
            onPress={onBack}
            disabled={stepIndex === 0}
            className={`h-[34px] w-[34px] items-center justify-center rounded-full ${
              stepIndex === 0 ? 'opacity-0' : 'bg-warm4'
            }`}
          >
            <Text className="text-2xl text-ink">‹</Text>
          </Pressable>
          <View className="flex-1">
            <OnboardingProgress total={steps.length} activeIndex={stepIndex} />
          </View>
          <Text className="text-[12px] font-medium tracking-[0.1px] text-warm">
            {progressLabel}
          </Text>
        </View>

        <View className="px-6 pt-11">
          <Text className="text-[11px] font-medium uppercase tracking-[1.8px] text-warm">
            Question {stepIndex + 1}
          </Text>
          <Text className="mt-3 text-[30px] font-bold leading-[38px] tracking-[-0.9px] text-ink">
            {step.question}
          </Text>
        </View>

        {step.kind === 'time' ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <TimeWheelPicker
              value={typeof selectedValue === 'string' ? selectedValue : undefined}
              onChange={onSelect}
            />
            <Text className="mt-7 text-center text-[14px] tracking-[0.1px] text-warm">
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
                              ? (selectedValue.endTime ?? '9:00 AM')
                              : '9:00 AM',
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
                centered: step.selectionStyle === 'centered',
              });
            })}
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-paper px-6 pb-7 pt-5">
        <PillActionButton
          label="Next"
          disabled={!canNext}
          buttonColor={canNext ? undefined : '#E8E3D7'}
          textColor={canNext ? undefined : '#8A857A'}
          onPress={onNext}
        />
      </View>
    </SafeAreaView>
  );
}
