import AsyncStorage from "@react-native-async-storage/async-storage";
import { Habit } from "./types";

const HABITS_STORAGE_KEY = "habits";

function withCompletedDatesFallback(habit: Habit): Habit {
  return { ...habit, completedDates: habit.completedDates ?? [] };
}

async function readHabits(): Promise<Habit[]> {
  const rawHabits = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
  if (!rawHabits) return [];
  const parsedHabits = JSON.parse(rawHabits) as Habit[];
  return parsedHabits.map(withCompletedDatesFallback);
}

async function writeHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
}

export async function getAllHabits(): Promise<Habit[]> {
  return readHabits();
}

export async function getHabitById(habitId: string): Promise<Habit | undefined> {
  const habits = await readHabits();
  return habits.find((habit) => habit.id === habitId);
}

export async function saveHabit(habit: Habit): Promise<void> {
  const habits = await readHabits();
  const existingIndex = habits.findIndex((existingHabit) => existingHabit.id === habit.id);
  if (existingIndex === -1) {
    habits.push(habit);
  } else {
    habits[existingIndex] = habit;
  }
  await writeHabits(habits);
}

export async function deleteHabit(habitId: string): Promise<void> {
  const habits = await readHabits();
  const remainingHabits = habits.filter((habit) => habit.id !== habitId);
  await writeHabits(remainingHabits);
}
