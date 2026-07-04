import { useCallback, useEffect, useState } from "react";
import * as habitStorage from "../lib/habits/storage";
import { Habit } from "../lib/habits/types";
import { countPendingHabitsToday } from "../lib/habits/due";
import {
  cancelHabitRemindersAsync,
  rescheduleHabitRemindersAsync,
  scheduleHabitRemindersAsync,
} from "../lib/notifications/schedule";
import { updatePendingHabitsBadgeAsync } from "../lib/notifications/setup";
import { scheduleDailySummaryNotificationAsync } from "../lib/notifications/summary";

function toCalendarDayKey(isoString: string): string {
  return isoString.slice(0, 10);
}

function isSameCalendarDay(firstISO: string, secondISO: string): boolean {
  return toCalendarDayKey(firstISO) === toCalendarDayKey(secondISO);
}

function daysBetween(earlierISO: string, laterISO: string): number {
  const earlierDate = new Date(toCalendarDayKey(earlierISO));
  const laterDate = new Date(toCalendarDayKey(laterISO));
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((laterDate.getTime() - earlierDate.getTime()) / millisecondsPerDay);
}

function withDecayedStreak(habit: Habit, todayISO: string): Habit {
  if (!habit.lastCompletedISO) return habit;
  const dayGap = daysBetween(habit.lastCompletedISO, todayISO);
  if (dayGap <= 1 || habit.streak === 0) return habit;
  return { ...habit, streak: 0 };
}

async function syncBadgeAndSummary(habits: Habit[]): Promise<void> {
  const pendingCount = countPendingHabitsToday(habits);
  await updatePendingHabitsBadgeAsync(pendingCount);
  await scheduleDailySummaryNotificationAsync(pendingCount);
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reloadHabits = useCallback(async () => {
    const storedHabits = await habitStorage.getAllHabits();
    const todayISO = new Date().toISOString();
    const decayedHabits = storedHabits.map((habit) => withDecayedStreak(habit, todayISO));
    await Promise.all(
      decayedHabits
        .filter((habit, index) => habit.streak !== storedHabits[index].streak)
        .map((habit) => habitStorage.saveHabit(habit))
    );
    setHabits(decayedHabits);
    setIsLoading(false);
    await syncBadgeAndSummary(decayedHabits);
  }, []);

  useEffect(() => {
    reloadHabits();
  }, [reloadHabits]);

  const createHabit = useCallback(
    async (habit: Habit) => {
      const notificationIds = await scheduleHabitRemindersAsync(habit);
      await habitStorage.saveHabit({ ...habit, notificationIds });
      await reloadHabits();
    },
    [reloadHabits]
  );

  const updateHabit = useCallback(
    async (habit: Habit) => {
      const notificationIds = await rescheduleHabitRemindersAsync(habit);
      await habitStorage.saveHabit({ ...habit, notificationIds });
      await reloadHabits();
    },
    [reloadHabits]
  );

  const removeHabit = useCallback(
    async (habitId: string) => {
      const habit = await habitStorage.getHabitById(habitId);
      if (habit) {
        await cancelHabitRemindersAsync(habit.notificationIds);
      }
      await habitStorage.deleteHabit(habitId);
      await reloadHabits();
    },
    [reloadHabits]
  );

  const completeHabitForToday = useCallback(
    async (habitId: string) => {
      const habit = await habitStorage.getHabitById(habitId);
      if (!habit) return;
      const todayISO = new Date().toISOString();
      if (habit.lastCompletedISO && isSameCalendarDay(habit.lastCompletedISO, todayISO)) {
        return;
      }
      const dayGap = habit.lastCompletedISO ? daysBetween(habit.lastCompletedISO, todayISO) : null;
      const streakContinues = dayGap !== null && dayGap === 1;
      const todayDayKey = toCalendarDayKey(todayISO);
      const updatedHabit: Habit = {
        ...habit,
        streak: streakContinues ? habit.streak + 1 : 1,
        lastCompletedISO: todayISO,
        completedDates: habit.completedDates.includes(todayDayKey)
          ? habit.completedDates
          : [...habit.completedDates, todayDayKey],
      };
      await habitStorage.saveHabit(updatedHabit);
      await reloadHabits();
    },
    [reloadHabits]
  );

  return {
    habits,
    isLoading,
    createHabit,
    updateHabit,
    removeHabit,
    completeHabitForToday,
    reloadHabits,
  };
}
