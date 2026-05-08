import { View } from 'react-native';
import type { TaskStatus } from '../types/task';
import { colors } from '../theme/colors';

type DotStatus = TaskStatus | 'current';

export function StationDot({ status }: { status: DotStatus }) {
  if (status === 'current') {
    return (
      <View className="h-[22px] w-[22px] items-center justify-center">
        <View className="absolute h-[22px] w-[22px] rounded-full bg-accent opacity-25" />
        <View className="h-[10px] w-[10px] rounded-full bg-accent" />
      </View>
    );
  }

  if (status === 'completed') {
    return (
      <View className="h-[22px] w-[22px] items-center justify-center">
        <View className="h-[10px] w-[10px] rounded-full bg-ink" />
      </View>
    );
  }

  if (status === 'skipped') {
    return (
      <View className="h-[22px] w-[22px] items-center justify-center">
        <View className="h-[10px] w-[10px] rounded-full border border-warm bg-paper">
          <View
            style={{
              position: 'absolute',
              left: -3,
              top: 4,
              width: 14,
              height: 1.5,
              backgroundColor: colors.warm,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="h-[22px] w-[22px] items-center justify-center">
      <View className="h-2 w-2 rounded-full border border-warm2 bg-paper" />
    </View>
  );
}
