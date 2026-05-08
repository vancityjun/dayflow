import * as SecureStore from 'expo-secure-store';

const OPENAI_API_KEY = 'dayflow.openaiApiKey';

export async function getOpenAIApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(OPENAI_API_KEY);
}

export async function saveOpenAIApiKey(value: string): Promise<void> {
  const trimmed = value.trim();
  if (!trimmed) {
    await SecureStore.deleteItemAsync(OPENAI_API_KEY);
    return;
  }
  await SecureStore.setItemAsync(OPENAI_API_KEY, trimmed);
}

export async function deleteOpenAIApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(OPENAI_API_KEY);
}
