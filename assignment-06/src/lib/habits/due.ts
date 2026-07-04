import { Habit } from "./types";

export function isHabitDueToday(habit: Habit): boolean {
  if (habit.frequency.kind === "interval") return true;
  if (habit.frequency.kind === "daily") return true;
  const todayWeekday = new Date().getDay() + 1;
  return habit.frequency.weekdays.includes(todayWeekday);
}

export function isHabitCompletedToday(habit: Habit): boolean {
  if (!habit.lastCompletedISO) return false;
  return habit.lastCompletedISO.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

export function countPendingHabitsToday(habits: Habit[]): number {
  return habits.filter((habit) => isHabitDueToday(habit) && !isHabitCompletedToday(habit)).length;
}
