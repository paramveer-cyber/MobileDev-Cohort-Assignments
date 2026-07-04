import * as Notifications from "expo-notifications";
import { HABIT_REMINDER_CHANNEL_ID } from "./constants";

const DAILY_SUMMARY_NOTIFICATION_ID = "daily-summary-notification";
const DAILY_SUMMARY_HOUR = 20;
const DAILY_SUMMARY_MINUTE = 0;

export async function scheduleDailySummaryNotificationAsync(pendingHabitCount: number): Promise<void> {
  if (pendingHabitCount <= 0) {
    await cancelDailySummaryNotificationAsync();
    return;
  }
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_SUMMARY_NOTIFICATION_ID,
    content: {
      title: "Habits waiting on you",
      body:
        pendingHabitCount === 1
          ? "You have 1 habit left to log today."
          : `You have ${pendingHabitCount} habits left to log today.`,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: DAILY_SUMMARY_HOUR,
      minute: DAILY_SUMMARY_MINUTE,
      channelId: HABIT_REMINDER_CHANNEL_ID,
    },
  });
}

export async function cancelDailySummaryNotificationAsync(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_SUMMARY_NOTIFICATION_ID);
}
