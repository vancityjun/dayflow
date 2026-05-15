import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getDarkModeEnabled, saveDarkModeEnabled } from '../services/appearance';
import { deleteOpenAIApiKey, getOpenAIApiKey, saveOpenAIApiKey } from '../services/apiKey';
import { validateOpenAIApiKey } from '../services/openai';
import { SettingsView } from '../views/SettingsView';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    getOpenAIApiKey()
      .then((key) => {
        setSavedKey(key);
        setApiKey(key ?? '');
      })
      .catch(() => setMessage('Could not load stored API key.'));

    getDarkModeEnabled()
      .then(setDarkModeEnabled)
      .catch(() => setMessage('Could not load appearance settings.'));
  }, []);

  const save = async () => {
    const trimmed = apiKey.trim();
    setValidating(true);
    setMessage(null);
    try {
      if (!trimmed) {
        await saveOpenAIApiKey('');
        setSavedKey(null);
        setMessage('API key removed.');
        return;
      }

      await validateOpenAIApiKey(trimmed);
      await saveOpenAIApiKey(trimmed);
      setSavedKey(trimmed);
      setApiKey(trimmed);
      setMessage('API key verified and saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save API key.');
    } finally {
      setValidating(false);
    }
  };

  const remove = async () => {
    setValidating(true);
    setMessage(null);
    try {
      await deleteOpenAIApiKey();
      setApiKey('');
      setSavedKey(null);
      setMessage('API key removed.');
    } catch {
      setMessage('Could not remove API key.');
    } finally {
      setValidating(false);
    }
  };

  const toggleDarkMode = async (enabled: boolean) => {
    const previousValue = darkModeEnabled;
    setDarkModeEnabled(enabled);
    try {
      await saveDarkModeEnabled(enabled);
    } catch {
      setDarkModeEnabled(previousValue);
      setMessage('Could not save appearance settings.');
    }
  };

  return (
    <SettingsView
      apiKey={apiKey}
      saved={Boolean(savedKey)}
      hasUnsavedApiKeyChange={Boolean(savedKey && apiKey.trim() !== savedKey)}
      message={message}
      validating={validating}
      darkModeEnabled={darkModeEnabled}
      showPreviewCatalog={__DEV__}
      onDismissMessage={() => setMessage(null)}
      onChangeApiKey={setApiKey}
      onCancel={() => navigation.goBack()}
      onSave={save}
      onRemove={remove}
      onToggleDarkMode={toggleDarkMode}
      onEditOnboardingProfile={() => navigation.navigate('Onboarding', { mode: 'edit' })}
      onOpenPreviewCatalog={__DEV__ ? () => navigation.navigate('PreviewCatalog') : undefined}
    />
  );
}
