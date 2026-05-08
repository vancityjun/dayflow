import { ScrollView, Text, View } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { ScreenTopBar } from '../components/ScreenTopBar';
import { colors } from '../theme/colors';

type Props = {
  apiKey: string;
  saved: boolean;
  message: string | null;
  showPreviewCatalog: boolean;
  onDismissMessage: () => void;
  onChangeApiKey: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onRemove: () => void;
  onOpenPreviewCatalog?: () => void;
};

export function SettingsView({
  apiKey,
  saved,
  message,
  showPreviewCatalog,
  onDismissMessage,
  onChangeApiKey,
  onCancel,
  onSave,
  onRemove,
  onOpenPreviewCatalog,
}: Props) {
  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="pb-12 pt-14">
        <ScreenTopBar title="Settings" onCancel={onCancel} onSave={onSave} saveLabel="Save" />

        <View className="px-6 pt-8">
          <Text className="text-4xl font-bold tracking-tight text-ink">OpenAI API key</Text>
          <Text className="mt-3 text-base leading-6 text-warm">
            DayFlow stores your key locally on this device with Expo SecureStore. The key is used
            only for schedule generation.
          </Text>

          <TextInput
            mode="outlined"
            label="API key"
            value={apiKey}
            onChangeText={onChangeApiKey}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="sk-..."
            style={{ marginTop: 24 }}
          />

          <View className="mt-5 rounded-2xl bg-warm4 p-4">
            <Text className="font-semibold text-ink">
              {saved ? 'AI generation is enabled.' : 'AI generation is disabled.'}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-warm">
              {saved
                ? 'Your API key is stored locally.'
                : 'Add and save an API key before using AI schedule generation.'}
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={onSave}
            buttonColor={colors.ink}
            textColor={colors.white}
            style={{ marginTop: 20, borderRadius: 999 }}
          >
            Save API Key
          </Button>
          {saved ? (
            <Button
              mode="text"
              onPress={onRemove}
              textColor={colors.danger}
              style={{ marginTop: 12 }}
            >
              Remove API Key
            </Button>
          ) : null}

          {showPreviewCatalog && onOpenPreviewCatalog ? (
            <View className="mt-8 border-t border-warm3 pt-6">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-warm">
                Developer
              </Text>
              <Button
                mode="outlined"
                onPress={onOpenPreviewCatalog}
                textColor={colors.ink}
                style={{ marginTop: 12, borderRadius: 999 }}
              >
                UI Preview
              </Button>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <Snackbar visible={Boolean(message)} onDismiss={onDismissMessage} duration={3000}>
        {message}
      </Snackbar>
    </View>
  );
}
