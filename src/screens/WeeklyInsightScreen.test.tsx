import React, { type ComponentProps } from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import { getOpenAIApiKey } from '../services/apiKey';
import { useTaskStore } from '../store/taskStore';
import { WeeklyInsightScreen } from './WeeklyInsightScreen';

jest.mock('../services/apiKey', () => ({
  getOpenAIApiKey: jest.fn(),
}));

jest.mock('../store/taskStore', () => ({
  useTaskStore: jest.fn(),
}));

let lastWeeklyInsightViewProps: ComponentProps<
  typeof import('../views/WeeklyInsightView').WeeklyInsightView
> | null = null;
const mockReact = React;
const mockReactNative = ReactNative;

jest.mock('../views/WeeklyInsightView', () => {
  return {
    WeeklyInsightView: (
      props: ComponentProps<typeof import('../views/WeeklyInsightView').WeeklyInsightView>,
    ) => {
      lastWeeklyInsightViewProps = props;
      return mockReact.createElement(
        mockReactNative.View,
        null,
        mockReact.createElement(
          mockReactNative.Text,
          null,
          props.aiInsightsEnabled ? 'ai-insights-enabled' : 'ai-insights-disabled',
        ),
      );
    },
  };
});

function renderWeeklyInsightScreen() {
  const navigation = {
    navigate: jest.fn(),
  };

  return render(
    <WeeklyInsightScreen
      navigation={navigation as never}
      route={{ key: 'weekly-key', name: 'WeeklyInsight' } as never}
    />,
  );
}

describe('WeeklyInsightScreen', () => {
  const getOpenAIApiKeyMock = jest.mocked(getOpenAIApiKey);
  const useTaskStoreMock = useTaskStore as unknown as jest.Mock;

  beforeEach(() => {
    lastWeeklyInsightViewProps = null;
    getOpenAIApiKeyMock.mockReset();
    getOpenAIApiKeyMock.mockResolvedValue(null);
    useTaskStoreMock.mockImplementation((selector: unknown) => {
      if (typeof selector !== 'function') return { tasks: [] };
      return selector({ tasks: [] });
    });
  });

  it('enables AI insight sections when an API key is stored', async () => {
    getOpenAIApiKeyMock.mockResolvedValueOnce('sk-live');

    renderWeeklyInsightScreen();

    await waitFor(() => expect(lastWeeklyInsightViewProps?.aiInsightsEnabled).toBe(true));
  });
});
