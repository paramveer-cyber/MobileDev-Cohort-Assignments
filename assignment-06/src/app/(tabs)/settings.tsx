import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePushNotifications } from "../../hooks/use-push-notifications";
import { useQuietHours } from "../../hooks/use-quiet-hours";
import { useHabits } from "../../hooks/use-habits";
import { colors, fontFamily, radii, spacing, strokeWidth } from "../../lib/design/theme";
import { formatClockTime12Hour } from "../../lib/habits/format";
import { sendTestPushFromBackendAsync } from "../../lib/notifications/push";
import { ComicCard } from "../../components/ComicCard";
import { PlayfulButton } from "../../components/PlayfulButton";
import { BellIcon, BellOffIcon, CopyIcon, MoonIcon, SendIcon } from "../../lib/design/icons";
import { MascotShrug, MascotWaving } from "../../lib/design/mascots";

const PERMISSION_LABEL: Record<string, string> = {
  granted: "Notifications are on",
  denied: "Notifications are off",
  undetermined: "Not asked yet",
};

const BACKEND_STATUS_LABEL: Record<string, string> = {
  idle: "Waiting for a push token",
  registering: "Registering with server…",
  registered: "Server has your token",
  failed: "Couldn't reach the push server",
};

type TestPushStatus = "idle" | "sending" | "sent" | "failed";

const timeFieldStyle = {
  borderWidth: strokeWidth.thick,
  borderColor: colors.ink,
  borderRadius: radii.md,
  padding: spacing.sm,
  width: 56,
  textAlign: "center" as const,
  fontFamily: fontFamily.body,
  fontSize: 16,
  color: colors.ink,
  backgroundColor: colors.paper,
};

