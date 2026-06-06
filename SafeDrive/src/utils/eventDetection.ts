import type { DriveEventType } from "./driveTypes";
import { EVENT_SCORE_PENALTIES } from "./driveTypes";

export const HARSH_BRAKE_THRESHOLD = 1.3;
export const HARSH_ACCELERATION_THRESHOLD = 1.2;
export const SHARP_TURN_THRESHOLD = 1.0;
export const AGGRESSIVE_STEERING_THRESHOLD = 3.2;
export const EXCESSIVE_MOVEMENT_THRESHOLD = 4.5;
export const PHONE_HANDLING_ACCEL_LOW = 0.05;
export const PHONE_HANDLING_GYRO_SUSTAINED = 2.2;
export const MOTION_GATE_THRESHOLD = 0.18;
export const COOLDOWN_MS = 5000;
export const CONFIRMATION_COUNT = 4;

export type SensorSnapshot = {
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  deviceMotionAccelX: number;
  deviceMotionAccelY: number;
  deviceMotionAccelZ: number;
  magnetHeading: number;
  timestamp: number;
};

export type DetectedEvent = {
  type: DriveEventType;
  severity: number;
};

export type FilterState = {
  filteredX: number;
  filteredY: number;
  filteredZ: number;
  previousX: number;
  previousY: number;
  previousZ: number;
};

const HIGH_PASS_ALPHA = 0.85;

export function createFilterState(): FilterState {
  return {
    filteredX: 0,
    filteredY: 0,
    filteredZ: 0,
    previousX: 0,
    previousY: 0,
    previousZ: 0,
  };
}

export function applyHighPassFilter(
  rawX: number,
  rawY: number,
  rawZ: number,
  state: FilterState,
): { x: number; y: number; z: number } {
  state.filteredX =
    HIGH_PASS_ALPHA * (state.filteredX + rawX - state.previousX);
  state.filteredY =
    HIGH_PASS_ALPHA * (state.filteredY + rawY - state.previousY);
  state.filteredZ =
    HIGH_PASS_ALPHA * (state.filteredZ + rawZ - state.previousZ);
  state.previousX = rawX;
  state.previousY = rawY;
  state.previousZ = rawZ;
  return { x: state.filteredX, y: state.filteredY, z: state.filteredZ };
}

export type ConfirmationState = Map<DriveEventType, number>;

export function createConfirmationState(): ConfirmationState {
  return new Map();
}

export function detectDrivingEvents(
  snapshot: SensorSnapshot,
  lastEventTimes: Map<DriveEventType, number>,
  confirmationState: ConfirmationState,
  filterState: FilterState,
): DetectedEvent[] {
  const detected: DetectedEvent[] = [];
  const now = snapshot.timestamp;

  function isOffCooldown(type: DriveEventType): boolean {
    return now - (lastEventTimes.get(type) ?? 0) > COOLDOWN_MS;
  }

  function confirm(type: DriveEventType, triggered: boolean): boolean {
    if (!triggered) {
      confirmationState.set(type, 0);
      return false;
    }
    const count = (confirmationState.get(type) ?? 0) + 1;
    confirmationState.set(type, count);
    return count >= CONFIRMATION_COUNT;
  }

  const filtered = applyHighPassFilter(
    snapshot.accelX,
    snapshot.accelY,
    snapshot.accelZ,
    filterState,
  );
  const totalFilteredMagnitude = Math.hypot(filtered.x, filtered.y, filtered.z);

  if (totalFilteredMagnitude <= MOTION_GATE_THRESHOLD) {
    for (const type of [
      "harsh_brake",
      "harsh_acceleration",
      "sharp_turn",
      "aggressive_steering",
      "excessive_movement",
    ] as DriveEventType[]) {
      confirmationState.set(type, 0);
    }
    return [];
  }

  const longitudinalDecel = -filtered.y;
  if (
    confirm("harsh_brake", longitudinalDecel > HARSH_BRAKE_THRESHOLD) &&
    isOffCooldown("harsh_brake")
  ) {
    detected.push({
      type: "harsh_brake",
      severity: Math.min(1, longitudinalDecel / (HARSH_BRAKE_THRESHOLD * 1.5)),
    });
    confirmationState.set("harsh_brake", 0);
  }

  const longitudinalAccel = filtered.y;
  if (
    confirm(
      "harsh_acceleration",
      longitudinalAccel > HARSH_ACCELERATION_THRESHOLD,
    ) &&
    isOffCooldown("harsh_acceleration")
  ) {
    detected.push({
      type: "harsh_acceleration",
      severity: Math.min(
        1,
        longitudinalAccel / (HARSH_ACCELERATION_THRESHOLD * 1.5),
      ),
    });
    confirmationState.set("harsh_acceleration", 0);
  }

  const lateralForce = Math.abs(filtered.x);
  if (
    confirm("sharp_turn", lateralForce > SHARP_TURN_THRESHOLD) &&
    isOffCooldown("sharp_turn")
  ) {
    detected.push({
      type: "sharp_turn",
      severity: Math.min(1, lateralForce / (SHARP_TURN_THRESHOLD * 1.5)),
    });
    confirmationState.set("sharp_turn", 0);
  }

  const steeringRate = Math.abs(snapshot.gyroZ);
  if (
    confirm(
      "aggressive_steering",
      steeringRate > AGGRESSIVE_STEERING_THRESHOLD,
    ) &&
    isOffCooldown("aggressive_steering")
  ) {
    detected.push({
      type: "aggressive_steering",
      severity: Math.min(
        1,
        steeringRate / (AGGRESSIVE_STEERING_THRESHOLD * 1.5),
      ),
    });
    confirmationState.set("aggressive_steering", 0);
  }

  if (
    confirm(
      "excessive_movement",
      totalFilteredMagnitude > EXCESSIVE_MOVEMENT_THRESHOLD,
    ) &&
    isOffCooldown("excessive_movement")
  ) {
    detected.push({
      type: "excessive_movement",
      severity: Math.min(
        1,
        totalFilteredMagnitude / (EXCESSIVE_MOVEMENT_THRESHOLD * 1.5),
      ),
    });
    confirmationState.set("excessive_movement", 0);
  }

  const dmTotal = Math.hypot(
    snapshot.deviceMotionAccelX,
    snapshot.deviceMotionAccelY,
    snapshot.deviceMotionAccelZ,
  );
  const gyroTotal = Math.hypot(snapshot.gyroX, snapshot.gyroY, snapshot.gyroZ);
  if (
    confirm(
      "phone_handling",
      dmTotal < PHONE_HANDLING_ACCEL_LOW &&
        gyroTotal > PHONE_HANDLING_GYRO_SUSTAINED,
    ) &&
    isOffCooldown("phone_handling")
  ) {
    detected.push({
      type: "phone_handling",
      severity: Math.min(1, gyroTotal / (PHONE_HANDLING_GYRO_SUSTAINED * 2)),
    });
    confirmationState.set("phone_handling", 0);
  }

  for (const event of detected) {
    lastEventTimes.set(event.type, now);
  }

  return detected;
}

export function calculateScore(events: { type: DriveEventType }[]): number {
  let score = 100;
  for (const event of events) {
    score -= EVENT_SCORE_PENALTIES[event.type] ?? 0;
  }
  return Math.max(0, score);
}
