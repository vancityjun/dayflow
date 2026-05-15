import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as SecureStore from 'expo-secure-store';
import { getDarkModeEnabled, saveDarkModeEnabled } from './appearance';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

describe('appearance service', () => {
  const getItemAsyncMock = jest.mocked(SecureStore.getItemAsync);
  const setItemAsyncMock = jest.mocked(SecureStore.setItemAsync);

  beforeEach(() => {
    getItemAsyncMock.mockReset();
    setItemAsyncMock.mockReset();
  });

  it('reads dark mode as enabled only when the stored value is true', async () => {
    getItemAsyncMock.mockResolvedValueOnce('true').mockResolvedValueOnce('false');

    await expect(getDarkModeEnabled()).resolves.toBe(true);
    await expect(getDarkModeEnabled()).resolves.toBe(false);
  });

  it('saves the dark mode preference', async () => {
    await saveDarkModeEnabled(true);
    await saveDarkModeEnabled(false);

    expect(setItemAsyncMock).toHaveBeenNthCalledWith(1, 'dayflow.darkModeEnabled', 'true');
    expect(setItemAsyncMock).toHaveBeenNthCalledWith(2, 'dayflow.darkModeEnabled', 'false');
  });
});
