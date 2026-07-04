import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { router } from "expo-router";
import { HABIT_REMINDER_CHANNEL_ID, HABIT_REMINDER_CATEGORY_ID, SNOOZE_ACTION_ID, SNOOZE_MINUTES } from "./constants";
import { scheduleSnoozedReminderAsync } from "./schedule";
import { getHabitById } from "../habits/storage";

export { HABIT_REMINDER_CHANNEL_ID, HABIT_REMINDER_CATEGORY_ID };

export type PermissionState = "granted" | "denied" | "undetermined";

export type HabitNotificationData = {
  screen: string;
  habitId: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function createHabitReminderChannelAsync(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(HABIT_REMINDER_CHANNEL_ID, {
    name: "Habit Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function registerHabitReminderCategoryAsync(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(HABIT_REMINDER_CATEGORY_ID, [
    {
      identifier: SNOOZE_ACTION_ID,
      buttonTitle: `Snooze ${SNOOZE_MINUTES}m`,
      options: { opensAppToForeground: false },
    },
  ]);
}

export async function getNotificationPermissionStateAsync(): Promise<PermissionState> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as PermissionState;
}

export async function requestNotificationPermissionAsync(): Promise<PermissionState> {
  await createHabitReminderChannelAsync();
  await registerHabitReminderCategoryAsync();
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return "granted";
  const { status } = await Notifications.requestPermissionsAsync();
  return status as PermissionState;
}

export async function updatePendingHabitsBadgeAsync(pendingCount: number): Promise<void> {
  await Notifications.setBadgeCountAsync(pendingCount);
}

function extractHabitNotificationData(rawData: Record<string, unknown> | undefined): Partial<HabitNotificationData> | undefined {
  return rawData as Partial<HabitNotificationData> | undefined;
}

function navigateFromNotificationData(rawData: Record<string, unknown> | undefined): void {
  const data = extractHabitNotificationData(rawData);
  if (data?.screen === "/habit" && data.habitId) {
    router.push(`/habit/${data.habitId}`);
  }
}

async function handleSnoozeActionAsync(rawData: Record<string, unknown> | undefined): Promise<void> {
  const data = extractHabitNotificationData(rawData);
  if (!data?.habitId) return;
  const habit = await getHabitById(data.habitId);
  if (!habit) return;
  await scheduleSnoozedReminderAsync(habit, SNOOZE_MINUTES);
}

function handleNotificationResponse(response: Notifications.NotificationResponse): void {
  const data = response.notification.request.content.data;
  if (response.actionIdentifier === SNOOZE_ACTION_ID) {
    handleSnoozeActionAsync(data);
    return;
  }
  navigateFromNotificationData(data);
}

export function registerNotificationResponseHandler(): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
  return () => subscription.remove();
}

export async function handleColdStartNotificationResponseAsync(): Promise<void> {
  const lastResponse = await Notifications.getLastNotificationResponseAsync();
  if (!lastResponse) return;
  handleNotificationResponse(lastResponse);
}
