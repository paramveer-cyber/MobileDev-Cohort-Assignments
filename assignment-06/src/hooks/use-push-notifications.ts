import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";
import {
  PermissionState,
  createHabitReminderChannelAsync,
  getNotificationPermissionStateAsync,
  requestNotificationPermissionAsync,
} from "../lib/notifications/setup";
import {
  BackendRegistrationState,
  registerForPushNotificationsAsync,
  registerTokenWithBackendAsync,
} from "../lib/notifications/push";

export function usePushNotifications() {
  const [permissionState, setPermissionState] = useState<PermissionState>("undetermined");
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [backendRegistrationState, setBackendRegistrationState] = useState<BackendRegistrationState>("idle");

  const refreshPermissionState = useCallback(async () => {
    const currentState = await getNotificationPermissionStateAsync();
    setPermissionState(currentState);
  }, []);

  useEffect(() => {
    createHabitReminderChannelAsync().then(refreshPermissionState);
  }, [refreshPermissionState]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") refreshPermissionState();
    });
    return () => subscription.remove();
  }, [refreshPermissionState]);

  useEffect(() => {
    if (permissionState !== "granted" || expoPushToken) return;
    registerForPushNotificationsAsync().then(setExpoPushToken);
  }, [permissionState, expoPushToken]);

  useEffect(() => {
    if (!expoPushToken) return;
    setBackendRegistrationState("registering");
    registerTokenWithBackendAsync(expoPushToken).then((didSucceed) => {
      setBackendRegistrationState(didSucceed ? "registered" : "failed");
    });
  }, [expoPushToken]);

  const requestPermission = useCallback(async () => {
    const newState = await requestNotificationPermissionAsync();
    setPermissionState(newState);
    return newState;
  }, []);

  const openSystemSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return {
    permissionState,
    expoPushToken,
    backendRegistrationState,
    requestPermission,
    openSystemSettings,
    refreshPermissionState,
  };
}
