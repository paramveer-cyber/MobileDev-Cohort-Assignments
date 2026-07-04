import { useCallback, useEffect, useState } from "react";
import { QuietHours } from "../lib/habits/types";
import { getQuietHours, saveQuietHours } from "../lib/habits/quiet-hours-storage";
import { getAllHabits, saveHabit } from "../lib/habits/storage";
import { rescheduleHabitRemindersAsync } from "../lib/notifications/schedule";

const fallbackQuietHours: QuietHours = {
  enabled: false,
  startHour: 22,
  startMinute: 0,
  endHour: 7,
  endMinute: 0,
};

export function useQuietHours() {
  const [quietHours, setQuietHours] = useState<QuietHours>(fallbackQuietHours);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQuietHours().then((storedQuietHours) => {
      setQuietHours(storedQuietHours);
      setIsLoading(false);
    });
  }, []);

  const updateQuietHours = useCallback(async (nextQuietHours: QuietHours) => {
    setQuietHours(nextQuietHours);
    await saveQuietHours(nextQuietHours);
    const allHabits = await getAllHabits();
    await Promise.all(
      allHabits.map(async (habit) => {
        if (habit.frequency.kind === "interval") return;
        const notificationIds = await rescheduleHabitRemindersAsync(habit);
        await saveHabit({ ...habit, notificationIds });
      })
    );
  }, []);

  return { quietHours, isLoading, updateQuietHours };
}
