import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render, waitFor } from '@testing-library/react-native';
import type { ComponentProps } from 'react';
import * as ReactNative from 'react-native';
import { AIScheduleScreen } from './AIScheduleScreen';
import { getOpenAIApiKey } from '../services/apiKey';
import { getOnboardingProfile } from '../services/onboardingProfile';
import { generateScheduleFromText } from '../services/openai';
import { useTaskStore } from '../store/taskStore';
import { useIsFocused } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('../services/apiKey', () => ({
  getOpenAIApiKey: jest.fn(),
}));

jest.mock('../services/onboardingProfile', () => ({
  getOnboardingProfile: jest.fn(),
  formatOnboardingProfileForPrompt: jest.fn(() => '- Wake-up time: 7:00 AM'),
}));

jest.mock('../services/openai', () => ({
  generateScheduleFromText: jest.fn(),
}));

jest.mock('../store/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

let lastAIScheduleViewProps: ComponentProps<
  typeof import('../views/AIScheduleView').AIScheduleView
> | null = null;
const mockReact = React;
const mockReactNative = ReactNative;

jest.mock('../views/AIScheduleView', () => {
  return {
    AIScheduleView: (
      props: ComponentProps<typeof import('../views/AIScheduleView').AIScheduleView>,
    ) => {
      lastAIScheduleViewProps = props;
      return mockReact.createElement(
        mockReactNative.View,
        null,
        mockReact.createElement(mockReactNative.Text, null, props.localError ?? 'no-local-error'),
        mockReact.createElement(
          mockReactNative.Text,
          null,
          props.apiKeyPresent ? 'api-key-present' : 'api-key-missing',
        ),
        mockReact.createElement(mockReactNative.Text, null, props.generateStatus),
      );
    },
  };
});

function createStoreState() {
  return {
    previewTasks: [],
    setPreviewTasks: jest.fn(),
    updatePreviewTask: jest.fn(),
    clearPreviewTasks: jest.fn(),
    confirmPreviewTasks: jest.fn(),
    error: null,
    clearError: jest.fn(),
    loading: false,
  };
}

function renderAIScheduleScreen() {
  const navigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  return render(
    <AIScheduleScreen
      navigation={navigation as never}
      route={{ key: 'ai-key', name: 'AISchedule' } as never}
    />,
  );
}

describe('AIScheduleScreen', () => {
  const getOpenAIApiKeyMock = jest.mocked(getOpenAIApiKey);
  const getOnboardingProfileMock = jest.mocked(getOnboardingProfile);
  const generateScheduleFromTextMock = jest.mocked(generateScheduleFromText);
  const useTaskStoreMock = jest.mocked(useTaskStore);
  const useIsFocusedMock = jest.mocked(useIsFocused);

  beforeEach(() => {
    lastAIScheduleViewProps = null;
    getOpenAIApiKeyMock.mockReset();
    getOnboardingProfileMock.mockReset();
    generateScheduleFromTextMock.mockReset();
    getOnboardingProfileMock.mockResolvedValue(null);
    useIsFocusedMock.mockReset();
    useIsFocusedMock.mockImplementation(() => true);
    useTaskStoreMock.mockReturnValue(createStoreState());
  });

  it('refreshes the key when the screen becomes focused', async () => {
    let isFocused = false;
    useIsFocusedMock.mockImplementation(() => isFocused);
    getOpenAIApiKeyMock.mockResolvedValue('sk-fresh');

    const screenView = renderAIScheduleScreen();

    expect(getOpenAIApiKeyMock).not.toHaveBeenCalled();

    isFocused = true;
    screenView.rerender(
      <AIScheduleScreen
        navigation={{ goBack: jest.fn(), navigate: jest.fn() } as never}
        route={{ key: 'ai-key', name: 'AISchedule' } as never}
      />,
    );

    await waitFor(() => {
      expect(getOpenAIApiKeyMock).toHaveBeenCalledTimes(1);
      expect(lastAIScheduleViewProps?.apiKeyPresent).toBe(true);
    });
  });

  it('uses the latest stored key when generating to avoid stale state', async () => {
    const storeState = createStoreState();
    useTaskStoreMock.mockReturnValue(storeState);
    getOpenAIApiKeyMock.mockResolvedValueOnce('sk-old').mockResolvedValueOnce('sk-new');
    generateScheduleFromTextMock.mockResolvedValueOnce([
      { title: 'Study React', durationMinutes: 45 },
    ]);

    renderAIScheduleScreen();

    await waitFor(() => expect(lastAIScheduleViewProps?.apiKeyPresent).toBe(true));

    await act(async () => {
      lastAIScheduleViewProps?.onChangeTaskTitle(
        lastAIScheduleViewProps.taskRows[0].id,
        '  Study React  ',
      );
    });

    await act(async () => {
      await lastAIScheduleViewProps?.onGenerate();
    });

    expect(generateScheduleFromTextMock).toHaveBeenCalledWith(
      'sk-new',
      ['Study React'],
      '- Wake-up time: 7:00 AM',
    );
    expect(storeState.setPreviewTasks).toHaveBeenCalledTimes(1);
  });

  it('shows the missing key error when no key is stored', async () => {
    getOpenAIApiKeyMock.mockResolvedValue(null);

    renderAIScheduleScreen();

    await waitFor(() => expect(lastAIScheduleViewProps?.apiKeyPresent).toBe(false));

    await act(async () => {
      await lastAIScheduleViewProps?.onGenerate();
    });

    expect(lastAIScheduleViewProps?.localError).toBe('Add your OpenAI API key in Settings first.');
  });

  it('shows the invalid time error before generating', async () => {
    getOpenAIApiKeyMock.mockResolvedValue('sk-live');

    renderAIScheduleScreen();

    await waitFor(() => expect(lastAIScheduleViewProps?.apiKeyPresent).toBe(true));

    await act(async () => {
      lastAIScheduleViewProps?.onChangeTaskTitle(
        lastAIScheduleViewProps.taskRows[0].id,
        'Study React',
      );
    });

    await act(async () => {
      lastAIScheduleViewProps?.onChangeStartTime('oops');
    });

    await act(async () => {
      await lastAIScheduleViewProps?.onGenerate();
    });

    expect(generateScheduleFromTextMock).not.toHaveBeenCalled();
    expect(lastAIScheduleViewProps?.localError).toBe('Use 24-hour start time like 09:00.');
  });
});
