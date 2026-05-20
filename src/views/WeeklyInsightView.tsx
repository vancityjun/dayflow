import { ScrollView, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { WeeklyInsightSummary } from '../types/insight';
import { PillActionButton } from '../components/LightScreenPrimitives';

type Props = {
  summary: WeeklyInsightSummary;
  aiInsightsEnabled?: boolean;
  onOptimizeTomorrow: () => void;
};

function HomeTabIcon({ active }: { active: boolean }) {
  const colorClass = active ? 'bg-ink' : 'bg-warm2';
  const borderClass = active ? 'border-ink' : 'border-warm2';

  return (
    <View className={`h-[18px] w-[18px] rounded-[3px] border ${borderClass}`}>
      <View
        className={`absolute left-[3px] top-[-3px] h-[5px] w-[1.5px] rounded-full ${colorClass}`}
      />
      <View
        className={`absolute right-[3px] top-[-3px] h-[5px] w-[1.5px] rounded-full ${colorClass}`}
      />
      <View className={`mt-[4px] h-px w-full ${colorClass}`} />
      <View className="mt-[3px] flex-row justify-center gap-[1.5px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className={`h-[1.5px] w-[1.5px] rounded-full ${colorClass}`} />
        ))}
      </View>
      <View className="mt-[2px] flex-row justify-center gap-[1.5px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className={`h-[1.5px] w-[1.5px] rounded-full ${colorClass}`} />
        ))}
      </View>
    </View>
  );
}

function InsightTabIcon({ active }: { active: boolean }) {
  const colorClass = active ? 'bg-ink' : 'bg-warm2';
  const bars = [8, 13, 18];

  return (
    <View className="h-[20px] w-[20px] flex-row items-end justify-center gap-[2px]">
      {bars.map((height, index) => (
        <View key={index} className={`w-[2px] rounded-full ${colorClass}`} style={{ height }} />
      ))}
    </View>
  );
}

function MyPageTabIcon({ active }: { active: boolean }) {
  const borderClass = active ? 'border-ink' : 'border-warm2';

  return (
    <View className="h-[20px] w-[20px] items-center">
      <View className={`h-[7px] w-[7px] rounded-full border ${borderClass}`} />
      <View className={`mt-[4px] h-[7px] w-[17px] rounded-t-full border ${borderClass}`} />
    </View>
  );
}

function WeeklyInsightBottomNavigation() {
  const tabs = [
    { key: 'home', label: 'Home', active: false, Icon: HomeTabIcon },
    { key: 'insight', label: 'Insight', active: true, Icon: InsightTabIcon },
    { key: 'my-page', label: 'My Page', active: false, Icon: MyPageTabIcon },
  ];

  return (
    <View
      className="absolute bottom-0 left-0 right-0 h-[82px] border-t border-warm3 bg-paper"
      testID="weekly-bottom-navigation"
    >
      <View className="h-[3px] flex-row gap-1 px-4">
        {tabs.map((tab) => (
          <View key={tab.key} className="flex-1 items-center">
            {tab.active ? <View className="h-[3px] w-[80px] rounded-full bg-accent" /> : null}
          </View>
        ))}
      </View>
      <View className="h-[79px] flex-row items-start gap-1 px-4 pt-5">
        {tabs.map(({ key, label, active, Icon }) => (
          <View key={key} className="flex-1 items-center">
            <Icon active={active} />
            <Text
              className={`mt-1 text-[12px] ${
                active ? 'font-semibold text-ink' : 'font-normal text-warm2'
              }`}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

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
      <ScrollView contentContainerClassName="pb-36 pt-5">
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
                        item.value > 0 && item.value === peak ? colors.accent : colors.warm3,
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
                className="h-full rounded-full bg-accent"
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
            buttonColor={colors.accent}
            labelStyle={{ fontSize: 15 }}
          />
          <Text className={`mt-5 text-center text-xs ${warm2Class}`}>{summary.reflection}</Text>
        </View>
      </ScrollView>
      <WeeklyInsightBottomNavigation />
    </View>
  );
}
