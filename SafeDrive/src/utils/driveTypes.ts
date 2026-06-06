import type Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";

export type DriveEventType =
  | "harsh_brake"
  | "harsh_acceleration"
  | "sharp_turn"
  | "aggressive_steering"
  | "excessive_movement"
  | "phone_handling";

export type DriveEvent = {
  id: string;
  type: DriveEventType;
  timestamp: number;
  severity: number;
};

export type DriveSession = {
  id: string;
  startedAt: number;
  endedAt: number | null;
  durationSeconds: number;
  events: DriveEvent[];
  finalScore: number;
  safetyRating: string;
};

export type ActiveDriveState = {
  sessionId: string;
  startedAt: number;
  events: DriveEvent[];
  currentScore: number;
};

export const EVENT_SCORE_PENALTIES: Record<DriveEventType, number> = {
  harsh_brake: 5,
  harsh_acceleration: 5,
  sharp_turn: 3,
  aggressive_steering: 3,
  excessive_movement: 2,
  phone_handling: 10,
};

export const EVENT_LABELS: Record<DriveEventType, string> = {
  harsh_brake: "Harsh Brake",
  harsh_acceleration: "Harsh Acceleration",
  sharp_turn: "Sharp Turn",
  aggressive_steering: "Aggressive Steering",
  excessive_movement: "Excessive Movement",
  phone_handling: "Phone Handling",
};

export const EVENT_IONICONS: Record<
  DriveEventType,
  ComponentProps<typeof Ionicons>["name"]
> = {
  harsh_brake: "flash",
  harsh_acceleration: "rocket",
  sharp_turn: "return-down-back",
  aggressive_steering: "sync",
  excessive_movement: "phone-portrait",
  phone_handling: "phone-portrait-outline",
};
