import { BauhausDecor } from "@/components/shared/BauhausDecor";
import { EventBadge } from "@/components/shared/EventBadge";
import { ScoreFace } from "@/components/ScoreFace";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { TutorialModal } from "@/components/TutorialModal";
import { useTheme } from "@/context/ThemeContext";
import { getPref, setPref } from "@/db/sessions";
import { useDriveSession } from "@/hooks/use-drive-session";
import { EVENT_LABELS, type DriveEventType } from "@/utils/driveTypes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatElapsed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0)
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function buildEventBreakdown(
  events: { type: DriveEventType }[],
): Record<DriveEventType, number> {
  return events.reduce<Record<DriveEventType, number>>(
    (acc, event) => {
      acc[event.type] = (acc[event.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<DriveEventType, number>,
  );
}

export function DriveScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    isActive,
    activeDrive,
    elapsedSeconds,
    startDrive,
    endDrive,
    latestEventType,
  } = useDriveSession();

  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [tutorialChecked, setTutorialChecked] = useState(false);

  const eventFlashOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    getPref("has_seen_tutorial").then((value) => {
      if (!value) setTutorialVisible(true);
      setTutorialChecked(true);
    });
  }, []);

  const handleTutorialDismiss = () => {
    setTutorialVisible(false);
    void setPref("has_seen_tutorial", "true");
  };

  useEffect(() => {
    if (latestEventType) {
      Animated.sequence([
        Animated.timing(eventFlashOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(eventFlashOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [latestEventType, eventFlashOpacity]);

  useEffect(() => {
    if (isActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.04,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimRef.current = pulse;
      pulse.start();
    } else {
      pulseAnimRef.current?.stop();
      pulseScale.setValue(1);
    }
  }, [isActive, pulseScale]);

  const handleEndDrive = async () => {
    Alert.alert(
      "End Drive?",
      "This will stop recording and save your session.",
      [
        { text: "Keep Driving", style: "cancel" },
        {
          text: "End Drive",
          style: "destructive",
          onPress: async () => {
            const sessionId = await endDrive();
            if (sessionId) {
              router.push(`/drive/summary?sessionId=${sessionId}`);
            }
          },
        },
      ],
    );
  };

  const eventBreakdown = activeDrive
    ? buildEventBreakdown(activeDrive.events)
    : {};
  const eventBreakdownEntries = Object.entries(eventBreakdown) as [
    DriveEventType,
    number,
  ][];

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BauhausDecor variant="drive" />

        <View style={styles.header}>
          <View>
            <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>
              SAFE DRIVE
            </Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {isActive ? "Recording" : "Ready"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setTutorialVisible(true)}
              style={styles.helpButton}
            >
              <Ionicons name="help-circle-outline" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.scoreSection}>
            <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
              <ScoreFace
                score={activeDrive?.currentScore ?? 100}
                size={180}
                showRating
                labelOverride={isActive ? undefined : "Ready"}
              />
            </Animated.View>
            {isActive && (
              <View style={styles.timerRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: theme.accentSecondary },
                  ]}
                />
                <Text style={[styles.timerText, { color: theme.text }]}>
                  {formatElapsed(elapsedSeconds)}
                </Text>
              </View>
            )}
          </View>

          {isActive && (
            <View style={styles.liveStatsRow}>
              <View
                style={[
                  styles.liveStatCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text
                  style={[
                    styles.liveStatNumber,
                    { color: theme.accentSecondary },
                  ]}
                >
                  {activeDrive?.events.length ?? 0}
                </Text>
                <Text
                  style={[styles.liveStatLabel, { color: theme.textSecondary }]}
                >
                  Events
                </Text>
              </View>
              <View
                style={[
                  styles.liveStatCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.liveStatNumber, { color: theme.accent }]}>
                  {formatElapsed(elapsedSeconds)}
                </Text>
                <Text
                  style={[styles.liveStatLabel, { color: theme.textSecondary }]}
                >
                  Duration
                </Text>
              </View>
            </View>
          )}

          {latestEventType && (
            <Animated.View
              style={[
                styles.eventFlash,
                {
                  backgroundColor: theme.accentSecondary + "18",
                  borderColor: theme.accentSecondary + "40",
                },
                { opacity: eventFlashOpacity },
              ]}
            >
              <Ionicons
                name="warning"
                size={16}
                color={theme.accentSecondary}
              />
              <Text
                style={[
                  styles.eventFlashText,
                  { color: theme.accentSecondary },
                ]}
              >
                {EVENT_LABELS[latestEventType]} detected
              </Text>
            </Animated.View>
          )}

          {!isActive && (
            <View
              style={[
                styles.instructionsCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.instructionsTitle, { color: theme.text }]}>
                How It Works
              </Text>
              {[
                "Place your phone in a holder while driving",
                "Sensors detect harsh braking, sharp turns, and phone handling",
                "Your score starts at 100 and deducts per event",
              ].map((text) => (
                <View key={text} style={styles.instructionItem}>
                  <Ionicons
                    name="ellipse"
                    size={6}
                    color={theme.accent}
                    style={styles.instructionDot}
                  />
                  <Text
                    style={[
                      styles.instructionText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {isActive && eventBreakdownEntries.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Live Events
              </Text>
              {eventBreakdownEntries.map(([type, count]) => (
                <EventBadge key={type} type={type} count={count} />
              ))}
            </View>
          )}

          <View style={styles.buttonSection}>
            {!isActive ? (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.accent },
                ]}
                onPress={startDrive}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.textInverse },
                  ]}
                >
                  START DRIVE
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.accentSecondary },
                ]}
                onPress={handleEndDrive}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.textInverse },
                  ]}
                >
                  END DRIVE
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TutorialModal
        visible={tutorialVisible && tutorialChecked}
        onDismiss={handleTutorialDismiss}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  helpButton: {
    padding: 4,
  },
  headerLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  scoreSection: { alignItems: "center", paddingVertical: 24, gap: 16 },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  timerText: { fontSize: 20, fontWeight: "700", letterSpacing: 1 },
  liveStatsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 16,
  },
  liveStatCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  liveStatNumber: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  liveStatLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 3,
  },
  eventFlash: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  eventFlashText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.3 },
  instructionsCard: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginBottom: 24,
    gap: 10,
  },
  instructionsTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  instructionItem: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  instructionDot: { marginTop: 6 },
  instructionText: { flex: 1, fontSize: 13, lineHeight: 20 },
  eventsSection: { width: "100%", marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  buttonSection: { width: "100%" },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontSize: 16, fontWeight: "800", letterSpacing: 2 },
});
