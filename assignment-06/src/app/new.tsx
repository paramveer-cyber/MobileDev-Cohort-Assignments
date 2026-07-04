import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../hooks/use-habits";
import { Frequency, Habit } from "../lib/habits/types";
import { formatClockTime12Hour, formatIntervalHours } from "../lib/habits/format";
import { colors, fontFamily, radii, spacing, strokeWidth } from "../lib/design/theme";
import { ComicCard } from "../components/ComicCard";
import { PlayfulButton } from "../components/PlayfulButton";
import { IconButton } from "../components/IconButton";
import { Chip } from "../components/Chip";
import { ChevronLeftIcon } from "../lib/design/icons";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const INTERVAL_HOUR_OPTIONS = [4, 6, 8, 12];
const EMOJI_OPTIONS = ["💧", "📚", "🏃", "💪", "🧘", "🧠", "🌙", "🎯"];

function createHabitId(): string {
  return `habit-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

const fieldStyle = {
  borderWidth: strokeWidth.thick,
  borderColor: colors.ink,
  borderRadius: radii.md,
  padding: spacing.md - 2,
  fontFamily: fontFamily.body,
  fontSize: 16,
  color: colors.ink,
  backgroundColor: colors.paper,
};

export default function CreateOrEditHabitScreen() {
  const { id: editingHabitId } = useLocalSearchParams<{ id?: string }>();
  const { habits, createHabit, updateHabit } = useHabits();

  const existingHabit = habits.find((habit) => habit.id === editingHabitId);

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💧");
  const [frequencyKind, setFrequencyKind] = useState<Frequency["kind"]>("daily");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([2, 3, 4, 5, 6]);
  const [hour, setHour] = useState("9");
  const [minute, setMinute] = useState("0");
  const [intervalHours, setIntervalHours] = useState(6);
  const [showNameError, setShowNameError] = useState(false);

  useEffect(() => {
    if (!existingHabit) return;
    setName(existingHabit.name);
    setEmoji(existingHabit.emoji);
    setFrequencyKind(existingHabit.frequency.kind);
    if (existingHabit.frequency.kind === "daily") {
      setHour(String(existingHabit.frequency.hour));
      setMinute(String(existingHabit.frequency.minute));
    } else if (existingHabit.frequency.kind === "weekly") {
      setHour(String(existingHabit.frequency.hour));
      setMinute(String(existingHabit.frequency.minute));
      setSelectedWeekdays(existingHabit.frequency.weekdays);
    } else {
      setIntervalHours(existingHabit.frequency.hours);
    }
  }, [existingHabit]);

  function toggleWeekday(weekday: number) {
    setSelectedWeekdays((currentWeekdays) =>
      currentWeekdays.includes(weekday)
        ? currentWeekdays.filter((existingWeekday) => existingWeekday !== weekday)
        : [...currentWeekdays, weekday].sort()
    );
  }

  async function handleSave() {
    if (!name.trim()) {
      setShowNameError(true);
      return;
    }

    const parsedHour = Number(hour);
    const parsedMinute = Number(minute);

    const frequency: Frequency =
      frequencyKind === "daily"
        ? { kind: "daily", hour: parsedHour, minute: parsedMinute }
        : frequencyKind === "weekly"
        ? { kind: "weekly", weekdays: selectedWeekdays, hour: parsedHour, minute: parsedMinute }
        : { kind: "interval", hours: intervalHours };

    if (existingHabit) {
      const updatedHabit: Habit = { ...existingHabit, name, emoji, frequency };
      await updateHabit(updatedHabit);
      router.replace(`/habit/${existingHabit.id}`);
      return;
    }

    const newHabit: Habit = {
      id: createHabitId(),
      name,
      emoji,
      frequency,
      notificationIds: [],
      streak: 0,
      lastCompletedISO: null,
      completedDates: [],
    };
    await createHabit(newHabit);
    router.replace("/");
  }

  const parsedHourForPreview = Number(hour);
  const parsedMinuteForPreview = Number(minute);
  const isReminderTimeValid =
    Number.isFinite(parsedHourForPreview) &&
    Number.isFinite(parsedMinuteForPreview) &&
    parsedHourForPreview >= 0 &&
    parsedHourForPreview <= 23 &&
    parsedMinuteForPreview >= 0 &&
    parsedMinuteForPreview <= 59;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mist }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
          <IconButton icon={<ChevronLeftIcon size={22} />} onPress={() => router.back()} />
          <Text style={{ fontFamily: fontFamily.display, fontSize: 26, color: colors.ink }}>
            {existingHabit ? "Edit habit" : "New habit"}
          </Text>
        </View>

        <ComicCard style={{ gap: spacing.md }}>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ gap: spacing.xs }}>
              <Text style={{ fontFamily: fontFamily.heading, fontSize: 14, color: colors.ink }}>Emoji</Text>
              <TextInput value={emoji} onChangeText={setEmoji} style={[fieldStyle, { width: 64, fontSize: 24, textAlign: "center" }]} />
            </View>
            <View style={{ gap: spacing.xs, flex: 1 }}>
              <Text style={{ fontFamily: fontFamily.heading, fontSize: 14, color: colors.ink }}>Habit name</Text>
              <TextInput
                value={name}
                onChangeText={(nextName) => {
                  setName(nextName);
                  if (showNameError) setShowNameError(false);
                }}
                placeholder="Drink Water"
                style={[fieldStyle, showNameError && { borderColor: colors.red }]}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            {EMOJI_OPTIONS.map((emojiOption) => (
              <Chip key={emojiOption} label={emojiOption} selected={emoji === emojiOption} onPress={() => setEmoji(emojiOption)} />
            ))}
          </View>
          {showNameError && (
            <Text style={{ fontFamily: fontFamily.body, fontSize: 13, color: colors.red }}>Give your habit a name first.</Text>
          )}
        </ComicCard>

        <ComicCard style={{ gap: spacing.md }}>
          <Text style={{ fontFamily: fontFamily.heading, fontSize: 14, color: colors.ink }}>Frequency</Text>
          <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
            <Chip label="Daily" selected={frequencyKind === "daily"} onPress={() => setFrequencyKind("daily")} />
            <Chip label="Weekly" selected={frequencyKind === "weekly"} onPress={() => setFrequencyKind("weekly")} />
            <Chip label="Every N hours" selected={frequencyKind === "interval"} onPress={() => setFrequencyKind("interval")} />
          </View>

          {frequencyKind === "weekly" && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {WEEKDAY_LABELS.map((label, index) => {
                const weekday = index + 1;
                return (
                  <Chip
                    key={weekday}
                    label={label}
                    selected={selectedWeekdays.includes(weekday)}
                    onPress={() => toggleWeekday(weekday)}
                  />
                );
              })}
            </View>
          )}

          {frequencyKind === "interval" && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
              {INTERVAL_HOUR_OPTIONS.map((hoursOption) => (
                <Chip
                  key={hoursOption}
                  label={formatIntervalHours(hoursOption)}
                  selected={intervalHours === hoursOption}
                  onPress={() => setIntervalHours(hoursOption)}
                />
              ))}
            </View>
          )}
        </ComicCard>

        {frequencyKind !== "interval" && (
          <ComicCard style={{ gap: spacing.md }}>
            <Text style={{ fontFamily: fontFamily.heading, fontSize: 14, color: colors.ink }}>Reminder time</Text>
            <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
              <TextInput value={hour} onChangeText={setHour} keyboardType="number-pad" style={[fieldStyle, { width: 64, textAlign: "center" }]} />
              <Text style={{ fontFamily: fontFamily.display, fontSize: 20, color: colors.ink }}>:</Text>
              <TextInput value={minute} onChangeText={setMinute} keyboardType="number-pad" style={[fieldStyle, { width: 64, textAlign: "center" }]} />
              <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, opacity: 0.65 }}>
                {isReminderTimeValid
                  ? formatClockTime12Hour(parsedHourForPreview, parsedMinuteForPreview)
                  : "Enter 24h hour (0-23) and minute (0-59)"}
              </Text>
            </View>
          </ComicCard>
        )}

        <PlayfulButton label={existingHabit ? "Save changes" : "Create habit"} tone="blue" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}
