import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { AIScheduleView } from './AIScheduleView';

function renderAIScheduleView(
  overrideProps: Partial<React.ComponentProps<typeof AIScheduleView>> = {},
) {
  const props: React.ComponentProps<typeof AIScheduleView> = {
    apiKeyPresent: true,
    taskRows: [{ id: 'task-1', title: 'Study React' }],
    startTime: '09:00',
    generating: false,
    localError: null,
    storeError: null,
    loading: false,
    previewTasks: [],
    canGenerate: false,
    generateStatus: 'Add at least one task to schedule.',
    canConfirmPreview: false,
    onDismissError: jest.fn(),
    onChangeTaskTitle: jest.fn(),
    onAddTaskRow: jest.fn(),
    onRemoveTaskRow: jest.fn(),
    onChangeStartTime: jest.fn(),
    onGenerate: jest.fn(),
    onOpenSettings: jest.fn(),
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    onClearPreview: jest.fn(),
    onChangePreviewTitle: jest.fn(),
    onChangePreviewDuration: jest.fn(),
    ...overrideProps,
  };

  return render(
    <PaperProvider>
      <AIScheduleView {...props} />
    </PaperProvider>,
  );
}

describe('AIScheduleView', () => {
  it('renders the step-based task list UI', () => {
    renderAIScheduleView();

    expect(screen.getByText('Step 1')).toBeOnTheScreen();
    expect(screen.getByText('List what you need to do')).toBeOnTheScreen();
    expect(screen.getByText('Step 2')).toBeOnTheScreen();
    expect(screen.getByText('Choose the start of your day')).toBeOnTheScreen();
    expect(screen.getByText('Step 3')).toBeOnTheScreen();
  });

  it('fires add and remove task row actions', () => {
    const onAddTaskRow = jest.fn();
    const onRemoveTaskRow = jest.fn();

    renderAIScheduleView({
      taskRows: [
        { id: 'task-1', title: 'Study React' },
        { id: 'task-2', title: 'Gym' },
      ],
      onAddTaskRow,
      onRemoveTaskRow,
    });

    fireEvent.press(screen.getByText('Add Another Task'));
    expect(onAddTaskRow).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getAllByText('Remove')[0]);
    expect(onRemoveTaskRow).toHaveBeenCalledWith('task-1');
  });

  it('shows blocked generation messaging', () => {
    renderAIScheduleView({
      canGenerate: false,
      generateStatus: 'Add and verify your OpenAI API key in Settings first.',
    });

    expect(screen.getByText('Generation is blocked')).toBeOnTheScreen();
    expect(
      screen.getByText('Add and verify your OpenAI API key in Settings first.'),
    ).toBeOnTheScreen();
  });

  it('shows ready generation messaging', () => {
    renderAIScheduleView({
      canGenerate: true,
      generateStatus: 'Ready to generate a schedule.',
    });

    expect(screen.getByText('Ready to generate')).toBeOnTheScreen();
    expect(screen.getByText('Ready to generate a schedule.')).toBeOnTheScreen();
  });

  it('shows the settings CTA when no API key is present', () => {
    const onOpenSettings = jest.fn();
    renderAIScheduleView({ apiKeyPresent: false, onOpenSettings });

    expect(screen.getByText('AI generation is disabled.')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Open Settings'));
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
