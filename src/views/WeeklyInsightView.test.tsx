import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import type { WeeklyInsightSummary } from '../types/insight';
import { WeeklyInsightView } from './WeeklyInsightView';

const summary: WeeklyInsightSummary = {
  dateRange: 'Apr 21 - Apr 28',
  headline: 'You are most productive in the morning',
  basedOn: 'Based on your last 7 days',
  completionPercent: 76,
  skippedPercent: 24,
  peakHourLabel: '10 AM',
  timeChart: [
    { label: '8', value: 1 },
    { label: '10', value: 4 },
    { label: '12', value: 3 },
    { label: '2', value: 1 },
    { label: '4', value: 0 },
    { label: '6', value: 0 },
  ],
  patterns: [
    { label: 'After 4 PM', text: 'Completion rate drops sharply.' },
    { label: 'Long tasks', text: '90-min blocks often left unfinished.' },
  ],
  suggestions: [
    {
      text: 'Reserve deep work for the morning, before other meetings.',
      action: 'Apply to tomorrow',
    },
  ],
  reflection: 'Your schedule is improving compared to last week.',
};

function renderWeeklyInsightView(
  overrideProps: Partial<React.ComponentProps<typeof WeeklyInsightView>> = {},
) {
  return render(
    <PaperProvider>
      <WeeklyInsightView
        summary={summary}
        aiInsightsEnabled={false}
        onOptimizeTomorrow={jest.fn()}
        {...overrideProps}
      />
    </PaperProvider>,
  );
}

describe('WeeklyInsightView', () => {
  it('shows local weekly success metrics without AI insights', () => {
    renderWeeklyInsightView();

    expect(screen.getByText('Weekly Insight')).toBeOnTheScreen();
    expect(screen.getByText('76%')).toBeOnTheScreen();
    expect(screen.queryByText('Patterns')).not.toBeOnTheScreen();
    expect(screen.queryByText('Suggestions')).not.toBeOnTheScreen();
    expect(screen.queryByText('Completion rate drops sharply.')).not.toBeOnTheScreen();
  });

  it('shows AI patterns and suggestions when AI insights are enabled', () => {
    renderWeeklyInsightView({ aiInsightsEnabled: true });

    expect(screen.getByText('Patterns')).toBeOnTheScreen();
    expect(screen.getByText('Suggestions')).toBeOnTheScreen();
    expect(screen.getByText('Completion rate drops sharply.')).toBeOnTheScreen();
    expect(
      screen.getByText('Reserve deep work for the morning, before other meetings.'),
    ).toBeOnTheScreen();
  });

  it('uses green for the peak time bar and completed progress', () => {
    renderWeeklyInsightView();

    expect(screen.getByTestId('weekly-time-chart-bar-10').props.style.backgroundColor).toBe(
      '#01B224',
    );
    expect(screen.getByTestId('weekly-time-chart-bar-12').props.style.backgroundColor).not.toBe(
      '#01B224',
    );
    expect(screen.getByTestId('weekly-completion-progress-bar').props.className).toContain(
      'bg-[#01B224]',
    );
  });

  it('highlights every tied peak time bar in green', () => {
    renderWeeklyInsightView({
      summary: {
        ...summary,
        timeChart: [
          { label: '8', value: 4 },
          { label: '10', value: 4 },
          { label: '12', value: 2 },
          { label: '2', value: 0 },
          { label: '4', value: 0 },
          { label: '6', value: 0 },
        ],
      },
    });

    expect(screen.getByTestId('weekly-time-chart-bar-8').props.style.backgroundColor).toBe(
      '#01B224',
    );
    expect(screen.getByTestId('weekly-time-chart-bar-10').props.style.backgroundColor).toBe(
      '#01B224',
    );
    expect(screen.getByTestId('weekly-time-chart-bar-12').props.style.backgroundColor).not.toBe(
      '#01B224',
    );
  });
});
