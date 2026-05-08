import type { GeneratedTaskPreview } from '../types/task';
import { addMinutes } from './time';

const DEFAULT_BUFFER_MINUTES = 5;

export function makeSequentialPreview(
  items: { title: string; durationMinutes: number }[],
  startTime: string,
  bufferMinutes = DEFAULT_BUFFER_MINUTES,
): GeneratedTaskPreview[] {
  let cursor = startTime;

  return items.map((item) => {
    const durationMinutes = clampDuration(item.durationMinutes);
    const taskStart = cursor;
    const taskEnd = addMinutes(taskStart, durationMinutes);
    cursor = addMinutes(taskEnd, bufferMinutes);

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: item.title.trim(),
      durationMinutes,
      startTime: taskStart,
      endTime: taskEnd,
    };
  });
}

export function clampDuration(value: number): number {
  if (!Number.isFinite(value)) return 30;
  return Math.min(240, Math.max(10, Math.round(value)));
}
