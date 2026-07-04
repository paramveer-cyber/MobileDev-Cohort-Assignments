import { useCallback } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../../hooks/use-habits";
import { colors, fontFamily, spacing } from "../../lib/design/theme";
import { ComicCard } from "../../components/ComicCard";
import { PlayfulButton } from "../../components/PlayfulButton";
import { IconButton } from "../../components/IconButton";
import { EmptyState } from "../../components/EmptyState";
import { StreakCalendar } from "../../components/StreakCalendar";
import { CheckIcon, ChevronLeftIcon, FlameIcon, PencilIcon, TrashIcon } from "../../lib/design/icons";
import { MascotCelebrating, MascotShrug } from "../../lib/design/mascots";
import { formatClockTime12Hour, formatIntervalHours } from "../../lib/habits/format";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HabitDetailScreen() {
  const { id: habitId } = useLocalSearchParams<{ id: string }>();
  const { habits, isLoading, completeHabitForToday, removeHabit, reloadHabits } = useHabits();

  useFocusEffect(
    useCallback(() => {
      reloadHabits();
    }, [reloadHabits])
  );

  const habit = habits.find((existingHabit) => existingHabit.id === habitId);

  function confirmDelete() {
    if (!habit) return;
    Alert.alert("Delete habit", `Delete "${habit.name}"? This can't be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeHabit(habit.id);
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={{ padding: spacing.lg, gap: spacing.lg, flex: 1 }}>
        <IconButton icon={<ChevronLeftIcon size={22} />} onPress={() => router.back()} style={{ alignSelf: "flex-start" }} />

        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.ink} />
          </View>
        ) : !habit ? (
          <EmptyState mascot={<MascotShrug />} title="Habit not found" subtitle="It may have already been deleted." />
        ) : (
          <>
            {(() => {
              const completedToday =
                habit.lastCompletedISO?.slice(0, 10) === new Date().toISOString().slice(0, 10);
              const frequencyLabel =
                habit.frequency.kind === "daily"
                  ? `Every day · ${formatClockTime12Hour(habit.frequency.hour, habit.frequency.minute)}`
                  : habit.frequency.kind === "weekly"
                  ? `${habit.frequency.weekdays.map((weekday) => WEEKDAY_LABELS[weekday - 1]).join(", ")} · ${formatClockTime12Hour(
                      habit.frequency.hour,
                      habit.frequency.minute
                    )}`
                  : formatIntervalHours(habit.frequency.hours);

              return (
                <>
                  <View style={{ alignItems: "center", gap: spacing.sm }}>
                    <Text style={{ fontSize: 56 }}>{habit.emoji}</Text>
                    <Text style={{ fontFamily: fontFamily.display, fontSize: 28, color: colors.ink, textAlign: "center" }}>
                      {habit.name}
                    </Text>
                    <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, opacity: 0.65 }}>
                      {frequencyLabel}
                    </Text>
                  </View>

                  <ComicCard style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
                    <FlameIcon size={28} />
                    <Text style={{ fontFamily: fontFamily.display, fontSize: 24, color: colors.ink }}>
                      {habit.streak} day streak
                    </Text>
                  </ComicCard>

                  {completedToday && (
                    <View style={{ alignItems: "center" }}>
                      <MascotCelebrating size={100} />
                    </View>
                  )}

                  <ComicCard style={{ gap: spacing.sm }}>
                    <StreakCalendar completedDates={habit.completedDates} />
                  </ComicCard>

                  <View style={{ gap: spacing.md, marginTop: "auto" }}>
                    <PlayfulButton
                      label={completedToday ? "Completed today" : "Mark done for today"}
                      tone={completedToday ? "green" : "blue"}
                      disabled={completedToday}
                      icon={completedToday ? <CheckIcon size={18} color={colors.ink} /> : undefined}
                      onPress={() => completeHabitForToday(habit.id)}
                    />
                    <PlayfulButton
                      label="Edit habit"
                      tone="outline"
                      icon={<PencilIcon size={16} />}
                      onPress={() => router.push(`/new?id=${habit.id}`)}
                    />
                    <PlayfulButton
                      label="Delete habit"
                      tone="red"
                      icon={<TrashIcon size={16} color={colors.paper} />}
                      onPress={confirmDelete}
                    />
                  </View>
                </>
              );
            })()}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
