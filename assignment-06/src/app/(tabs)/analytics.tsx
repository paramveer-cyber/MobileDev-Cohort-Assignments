import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../../hooks/use-habits";
import { colors, fontFamily, spacing } from "../../lib/design/theme";
import { ComicCard } from "../../components/ComicCard";
import { EmptyState } from "../../components/EmptyState";
import { MascotSleepy } from "../../lib/design/mascots";
import {
  computeBestStreak,
  computeLongestActiveHabitName,
  computeTotalCompletions,
  computeWeeklyCompletionRate,
} from "../../lib/habits/analytics";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ fontFamily: fontFamily.body, fontSize: 15, color: colors.ink, opacity: 0.75 }}>{label}</Text>
      <Text style={{ fontFamily: fontFamily.display, fontSize: 20, color: colors.ink }}>{value}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { habits, isLoading } = useHabits();

  const totalCompletions = computeTotalCompletions(habits);
  const bestStreak = computeBestStreak(habits);
  const weeklyCompletionRate = computeWeeklyCompletionRate(habits);
  const topHabitName = computeLongestActiveHabitName(habits);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }} edges={["top"]}>
      <View style={{ padding: spacing.lg, gap: spacing.lg, flex: 1 }}>
        <Text style={{ fontFamily: fontFamily.display, fontSize: 32, color: colors.ink }}>Analytics</Text>

        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.ink} />
          </View>
        ) : habits.length === 0 ? (
          <EmptyState mascot={<MascotSleepy />} title="No habits yet" subtitle="Add a habit to see your stats here." />
        ) : (
          <>
            <ComicCard style={{ gap: spacing.md }}>
              <StatRow label="Total habits" value={String(habits.length)} />
              <StatRow label="Total completions" value={String(totalCompletions)} />
              <StatRow label="Best streak" value={`${bestStreak} days`} />
              <StatRow label="This week" value={`${weeklyCompletionRate}%`} />
            </ComicCard>

            {topHabitName && (
              <ComicCard style={{ gap: spacing.xs }}>
                <Text style={{ fontFamily: fontFamily.heading, fontSize: 15, color: colors.ink }}>On a roll</Text>
                <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, opacity: 0.75 }}>
                  {topHabitName} has your longest active streak.
                </Text>
              </ComicCard>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
