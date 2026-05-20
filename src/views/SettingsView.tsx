import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { ScreenTopBar } from '../components/ScreenTopBar';
import { colors } from '../theme/colors';

type Props = {
  apiKey: string;
  saved: boolean;
  hasUnsavedApiKeyChange: boolean;
  message: string | null;
  validating: boolean;
  showPreviewCatalog: boolean;
  aiSuggestionEnabled: boolean;
  onDismissMessage: () => void;
  onChangeApiKey: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onRemove: () => void;
  onEditOnboardingProfile: () => void;
  onToggleAiSuggestion: (enabled: boolean) => void;
  onOpenPreviewCatalog?: () => void;
};

export function SettingsView({
  apiKey,
  saved,
  hasUnsavedApiKeyChange,
  message,
  validating,
  showPreviewCatalog,
  aiSuggestionEnabled,
  onDismissMessage,
  onChangeApiKey,
  onCancel,
  onSave,
  onRemove,
  onEditOnboardingProfile,
  onToggleAiSuggestion,
  onOpenPreviewCatalog,
}: Props) {
  const [hideApiKey, setHideApiKey] = useState(false);

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
            secureTextEntry={hideApiKey}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="sk-..."
            style={{ marginTop: 24 }}
          />
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="flex-1 pr-3 text-sm leading-5 text-warm">
              Paste your key here. Hide it only if you need privacy while entering it.
            </Text>
            <Button mode="text" compact onPress={() => setHideApiKey((value) => !value)}>
              {hideApiKey ? 'Show' : 'Hide'}
            </Button>
          </View>

          <View className="mt-5 rounded-2xl bg-warm4 p-4">
            <Text className="font-semibold text-ink">
              {validating
                ? 'Checking your API key...'
                : hasUnsavedApiKeyChange
                  ? 'You have unsaved API key changes.'
                  : saved
                    ? 'AI generation is enabled.'
                    : 'AI generation is disabled.'}
            </Text>
            <Text className="mt-1 text-sm leading-5 text-warm">
              {validating
                ? 'DayFlow is verifying the key with OpenAI before saving it.'
                : hasUnsavedApiKeyChange
                  ? 'Save this key to verify it. The previously verified key remains active until then.'
                  : saved
                    ? 'Your API key was verified and is stored locally.'
                    : 'Add and save an API key before using AI schedule generation.'}
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={onSave}
            disabled={validating}
            loading={validating}
            buttonColor={colors.ink}
            textColor={colors.white}
            style={{ marginTop: 20, borderRadius: 999 }}
          >
            {validating ? 'Checking API Key' : 'Save API Key'}
          </Button>
          {saved ? (
            <Button
              mode="text"
              onPress={onRemove}
              disabled={validating}
              textColor={colors.danger}
              style={{ marginTop: 12 }}
            >
              Remove API Key
            </Button>
          ) : null}

          <View className="mt-8 border-t border-warm3 pt-6">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-warm">
              Personalization
            </Text>
            <Button
              mode="outlined"
              onPress={onEditOnboardingProfile}
              textColor={colors.ink}
              style={{ marginTop: 12, borderRadius: 999 }}
            >
              Edit Onboarding Profile
            </Button>
            <View className="mt-4 flex-row items-center justify-between rounded-2xl border border-warm3 bg-paper px-4 py-3">
              <View className="flex-1 pr-4">
                <Text className="text-base font-medium text-ink">AI Suggestion</Text>
                <Text className="mt-1 text-sm text-warm">Get Suggestion</Text>
              </View>
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: aiSuggestionEnabled }}
                onPress={() => onToggleAiSuggestion(!aiSuggestionEnabled)}
                className={`h-[31px] w-[51px] justify-center rounded-full px-0.5 ${
                  aiSuggestionEnabled ? 'items-end bg-accent' : 'items-start bg-warm3'
                }`}
                testID="ai-suggestion-switch"
              >
                <View className="h-[27px] w-[27px] rounded-full bg-paper" />
              </Pressable>
            </View>
          </View>

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
