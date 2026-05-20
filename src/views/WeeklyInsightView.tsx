import { ScrollView, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { WeeklyInsightSummary } from '../types/insight';
import { PillActionButton } from '../components/LightScreenPrimitives';

type Props = {
  summary: WeeklyInsightSummary;
  aiInsightsEnabled?: boolean;
  onOptimizeTomorrow: () => void;
};

export function WeeklyInsightView({
  summary,
  aiInsightsEnabled = false,
  onOptimizeTomorrow,
}: Props) {
  const peak = Math.max(1, ...summary.timeChart.map((item) => item.value));
  const surfaceClass = 'bg-paper';
  const cardClass = 'border-warm3 bg-paper';
  const mutedCardClass = 'bg-[rgba(35,36,34,0.04)]';
  const suggestionClass = 'border-warm2 bg-paper';
  const titleClass = 'text-ink';
  const warmClass = 'text-warm';
  const warm2Class = 'text-warm2';
  const dividerClass = 'bg-warm3';
  const showAiInsights =
    aiInsightsEnabled && (summary.patterns.length > 0 || summary.suggestions.length > 0);

  return (
    <View className={`flex-1 ${surfaceClass}`} testID="weekly-insight-root">
      <ScrollView contentContainerClassName="pb-8 pt-5">
        <View className="px-6 pb-6">
          <Text className={`text-[11px] font-medium uppercase tracking-[2px] ${warmClass}`}>
            {summary.dateRange}
          </Text>
          <Text
            className={`mt-3 text-[34px] font-bold leading-[39px] tracking-[-1.3px] ${titleClass}`}
          >
            Weekly Insight
          </Text>
          <Text className={`mt-2 text-sm font-medium ${warmClass}`}>{summary.basedOn}</Text>
        </View>

        <View className={`mx-6 h-px ${dividerClass}`} />

        <View className="px-6 py-8">
          <Text className={`text-[11px] font-medium uppercase tracking-[2px] ${warmClass}`}>
            Main Insight
          </Text>
          <Text
            className={`mt-4 text-[28px] font-bold leading-[39px] tracking-[-0.9px] ${titleClass}`}
          >
            {summary.headline}
          </Text>
          <View className="mt-6 h-[2.5px] w-8 rounded-full bg-accent" />
        </View>

        <View className="grid-cols-2 flex-row gap-2 px-6 pb-8">
          <View className={`flex-1 rounded-2xl border px-3.5 py-3.5 ${cardClass}`}>
            <Text className={`text-[10px] font-bold uppercase tracking-[1.2px] ${warmClass}`}>
              Time of day
            </Text>
            <View className="mt-4 h-[68px] flex-row items-end justify-center gap-1.5">
              {summary.timeChart.map((item) => (
                <View key={item.label} className="items-center gap-1">
                  <View
                    testID={`weekly-time-chart-bar-${item.label}`}
                    style={{
                      height: Math.max(4, (item.value / peak) * 52),
                      backgroundColor:
                        item.value > 0 && item.value === peak ? '#01B224' : colors.warm3,
                    }}
                    className="w-[15px] rounded-t-[3px]"
                  />
                  <Text className={`text-[9px] ${warm2Class}`}>{item.label}</Text>
                </View>
              ))}
            </View>
            <Text className={`mt-2 text-[11px] ${warm2Class}`}>
              Peak <Text className={`font-semibold ${titleClass}`}>{summary.peakHourLabel}</Text>
            </Text>
          </View>

          <View className={`flex-1 rounded-2xl border px-3.5 py-3.5 ${cardClass}`}>
            <Text className={`text-[10px] font-bold uppercase tracking-[1.2px] ${warmClass}`}>
              Completion
            </Text>
            <View className="mt-4 h-1.5 overflow-hidden rounded-full bg-warm3">
              <View
                testID="weekly-completion-progress-bar"
                style={{ width: `${summary.completionPercent}%` }}
                className="h-full rounded-full bg-[#01B224]"
              />
            </View>
            <Text className={`mt-3 text-2xl font-bold tracking-[-1px] ${titleClass}`}>
              {summary.completionPercent}%
            </Text>
            <Text className={`text-[10px] uppercase tracking-[0.6px] ${warmClass}`}>Done</Text>
            <Text className={`mt-2 text-base font-semibold ${warmClass}`}>
              {summary.skippedPercent}%
            </Text>
            <Text className={`text-[10px] uppercase tracking-[0.6px] ${warm2Class}`}>Skipped</Text>
          </View>
        </View>

        {showAiInsights ? (
          <>
            <View className={`mx-6 h-px ${dividerClass}`} />

            <View className="px-6 py-8">
              <Text className={`text-[11px] font-medium uppercase tracking-[2px] ${warmClass}`}>
                Patterns
              </Text>
              <View className="mt-4 flex-row flex-wrap gap-2">
                {summary.patterns.map((pattern, index) => (
                  <View
                    key={pattern.label}
                    className={`${index === summary.patterns.length - 1 ? 'w-full' : 'flex-1'} rounded-[14px] px-4 py-4 ${mutedCardClass}`}
                  >
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-[1.4px] ${titleClass}`}
                    >
                      {pattern.label}
                    </Text>
                    <View className="my-2 h-[1.5px] w-4 rounded-full bg-warm2" />
                    <Text className={`text-[13px] leading-4 tracking-[-0.1px] ${warmClass}`}>
                      {pattern.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={`mx-6 h-px ${dividerClass}`} />

            <View className="px-6 py-8">
              <Text className={`text-[11px] font-medium uppercase tracking-[2px] ${warmClass}`}>
                Suggestions
              </Text>
              <View className="mt-4 gap-2.5">
                {summary.suggestions.map((suggestion) => (
                  <View
                    key={suggestion.text}
                    className={`rounded-2xl border-[1.5px] px-[18px] py-4 ${suggestionClass}`}
                  >
                    <Text className={`text-[15px] font-medium tracking-[-0.1px] ${titleClass}`}>
                      {suggestion.text}
                    </Text>
                    <Text className={`mt-3 text-right text-xs font-medium ${warmClass}`}>
                      {suggestion.action} →
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : null}

        <View className="px-6">
          <PillActionButton
            label="Optimize tomorrow's schedule →"
            onPress={onOptimizeTomorrow}
            buttonColor="#01B224"
            labelStyle={{ fontSize: 15 }}
          />
          <Text className={`mt-5 text-center text-xs ${warm2Class}`}>{summary.reflection}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
