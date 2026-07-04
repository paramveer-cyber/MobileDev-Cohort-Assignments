export type DailyFrequency = {
  kind: "daily";
  hour: number;
  minute: number;
};

export type WeeklyFrequency = {
  kind: "weekly";
  weekdays: number[];
  hour: number;
  minute: number;
};

export type IntervalFrequency = {
  kind: "interval";
  hours: number;
};

export type Frequency = DailyFrequency | WeeklyFrequency | IntervalFrequency;

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  frequency: Frequency;
  notificationIds: string[];
  streak: number;
  lastCompletedISO: string | null;
  completedDates: string[];
};

export type QuietHours = {
  enabled: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};
