import * as SecureStore from 'expo-secure-store';

const DARK_MODE_KEY = 'dayflow.darkModeEnabled';

export async function getDarkModeEnabled(): Promise<boolean> {
  return (await SecureStore.getItemAsync(DARK_MODE_KEY)) === 'true';
}

export async function saveDarkModeEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(DARK_MODE_KEY, enabled ? 'true' : 'false');
}
