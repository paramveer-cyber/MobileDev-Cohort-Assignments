import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuietHours } from "./types";

const QUIET_HOURS_STORAGE_KEY = "quiet-hours";

const defaultQuietHours: QuietHours = {
  enabled: false,
  startHour: 22,
  startMinute: 0,
  endHour: 7,
  endMinute: 0,
};

export async function getQuietHours(): Promise<QuietHours> {
  const rawQuietHours = await AsyncStorage.getItem(QUIET_HOURS_STORAGE_KEY);
  return rawQuietHours ? (JSON.parse(rawQuietHours) as QuietHours) : defaultQuietHours;
}

export async function saveQuietHours(quietHours: QuietHours): Promise<void> {
  await AsyncStorage.setItem(QUIET_HOURS_STORAGE_KEY, JSON.stringify(quietHours));
}

export function isTimeWithinQuietHours(hour: number, minute: number, quietHours: QuietHours): boolean {
  if (!quietHours.enabled) return false;
  const minuteOfDay = hour * 60 + minute;
  const startMinuteOfDay = quietHours.startHour * 60 + quietHours.startMinute;
  const endMinuteOfDay = quietHours.endHour * 60 + quietHours.endMinute;
  if (startMinuteOfDay === endMinuteOfDay) return false;
  if (startMinuteOfDay < endMinuteOfDay) {
    return minuteOfDay >= startMinuteOfDay && minuteOfDay < endMinuteOfDay;
  }
  return minuteOfDay >= startMinuteOfDay || minuteOfDay < endMinuteOfDay;
}

export function shiftTimeOutsideQuietHours(hour: number, minute: number, quietHours: QuietHours): { hour: number; minute: number } {
  if (!isTimeWithinQuietHours(hour, minute, quietHours)) return { hour, minute };
  return { hour: quietHours.endHour, minute: quietHours.endMinute };
}
