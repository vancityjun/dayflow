import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, waitFor } from '@testing-library/react-native';
import type { ComponentProps } from 'react';
import * as ReactNative from 'react-native';
import { SettingsScreen } from './SettingsScreen';
import { deleteOpenAIApiKey, getOpenAIApiKey, saveOpenAIApiKey } from '../services/apiKey';
import { validateOpenAIApiKey } from '../services/openai';

jest.mock('../services/apiKey', () => ({
  deleteOpenAIApiKey: jest.fn(),
  getOpenAIApiKey: jest.fn(),
  saveOpenAIApiKey: jest.fn(),
}));

jest.mock('../services/openai', () => ({
  validateOpenAIApiKey: jest.fn(),
}));

let lastSettingsViewProps: ComponentProps<
  typeof import('../views/SettingsView').SettingsView
> | null = null;
const mockReact = React;
const mockReactNative = ReactNative;

jest.mock('../views/SettingsView', () => {
  return {
    SettingsView: (props: ComponentProps<typeof import('../views/SettingsView').SettingsView>) => {
      lastSettingsViewProps = props;
      return mockReact.createElement(
        mockReactNative.View,
        null,
        mockReact.createElement(mockReactNative.Text, null, props.message ?? 'no-message'),
        mockReact.createElement(mockReactNative.Text, null, props.saved ? 'saved' : 'not-saved'),
        mockReact.createElement(mockReactNative.TextInput, {
          testID: 'api-key-input',
          value: props.apiKey,
          onChangeText: props.onChangeApiKey,
        }),
      );
    },
  };
});

function renderSettingsScreen() {
  const navigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  return {
    navigation,
    ...render(
      <SettingsScreen
        navigation={navigation as never}
        route={{ key: 'settings-key', name: 'Settings' } as never}
      />,
    ),
  };
}

describe('SettingsScreen', () => {
  const getOpenAIApiKeyMock = jest.mocked(getOpenAIApiKey);
  const saveOpenAIApiKeyMock = jest.mocked(saveOpenAIApiKey);
  const deleteOpenAIApiKeyMock = jest.mocked(deleteOpenAIApiKey);
  const validateOpenAIApiKeyMock = jest.mocked(validateOpenAIApiKey);

  beforeEach(() => {
    lastSettingsViewProps = null;
    getOpenAIApiKeyMock.mockReset();
    saveOpenAIApiKeyMock.mockReset();
    deleteOpenAIApiKeyMock.mockReset();
    validateOpenAIApiKeyMock.mockReset();
  });

  it('loads a stored key into the form', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce('sk-stored');

    renderSettingsScreen();

    await waitFor(() => {
      expect(lastSettingsViewProps?.apiKey).toBe('sk-stored');
      expect(lastSettingsViewProps?.saved).toBe(true);
    });
  });

  it('validates and saves a non-empty key', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce(null);
    validateOpenAIApiKeyMock.mockResolvedValueOnce();
    saveOpenAIApiKeyMock.mockResolvedValueOnce();

    renderSettingsScreen();

    await waitFor(() => expect(lastSettingsViewProps).not.toBeNull());

    await act(async () => {
      lastSettingsViewProps?.onChangeApiKey('  sk-live  ');
    });

    await act(async () => {
      await lastSettingsViewProps?.onSave();
    });

    expect(validateOpenAIApiKeyMock).toHaveBeenCalledWith('sk-live');
    expect(saveOpenAIApiKeyMock).toHaveBeenCalledWith('sk-live');
    expect(lastSettingsViewProps?.message).toBe('API key verified and saved.');
    expect(lastSettingsViewProps?.saved).toBe(true);
  });

  it('surfaces validation failures without saving', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce(null);
    validateOpenAIApiKeyMock.mockRejectedValueOnce(
      new Error('This API key is invalid, expired, or revoked.'),
    );

    renderSettingsScreen();

    await waitFor(() => expect(lastSettingsViewProps).not.toBeNull());

    await act(async () => {
      lastSettingsViewProps?.onChangeApiKey('sk-bad');
    });

    await act(async () => {
      await lastSettingsViewProps?.onSave();
    });

    expect(saveOpenAIApiKeyMock).not.toHaveBeenCalled();
    expect(lastSettingsViewProps?.message).toBe('This API key is invalid, expired, or revoked.');
  });

  it('removes the key when the field is empty on save', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce('sk-stored');
    saveOpenAIApiKeyMock.mockResolvedValueOnce();

    renderSettingsScreen();

    await waitFor(() => expect(lastSettingsViewProps?.apiKey).toBe('sk-stored'));

    await act(async () => {
      lastSettingsViewProps?.onChangeApiKey('   ');
    });

    await act(async () => {
      await lastSettingsViewProps?.onSave();
    });

    expect(validateOpenAIApiKeyMock).not.toHaveBeenCalled();
    expect(saveOpenAIApiKeyMock).toHaveBeenCalledWith('');
    expect(lastSettingsViewProps?.message).toBe('API key removed.');
    expect(lastSettingsViewProps?.saved).toBe(false);
  });

  it('removes the key through the remove action', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce('sk-stored');
    deleteOpenAIApiKeyMock.mockResolvedValueOnce();

    renderSettingsScreen();

    await waitFor(() => expect(lastSettingsViewProps?.saved).toBe(true));

    await act(async () => {
      await lastSettingsViewProps?.onRemove();
    });

    expect(deleteOpenAIApiKeyMock).toHaveBeenCalledTimes(1);
    expect(lastSettingsViewProps?.message).toBe('API key removed.');
    expect(lastSettingsViewProps?.saved).toBe(false);
  });

  it('opens onboarding in edit mode from settings', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce(null);
    const { navigation } = renderSettingsScreen();

    await waitFor(() => expect(lastSettingsViewProps).not.toBeNull());

    act(() => {
      lastSettingsViewProps?.onEditOnboardingProfile();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('Onboarding', { mode: 'edit' });
  });
});
