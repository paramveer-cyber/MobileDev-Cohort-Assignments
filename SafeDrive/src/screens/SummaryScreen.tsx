import { BauhausDecor } from "@/components/shared/BauhausDecor";
import { EventBadge } from "@/components/shared/EventBadge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { useTheme } from "@/context/ThemeContext";
import { loadSession } from "@/db/sessions";
import type { DriveEventType, DriveSession } from "@/utils/driveTypes";
import { EVENT_SCORE_PENALTIES } from "@/utils/driveTypes";
import { getScoreColor } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildBreakdown(session: DriveSession): [DriveEventType, number][] {
  const counts = session.events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1]) as [
    DriveEventType,
    number,
  ][];
}

export function SummaryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [session, setSession] = useState<DriveSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    void loadSession(sessionId).then((data) => {
      setSession(data);
      setLoading(false);
    });
  }, [sessionId]);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator
          color={theme.accent}
          size="large"
          style={{ marginTop: 80 }}
        />
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          Session not found
        </Text>
      </SafeAreaView>
    );
  }

  const breakdown = buildBreakdown(session);
  const totalDeductions = session.events.reduce(
    (sum, event) => sum + EVENT_SCORE_PENALTIES[event.type],
    0,
  );
  const scoreColor = getScoreColor(session.finalScore, theme);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BauhausDecor variant="minimal" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={20} color={theme.accent} />
              <Text style={[styles.backText, { color: theme.accent }]}>
                Back
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>
              TRIP SUMMARY
            </Text>
          </View>

          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            {formatDate(session.startedAt)}
          </Text>

          <View style={styles.scoreSection}>
            <ScoreRing
              score={session.finalScore}
              size={200}
              strokeWidth={16}
              showRating
            />
          </View>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.metaValue, { color: theme.text }]}>
                {formatDuration(session.durationSeconds)}
              </Text>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                Duration
              </Text>
            </View>
            <View
              style={[
                styles.metaCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text
                style={[styles.metaValue, { color: theme.accentSecondary }]}
              >
                {session.events.length}
              </Text>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                Events
              </Text>
            </View>
            <View
              style={[
                styles.metaCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.metaValue, { color: scoreColor }]}>
                −{totalDeductions}
              </Text>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                Deducted
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.scoreBreakdownCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.scoreBreakdownRow}>
              <Text
                style={[
                  styles.scoreBreakdownLabel,
                  { color: theme.textSecondary },
                ]}
              >
                Starting score
              </Text>
              <Text style={[styles.scoreBreakdownValue, { color: theme.text }]}>
                100
              </Text>
            </View>
            {breakdown.map(([type, count]) => (
              <View key={type} style={styles.scoreBreakdownRow}>
                <Text
                  style={[
                    styles.scoreBreakdownLabel,
                    { color: theme.textSecondary },
                  ]}
                >
                  {count}× deduction
                </Text>
                <Text
                  style={[
                    styles.scoreBreakdownValue,
                    { color: theme.accentSecondary },
                  ]}
                >
                  −{EVENT_SCORE_PENALTIES[type] * count}
                </Text>
              </View>
            ))}
            <View
              style={[
                styles.scoreBreakdownDivider,
                { backgroundColor: theme.border },
              ]}
            />
            <View style={styles.scoreBreakdownRow}>
              <Text
                style={[styles.scoreBreakdownFinalLabel, { color: theme.text }]}
              >
                Final score
              </Text>
              <Text
                style={[styles.scoreBreakdownFinalValue, { color: scoreColor }]}
              >
                {session.finalScore}
              </Text>
            </View>
          </View>

          {breakdown.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Event Breakdown
              </Text>
              {breakdown.map(([type, count]) => (
                <EventBadge key={type} type={type} count={count} />
              ))}
            </View>
          )}

          {session.events.length === 0 && (
            <View
              style={[
                styles.perfectCard,
                {
                  backgroundColor: theme.success + "18",
                  borderColor: theme.success + "40",
                },
              ]}
            >
              <Ionicons name="trophy" size={40} color={theme.success} />
              <Text style={[styles.perfectTitle, { color: theme.success }]}>
                Perfect Drive!
              </Text>
              <Text
                style={[styles.perfectSubtitle, { color: theme.textSecondary }]}
              >
                No events detected. Outstanding driving.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: theme.accent }]}
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.85}
          >
            <Text style={[styles.doneButtonText, { color: theme.textInverse }]}>
              BACK TO DASHBOARD
            </Text>
          </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    marginBottom: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  backText: { fontSize: 15, fontWeight: "600" },
  headerLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  dateText: { fontSize: 13, marginBottom: 20 },
  scoreSection: { alignItems: "center", marginBottom: 24 },
  metaRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  metaCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
  },
  metaValue: { fontSize: 17, fontWeight: "800", letterSpacing: -0.3 },
  metaLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 3,
  },
  scoreBreakdownCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  scoreBreakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreBreakdownLabel: { fontSize: 13 },
  scoreBreakdownValue: { fontSize: 13, fontWeight: "600" },
  scoreBreakdownDivider: { height: 1, marginVertical: 4 },
  scoreBreakdownFinalLabel: { fontSize: 15, fontWeight: "700" },
  scoreBreakdownFinalValue: { fontSize: 22, fontWeight: "800" },
  eventsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  perfectCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  perfectTitle: { fontSize: 20, fontWeight: "800" },
  perfectSubtitle: { fontSize: 13, textAlign: "center" },
  doneButton: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: { fontSize: 14, fontWeight: "800", letterSpacing: 2 },
  errorText: { textAlign: "center", marginTop: 80, fontSize: 16 },
});
