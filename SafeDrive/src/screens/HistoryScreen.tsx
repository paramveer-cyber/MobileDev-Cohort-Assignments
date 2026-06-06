import { BauhausDecor } from "@/components/shared/BauhausDecor";
import { EventBadge } from "@/components/shared/EventBadge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useDriveHistory } from "@/hooks/use-drive-history";
import type { DriveEventType, DriveSession } from "@/utils/driveTypes";
import { getScoreColor } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SessionCardProps = {
  session: DriveSession;
  onPress: () => void;
  onLongPress: () => void;
};

function SessionCard({ session, onPress, onLongPress }: SessionCardProps) {
  const { theme } = useTheme();
  const uniqueEventTypes = [
    ...new Set(session.events.map((e) => e.type as DriveEventType)),
  ];

  return (
    <TouchableOpacity
      style={[
        styles.sessionCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <View style={styles.sessionCardLeft}>
        <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>
          {formatDate(session.startedAt)} · {formatTime(session.startedAt)}
        </Text>
        <Text style={[styles.sessionDuration, { color: theme.text }]}>
          {formatDuration(session.durationSeconds)}
        </Text>
        <Text style={[styles.sessionEvents, { color: theme.textSecondary }]}>
          {session.events.length} event{session.events.length !== 1 ? "s" : ""}
          {" · "}
          <Text
            style={{
              color: getScoreColor(session.finalScore, theme),
              fontWeight: "600",
            }}
          >
            {session.safetyRating}
          </Text>
        </Text>
        {uniqueEventTypes.length > 0 && (
          <View style={styles.eventBadgesRow}>
            {uniqueEventTypes.slice(0, 3).map((type) => (
              <EventBadge
                key={type}
                type={type}
                compact
                count={session.events.filter((e) => e.type === type).length}
              />
            ))}
            {uniqueEventTypes.length > 3 && (
              <Text style={[styles.moreEvents, { color: theme.textSecondary }]}>
                +{uniqueEventTypes.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.sessionCardRight}>
        <ScoreRing
          score={session.finalScore}
          size={64}
          strokeWidth={6}
          showRating={false}
        />
        <Text
          style={[
            styles.scoreLabel,
            { color: getScoreColor(session.finalScore, theme) },
          ]}
        >
          {session.finalScore}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function HistoryScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { sessions, loading, refresh, removeSession } = useDriveHistory();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleDeleteSession = (sessionId: string) => {
    Alert.alert(
      "Delete Session",
      "Are you sure you want to delete this drive session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void removeSession(sessionId),
        },
      ],
    );
  };

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

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BauhausDecor variant="history" />

        <View style={styles.header}>
          <View>
            <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>
              SAFE DRIVE
            </Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              History
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.sessionCount, { color: theme.textSecondary }]}>
              {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </Text>
            <ThemeToggle />
          </View>
        </View>

        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={loading}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={() => router.push(`/drive/summary?sessionId=${item.id}`)}
              onLongPress={() => handleDeleteSession(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No drives yet
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.textSecondary }]}
              >
                Complete a drive to see it here
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </KeyboardAvoidingView>
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
  headerLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  headerRight: { alignItems: "flex-end", gap: 4 },
  sessionCount: { fontSize: 12, fontWeight: "500" },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12 },
  sessionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionCardLeft: { flex: 1, paddingRight: 12 },
  sessionDate: { fontSize: 11, fontWeight: "500", marginBottom: 4 },
  sessionDuration: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  sessionEvents: { fontSize: 12, marginBottom: 8 },
  eventBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  moreEvents: { fontSize: 11, fontWeight: "600" },
  sessionCardRight: { alignItems: "center", gap: 2 },
  scoreLabel: { fontSize: 14, fontWeight: "800" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginTop: 20,
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
