import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { TaskFormView } from './TaskFormView';

function renderTaskFormView(
  overrideProps: Partial<React.ComponentProps<typeof TaskFormView>> = {},
) {
  const props: React.ComponentProps<typeof TaskFormView> = {
    mode: 'create',
    title: '',
    start: '07:00',
    end: '07:45',
    status: 'scheduled',
    durationLabel: '45m',
    validation: 'Title is required.',
    loading: false,
    error: null,
    onDismissError: jest.fn(),
    onChangeTitle: jest.fn(),
    onChangeStart: jest.fn(),
    onChangeEnd: jest.fn(),
    onChangeStatus: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    onDelete: jest.fn(),
    ...overrideProps,
  };

  return {
    ...render(
      <PaperProvider>
        <TaskFormView {...props} />
      </PaperProvider>,
    ),
    props,
  };
}

describe('TaskFormView', () => {
  it('renders the current task input-style create screen and its quick add actions', () => {
    const onChangeTitle = jest.fn();
    const onCancel = jest.fn();

    renderTaskFormView({
      onChangeTitle,
      onCancel,
    });

    expect(screen.getByText('Plan your day')).toBeOnTheScreen();
    expect(screen.getByText('Quick add')).toBeOnTheScreen();
    expect(screen.getByText('Confirm schedule')).toBeOnTheScreen();

    fireEvent.press(screen.getByText(/Morning walk/));
    expect(onChangeTitle).toHaveBeenCalledWith('Morning walk');

    fireEvent.press(screen.getByText('Close'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows duration copy and allows save when the form is valid', () => {
    const onSave = jest.fn();

    renderTaskFormView({
      title: 'Morning walk',
      validation: null,
      durationLabel: '45m',
      onSave,
    });

    expect(screen.getByText('Duration: 45m')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Confirm schedule'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors instead of duration when the form is invalid', () => {
    renderTaskFormView({
      title: '',
      validation: 'Title is required.',
    });

    expect(screen.getByText('Title is required.')).toBeOnTheScreen();
    expect(screen.queryByText('Duration: 45m')).not.toBeOnTheScreen();
  });

  it('renders edit-specific controls and routes actions through the current handlers', () => {
    const onChangeStatus = jest.fn();
    const onSave = jest.fn();

    renderTaskFormView({
      mode: 'edit',
      title: 'Review notes',
      validation: null,
      status: 'scheduled',
      onChangeStatus,
      onSave,
    });

    expect(screen.getByText('Edit Task')).toBeOnTheScreen();
    expect(screen.getByText('Task')).toBeOnTheScreen();
    expect(screen.getByText('Schedule')).toBeOnTheScreen();
    expect(screen.getByText('State')).toBeOnTheScreen();
    expect(screen.getByText('Active')).toBeOnTheScreen();
    expect(screen.getByText('Skipped')).toBeOnTheScreen();
    expect(screen.getByText('Completed')).toBeOnTheScreen();
    expect(screen.getByText('In your day')).toBeOnTheScreen();
    expect(screen.getByText('No previous task')).toBeOnTheScreen();
    expect(screen.getByText('Review notes')).toBeOnTheScreen();
    expect(screen.getByText('No next task')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Skipped'));
    expect(onChangeStatus).toHaveBeenCalledWith('skipped');

    fireEvent.press(screen.getByText('Save changes'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
