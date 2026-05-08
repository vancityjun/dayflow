import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  canSave?: boolean;
  saveLabel?: string;
  onCancel: () => void;
  onSave?: () => void;
};

export function ScreenTopBar({
  title,
  canSave = true,
  saveLabel = 'Save',
  onCancel,
  onSave,
}: Props) {
  return (
    <View className="min-h-11 flex-row items-center justify-between px-4 py-2">
      <Button mode="text" onPress={onCancel} textColor={colors.ink2}>
        Cancel
      </Button>
      <Text className="text-xs font-bold uppercase tracking-[2.6px] text-ink">{title}</Text>
      <Button
        mode="text"
        onPress={onSave}
        disabled={!canSave || !onSave}
        textColor={canSave ? colors.ink : colors.warm2}
      >
        {saveLabel}
      </Button>
    </View>
  );
}
