import { Text, View } from "react-native";
import { colors, fontFamily, radii, spacing } from "../lib/design/theme";

const WEEKS_TO_SHOW = 4;
const DAYS_PER_WEEK = 7;

function toCalendarDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildRecentDayKeys(totalDays: number): string[] {
  return Array.from({ length: totalDays }, (_, dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() - (totalDays - 1 - dayOffset));
    return toCalendarDayKey(date);
  });
}

export function StreakCalendar({ completedDates }: { completedDates: string[] }) {
  const totalDays = WEEKS_TO_SHOW * DAYS_PER_WEEK;
  const dayKeys = buildRecentDayKeys(totalDays);
  const completedDaySet = new Set(completedDates);

  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={{ fontFamily: fontFamily.heading, fontSize: 14, color: colors.ink }}>Last 4 weeks</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {dayKeys.map((dayKey) => {
          const isCompleted = completedDaySet.has(dayKey);
          return (
            <View
              key={dayKey}
              style={{
                width: 22,
                height: 22,
                borderRadius: radii.sm,
                borderWidth: 2,
                borderColor: colors.ink,
                backgroundColor: isCompleted ? colors.green : colors.paper,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