export default function SettingsScreen() {
  const { permissionState, expoPushToken, backendRegistrationState, requestPermission, openSystemSettings } =
    usePushNotifications();
  const { quietHours, updateQuietHours } = useQuietHours();
  const { habits } = useHabits();
  const [copyLabel, setCopyLabel] = useState("Copy token");
  const [testPushStatus, setTestPushStatus] = useState<TestPushStatus>("idle");
  const [startHourText, setStartHourText] = useState(String(quietHours.startHour));
  const [startMinuteText, setStartMinuteText] = useState(String(quietHours.startMinute));
  const [endHourText, setEndHourText] = useState(String(quietHours.endHour));
  const [endMinuteText, setEndMinuteText] = useState(String(quietHours.endMinute));

  async function copyToken() {
    if (!expoPushToken) return;
    await Clipboard.setStringAsync(expoPushToken);
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel("Copy token"), 1500);
  }

  async function sendTestPush() {
    if (!expoPushToken) return;
    setTestPushStatus("sending");
    const habitToDeepLinkTo = habits[0];
    const didSend = await sendTestPushFromBackendAsync(expoPushToken, {
      title: habitToDeepLinkTo ? `Time for ${habitToDeepLinkTo.emoji} ${habitToDeepLinkTo.name}` : "Streak nudge",
      body: "Tap to open the habit tracker.",
      data: habitToDeepLinkTo ? { screen: "/habit", habitId: habitToDeepLinkTo.id } : {},
    });
    setTestPushStatus(didSend ? "sent" : "failed");
    setTimeout(() => setTestPushStatus("idle"), 2500);
  }

  async function toggleQuietHours() {
    await updateQuietHours({ ...quietHours, enabled: !quietHours.enabled });
  }

  async function saveQuietHoursWindow() {
    await updateQuietHours({
      ...quietHours,
      startHour: Number(startHourText),
      startMinute: Number(startMinuteText),
      endHour: Number(endHourText),
      endMinute: Number(endMinuteText),
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <Text style={{ fontFamily: fontFamily.display, fontSize: 32, color: colors.ink }}>Settings</Text>

        <ComicCard style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            {permissionState === "granted" ? <BellIcon /> : <BellOffIcon />}
            <Text style={{ fontFamily: fontFamily.heading, fontSize: 18, color: colors.ink }}>
              {PERMISSION_LABEL[permissionState]}
            </Text>
          </View>

          {permissionState !== "granted" && (
            <View style={{ alignItems: "center", gap: spacing.sm }}>
              {permissionState === "denied" ? <MascotShrug size={90} /> : <MascotWaving size={90} />}
              <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, opacity: 0.7, textAlign: "center" }}>
                {permissionState === "denied"
                  ? "Habit reminders can't reach you. Turn them back on in system settings."
                  : "Turn on notifications so your habit reminders can find you."}
              </Text>
            </View>
          )}

          {permissionState === "denied" ? (
            <PlayfulButton label="Open system settings" tone="outline" onPress={openSystemSettings} />
          ) : permissionState === "undetermined" ? (
            <PlayfulButton label="Turn on notifications" tone="blue" onPress={requestPermission} />
          ) : null}
        </ComicCard>

        <ComicCard style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <MoonIcon />
            <Text style={{ fontFamily: fontFamily.heading, fontSize: 18, color: colors.ink }}>Quiet hours</Text>
          </View>
          <Text style={{ fontFamily: fontFamily.body, fontSize: 13, color: colors.ink, opacity: 0.65 }}>
            Reminders that would land in this window get pushed to right after it ends.
          </Text>

          <PlayfulButton
            label={quietHours.enabled ? "Quiet hours on" : "Quiet hours off"}
            tone={quietHours.enabled ? "green" : "outline"}
            onPress={toggleQuietHours}
          />

          {quietHours.enabled && (
            <View style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, width: 44 }}>From</Text>
                <TextInput value={startHourText} onChangeText={setStartHourText} keyboardType="number-pad" style={timeFieldStyle} />
                <Text style={{ fontFamily: fontFamily.display, fontSize: 18, color: colors.ink }}>:</Text>
                <TextInput value={startMinuteText} onChangeText={setStartMinuteText} keyboardType="number-pad" style={timeFieldStyle} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, width: 44 }}>Until</Text>
                <TextInput value={endHourText} onChangeText={setEndHourText} keyboardType="number-pad" style={timeFieldStyle} />
                <Text style={{ fontFamily: fontFamily.display, fontSize: 18, color: colors.ink }}>:</Text>
                <TextInput value={endMinuteText} onChangeText={setEndMinuteText} keyboardType="number-pad" style={timeFieldStyle} />
              </View>
              <Text style={{ fontFamily: fontFamily.body, fontSize: 13, color: colors.ink, opacity: 0.65 }}>
                {formatClockTime12Hour(Number(startHourText) || 0, Number(startMinuteText) || 0)} →{" "}
                {formatClockTime12Hour(Number(endHourText) || 0, Number(endMinuteText) || 0)}
              </Text>
              <PlayfulButton label="Save quiet hours" tone="blue" onPress={saveQuietHoursWindow} />
            </View>
          )}
        </ComicCard>

        <ComicCard style={{ gap: spacing.md }}>
          <Text style={{ fontFamily: fontFamily.heading, fontSize: 18, color: colors.ink }}>Expo push token</Text>
          <Text
            selectable
            style={{ fontFamily: fontFamily.bodyRegular, fontSize: 12, color: colors.ink, opacity: 0.7 }}
          >
            {expoPushToken ?? "Not registered yet. Grant permission on a physical device."}
          </Text>
          {expoPushToken && (
            <PlayfulButton
              label={copyLabel}
              tone="outline"
              icon={<CopyIcon size={16} />}
              onPress={copyToken}
            />
          )}
        </ComicCard>

        <ComicCard style={{ gap: spacing.md }}>
          <Text style={{ fontFamily: fontFamily.heading, fontSize: 18, color: colors.ink }}>Push server</Text>
          <Text style={{ fontFamily: fontFamily.body, fontSize: 13, color: colors.ink, opacity: 0.65 }}>
            {BACKEND_STATUS_LABEL[backendRegistrationState]}
          </Text>
          <PlayfulButton
            label={
              testPushStatus === "sending"
                ? "Sending…"
                : testPushStatus === "sent"
                ? "Sent! Check your tray"
                : testPushStatus === "failed"
                ? "Couldn't send, try again"
                : "Send test push"
            }
            tone={testPushStatus === "sent" ? "green" : testPushStatus === "failed" ? "red" : "yellow"}
            icon={<SendIcon size={16} />}
            disabled={!expoPushToken || testPushStatus === "sending"}
            onPress={sendTestPush}
          />
        </ComicCard>
      </ScrollView>
    </SafeAreaView>
  );
}
