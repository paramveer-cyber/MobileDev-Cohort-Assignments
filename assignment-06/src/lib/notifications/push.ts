import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { PUSH_BACKEND_URL } from "./backend";

export type BackendRegistrationState = "idle" | "registering" | "registered" | "failed";

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) return null;

  const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
  return expoPushToken.data;
}

export async function registerTokenWithBackendAsync(expoPushToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${PUSH_BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: expoPushToken }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function unregisterTokenWithBackendAsync(expoPushToken: string): Promise<void> {
  try {
    await fetch(`${PUSH_BACKEND_URL}/unregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: expoPushToken }),
    });
  } catch {
    return;
  }
}

export async function sendTestPushFromBackendAsync(
  expoPushToken: string,
  payload: { title: string; body: string; data?: Record<string, unknown> }
): Promise<boolean> {
  try {
    const response = await fetch(`${PUSH_BACKEND_URL}/send-test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: expoPushToken, ...payload }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
