import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { deleteOpenAIApiKey, getOpenAIApiKey, saveOpenAIApiKey } from '../services/apiKey';
import { SettingsView } from '../views/SettingsView';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getOpenAIApiKey()
      .then((key) => {
        setSaved(Boolean(key));
        setApiKey(key ?? '');
      })
      .catch(() => setMessage('Could not load stored API key.'));
  }, []);

  const save = async () => {
    try {
      await saveOpenAIApiKey(apiKey);
      setSaved(Boolean(apiKey.trim()));
      setMessage(apiKey.trim() ? 'API key saved locally.' : 'API key removed.');
    } catch {
      setMessage('Could not save API key.');
    }
  };

  const remove = async () => {
    try {
      await deleteOpenAIApiKey();
      setApiKey('');
      setSaved(false);
      setMessage('API key removed.');
    } catch {
      setMessage('Could not remove API key.');
    }
  };

  return (
    <SettingsView
      apiKey={apiKey}
      saved={saved}
      message={message}
      showPreviewCatalog={__DEV__}
      onDismissMessage={() => setMessage(null)}
      onChangeApiKey={setApiKey}
      onCancel={() => navigation.goBack()}
      onSave={save}
      onRemove={remove}
      onOpenPreviewCatalog={__DEV__ ? () => navigation.navigate('PreviewCatalog') : undefined}
    />
  );
}
