import { Habit } from "./types";

function toCalendarDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function computeTotalCompletions(habits: Habit[]): number {
  return habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
}

export function computeBestStreak(habits: Habit[]): number {
  return habits.reduce((bestStreak, habit) => Math.max(bestStreak, habit.streak), 0);
}

export function computeWeeklyCompletionRate(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  const last7Days = Array.from({ length: 7 }, (_, dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    return toCalendarDayKey(date);
  });
  const totalPossible = habits.length * last7Days.length;
  const totalCompleted = habits.reduce((sum, habit) => {
    const completedInLast7Days = habit.completedDates.filter((completedDate) =>
      last7Days.includes(completedDate)
    ).length;
    return sum + completedInLast7Days;
  }, 0);
  return totalPossible === 0 ? 0 : Math.round((totalCompleted / totalPossible) * 100);
}

export function computeLongestActiveHabitName(habits: Habit[]): string | null {
  if (habits.length === 0) return null;
  const topHabit = habits.reduce((currentBest, habit) => (habit.streak > currentBest.streak ? habit : currentBest));
  return topHabit.streak > 0 ? topHabit.name : null;
}
