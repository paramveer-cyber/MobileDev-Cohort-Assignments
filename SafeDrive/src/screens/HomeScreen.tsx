import { BauhausDecor } from "@/components/shared/BauhausDecor";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useDriveHistory } from "@/hooks/use-drive-history";
import {
  EVENT_IONICONS,
  EVENT_LABELS,
  type DriveEventType,
} from "@/utils/driveTypes";
import { getScoreColor, getScoreRating } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessions, loading, refresh } = useDriveHistory();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const recentSession = sessions[0] ?? null;
  const averageScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.finalScore, 0) / sessions.length,
        )
      : 100;

  const totalDrives = sessions.length;
  const totalEvents = sessions.reduce((sum, s) => sum + s.events.length, 0);

  const eventTypeCounts = sessions
    .flatMap((s) => s.events)
    .reduce<Record<string, number>>((acc, event) => {
      acc[event.type] = (acc[event.type] ?? 0) + 1;
      return acc;
    }, {});

  const topEventType = Object.entries(eventTypeCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BauhausDecor variant="home" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View>
              <Text
                style={[styles.headerGreeting, { color: theme.textSecondary }]}
              >
                SAFE DRIVE
              </Text>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Dashboard
              </Text>
            </View>
            <ThemeToggle />
          </View>

          <View
            style={[
              styles.heroCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.heroLeft}>
              <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
                AVERAGE SCORE
              </Text>
              <Text
                style={[styles.heroSubLabel, { color: theme.textSecondary }]}
              >
                {totalDrives} drive{totalDrives !== 1 ? "s" : ""} total
              </Text>
              {topEventType && (
                <View style={styles.topEventRow}>
                  <Ionicons
                    name={EVENT_IONICONS[topEventType[0] as DriveEventType]}
                    size={14}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.topEventLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {EVENT_LABELS[topEventType[0] as DriveEventType]} most
                    frequent
                  </Text>
                </View>
              )}
            </View>
            <ScoreRing score={averageScore} size={120} showRating />
          </View>

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.statNumber, { color: theme.accent }]}>
                {totalDrives}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Drives
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text
                style={[styles.statNumber, { color: theme.accentSecondary }]}
              >
                {totalEvents}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Events
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.statNumber,
                  { color: getScoreColor(averageScore, theme) },
                ]}
              >
                {getScoreRating(averageScore)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Rating
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.startDriveButton, { backgroundColor: theme.accent }]}
            onPress={() => router.push("/(tabs)/drive")}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.startDriveButtonText,
                { color: theme.textInverse },
              ]}
            >
              START DRIVE
            </Text>
            <View
              style={[
                styles.startArrow,
                { backgroundColor: theme.textInverse + "30" },
              ]}
            >
              <Ionicons
                name="arrow-forward"
                size={18}
                color={theme.textInverse}
              />
            </View>
          </TouchableOpacity>

          {recentSession && (
            <View style={styles.recentSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Last Drive
              </Text>
              <TouchableOpacity
                style={[
                  styles.recentCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
                onPress={() =>
                  router.push(`/drive/summary?sessionId=${recentSession.id}`)
                }
                activeOpacity={0.8}
              >
                <View style={styles.recentCardTop}>
                  <View style={styles.recentCardLeft}>
                    <Text
                      style={[
                        styles.recentDate,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {formatDate(recentSession.startedAt)}
                    </Text>
                    <Text
                      style={[styles.recentDuration, { color: theme.text }]}
                    >
                      {formatDuration(recentSession.durationSeconds)}
                    </Text>
                    <Text
                      style={[
                        styles.recentEvents,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {recentSession.events.length} event
                      {recentSession.events.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <ScoreRing
                    score={recentSession.finalScore}
                    size={72}
                    strokeWidth={7}
                    showRating={false}
                  />
                </View>
                <Text style={[styles.viewDetails, { color: theme.accent }]}>
                  View details →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {sessions.length === 0 && !loading && (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Ionicons
                name="car-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No drives yet
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.textSecondary }]}
              >
                Start your first drive to see your safety score
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 16,
    marginBottom: 24,
  },
  headerGreeting: { fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroLeft: { flex: 1, paddingRight: 16 },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroSubLabel: { fontSize: 13, marginBottom: 12 },
  topEventRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  topEventLabel: { fontSize: 11, flex: 1 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
  },
  statNumber: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  startDriveButton: {
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  startDriveButtonText: { fontSize: 16, fontWeight: "800", letterSpacing: 2 },
  startArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  recentSection: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  recentCard: { borderRadius: 14, borderWidth: 1, padding: 16 },
  recentCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentCardLeft: { flex: 1 },
  recentDate: { fontSize: 11, fontWeight: "500", marginBottom: 4 },
  recentDuration: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  recentEvents: { fontSize: 12, marginTop: 2 },
  viewDetails: { fontSize: 13, fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginTop: 8,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 20,
  },
});
