import * as Notifications from 'expo-notifications';
import type { Task } from '../types/task';
import { formatDisplayTime } from '../utils/time';
import { updateTaskNotificationId } from './db';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleTaskNotification(task: Task): Promise<string | null> {
  if (task.status !== 'scheduled') return null;

  const startDate = new Date(task.startTime);
  if (startDate.getTime() <= Date.now()) return null;

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Time to start: ${task.title}`,
      body: `Scheduled until ${formatDisplayTime(task.endTime)}`,
      data: { taskId: task.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: startDate,
    },
  });

  await updateTaskNotificationId(task.id, id);
  return id;
}

export async function cancelTaskNotification(notificationId?: string | null): Promise<void> {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function rescheduleFutureNotifications(tasks: Task[]): Promise<void> {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  for (const task of tasks) {
    if (task.notificationId) {
      await cancelTaskNotification(task.notificationId);
      await updateTaskNotificationId(task.id, null);
    }
    await scheduleTaskNotification({ ...task, notificationId: null });
  }
}
