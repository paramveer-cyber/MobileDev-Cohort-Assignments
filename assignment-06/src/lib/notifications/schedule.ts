import * as Notifications from "expo-notifications";
import { Frequency, Habit } from "../habits/types";
import { HABIT_REMINDER_CHANNEL_ID, HABIT_REMINDER_CATEGORY_ID } from "./constants";
import { getQuietHours, shiftTimeOutsideQuietHours } from "../habits/quiet-hours-storage";

function buildNotificationContent(habit: Habit): Notifications.NotificationContentInput {
  return {
    title: `Time for ${habit.emoji} ${habit.name}`,
    body: "Tap to log it.",
    data: { screen: "/habit", habitId: habit.id },
    sound: "default",
    categoryIdentifier: HABIT_REMINDER_CATEGORY_ID,
  };
}

async function buildTriggersForFrequency(frequency: Frequency): Promise<Notifications.NotificationTriggerInput[]> {
  if (frequency.kind === "interval") {
    return [
      {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: frequency.hours * 60 * 60,
        repeats: true,
        channelId: HABIT_REMINDER_CHANNEL_ID,
      },
    ];
  }

  const quietHours = await getQuietHours();
  const { hour: shiftedHour, minute: shiftedMinute } = shiftTimeOutsideQuietHours(
    frequency.hour,
    frequency.minute,
    quietHours
  );

  if (frequency.kind === "daily") {
    return [
      {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: shiftedHour,
        minute: shiftedMinute,
        channelId: HABIT_REMINDER_CHANNEL_ID,
      },
    ];
  }

  return frequency.weekdays.map((weekday) => ({
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday,
    hour: shiftedHour,
    minute: shiftedMinute,
    channelId: HABIT_REMINDER_CHANNEL_ID,
  }));
}

export async function scheduleHabitRemindersAsync(habit: Habit): Promise<string[]> {
  const content = buildNotificationContent(habit);
  const triggers = await buildTriggersForFrequency(habit.frequency);
  return Promise.all(
    triggers.map((trigger) => Notifications.scheduleNotificationAsync({ content, trigger }))
  );
}

export async function cancelHabitRemindersAsync(notificationIds: string[]): Promise<void> {
  await Promise.all(
    notificationIds.map((notificationId) =>
      Notifications.cancelScheduledNotificationAsync(notificationId)
    )
  );
}

export async function rescheduleHabitRemindersAsync(habit: Habit): Promise<string[]> {
  await cancelHabitRemindersAsync(habit.notificationIds);
  return scheduleHabitRemindersAsync(habit);
}

export async function scheduleSnoozedReminderAsync(habit: Habit, snoozeMinutes: number): Promise<string> {
  const content = buildNotificationContent(habit);
  return Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: snoozeMinutes * 60,
      repeats: false,
      channelId: HABIT_REMINDER_CHANNEL_ID,
    },
  });
}
