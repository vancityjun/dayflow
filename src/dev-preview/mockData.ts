import type { GeneratedTaskPreview, Task, TaskStatus } from '../types/task';
import { addMinutes } from '../utils/time';

function createTaskId(label: string): string {
  return `mock-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function atToday(hours: number, minutes: number): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export function buildMockTask(
  title: string,
  startTime: string,
  endTime: string,
  status: TaskStatus = 'scheduled',
): Task {
  const now = new Date().toISOString();
  return {
    id: createTaskId(`${title}-${startTime}`),
    title,
    startTime,
    endTime,
    status,
    aiGenerated: false,
    createdAt: now,
    updatedAt: now,
    actualStartTime: null,
    actualEndTime: null,
    notificationId: null,
    description: null,
    category: null,
  };
}

export function makeActiveDayTasks(): Task[] {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setMinutes(now.getMinutes() - 15, 0, 0);
  const currentEnd = new Date(now);
  currentEnd.setMinutes(now.getMinutes() + 35, 0, 0);

  return [
    buildMockTask('Morning routine', atToday(7, 0), atToday(7, 45), 'completed'),
    buildMockTask('Inbox & standup', atToday(8, 0), atToday(8, 45), 'completed'),
    buildMockTask('Deep work', atToday(9, 0), atToday(10, 30), 'completed'),
    buildMockTask('Coffee walk', atToday(10, 45), atToday(11, 0), 'skipped'),
    buildMockTask(
      'Design review',
      currentStart.toISOString(),
      currentEnd.toISOString(),
      'scheduled',
    ),
    buildMockTask('Lunch', addMinutes(currentEnd, 10), addMinutes(currentEnd, 55), 'scheduled'),
    buildMockTask(
      'Study React',
      addMinutes(currentEnd, 90),
      addMinutes(currentEnd, 150),
      'scheduled',
    ),
  ];
}

export function makeCompletedHeavyTasks(): Task[] {
  return [
    buildMockTask('Morning routine', atToday(7, 0), atToday(7, 45), 'completed'),
    buildMockTask('Planning', atToday(8, 0), atToday(8, 30), 'completed'),
    buildMockTask('Client sync', atToday(9, 0), atToday(10, 0), 'completed'),
    buildMockTask('Workout', atToday(18, 0), atToday(19, 0), 'scheduled'),
  ];
}

export function makeGeneratedPreviewTasks(): GeneratedTaskPreview[] {
  const firstStart = atToday(9, 0);
  const secondStart = addMinutes(firstStart, 50);
  const thirdStart = addMinutes(secondStart, 65);

  return [
    {
      id: 'preview-study-react',
      title: 'Study React hooks',
      durationMinutes: 45,
      startTime: firstStart,
      endTime: addMinutes(firstStart, 45),
    },
    {
      id: 'preview-gym',
      title: 'Gym session',
      durationMinutes: 60,
      startTime: secondStart,
      endTime: addMinutes(secondStart, 60),
    },
    {
      id: 'preview-groceries',
      title: 'Groceries',
      durationMinutes: 30,
      startTime: thirdStart,
      endTime: addMinutes(thirdStart, 30),
    },
  ];
}
