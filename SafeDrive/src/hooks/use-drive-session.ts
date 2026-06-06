import { saveSession } from "@/db/sessions";
import type {
  ActiveDriveState,
  DriveEvent,
  DriveEventType,
} from "@/utils/driveTypes";
import {
  calculateScore,
  createConfirmationState,
  createFilterState,
  detectDrivingEvents,
  type ConfirmationState,
  type FilterState,
  type SensorSnapshot,
} from "@/utils/eventDetection";
import { getScoreRating } from "@/utils/theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccelerometer } from "./use-accelerometer";
import { useDeviceMotion } from "./use-device-motion";
import { useGyroscope } from "./use-gyroscope";
import { useMagnetometer } from "./use-magnetometer";

const DETECTION_INTERVAL_MS = 16;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type DriveSessionHookResult = {
  isActive: boolean;
  activeDrive: ActiveDriveState | null;
  elapsedSeconds: number;
  startDrive: () => void;
  endDrive: () => Promise<string | null>;
  latestEventType: DriveEventType | null;
};

export function useDriveSession(): DriveSessionHookResult {
  const accelerometer = useAccelerometer();
  const gyroscope = useGyroscope();
  const deviceMotion = useDeviceMotion();
  const magnetometer = useMagnetometer();

  const [isActive, setIsActive] = useState(false);
  const [activeDrive, setActiveDrive] = useState<ActiveDriveState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [latestEventType, setLatestEventType] = useState<DriveEventType | null>(
    null,
  );

  const lastEventTimesRef = useRef<Map<DriveEventType, number>>(new Map());
  const confirmationStateRef = useRef<ConfirmationState>(
    createConfirmationState(),
  );
  const filterStateRef = useRef<FilterState>(createFilterState());
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const elapsedIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const sessionStartRef = useRef<number>(0);
  const currentEventsRef = useRef<DriveEvent[]>([]);
  const latestEventTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const sensorDataRef = useRef({
    accelX: 0,
    accelY: 0,
    accelZ: 0,
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0,
    deviceMotionAccelX: 0,
    deviceMotionAccelY: 0,
    deviceMotionAccelZ: 0,
    magnetHeading: 0,
  });

  useEffect(() => {
    sensorDataRef.current.accelX = accelerometer.x;
    sensorDataRef.current.accelY = accelerometer.y;
    sensorDataRef.current.accelZ = accelerometer.z;
  }, [accelerometer.x, accelerometer.y, accelerometer.z]);

  useEffect(() => {
    sensorDataRef.current.gyroX = gyroscope.x;
    sensorDataRef.current.gyroY = gyroscope.y;
    sensorDataRef.current.gyroZ = gyroscope.z;
  }, [gyroscope.x, gyroscope.y, gyroscope.z]);

  useEffect(() => {
    sensorDataRef.current.deviceMotionAccelX = deviceMotion.accelerationX;
    sensorDataRef.current.deviceMotionAccelY = deviceMotion.accelerationY;
    sensorDataRef.current.deviceMotionAccelZ = deviceMotion.accelerationZ;
  }, [
    deviceMotion.accelerationX,
    deviceMotion.accelerationY,
    deviceMotion.accelerationZ,
  ]);

  useEffect(() => {
    sensorDataRef.current.magnetHeading = magnetometer.heading;
  }, [magnetometer.heading]);

  const startDrive = useCallback(() => {
    const sessionId = generateId();
    const startedAt = Date.now();

    lastEventTimesRef.current = new Map();
    confirmationStateRef.current = createConfirmationState();
    filterStateRef.current = createFilterState();
    currentEventsRef.current = [];
    sessionStartRef.current = startedAt;

    setElapsedSeconds(0);
    setLatestEventType(null);
    setActiveDrive({
      sessionId,
      startedAt,
      events: [],
      currentScore: 100,
    });
    setIsActive(true);

    detectionIntervalRef.current = setInterval(() => {
      const snapshot: SensorSnapshot = {
        ...sensorDataRef.current,
        timestamp: Date.now(),
      };

      const detected = detectDrivingEvents(
        snapshot,
        lastEventTimesRef.current,
        confirmationStateRef.current,
        filterStateRef.current,
      );

      if (detected.length > 0) {
        const newEvents: DriveEvent[] = detected.map((d) => ({
          id: generateId(),
          type: d.type,
          timestamp: snapshot.timestamp,
          severity: d.severity,
        }));

        currentEventsRef.current = [...currentEventsRef.current, ...newEvents];
        const updatedScore = calculateScore(currentEventsRef.current);

        setActiveDrive((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            events: currentEventsRef.current,
            currentScore: updatedScore,
          };
        });

        setLatestEventType(detected[detected.length - 1].type);
        if (latestEventTimeoutRef.current)
          clearTimeout(latestEventTimeoutRef.current);
        latestEventTimeoutRef.current = setTimeout(
          () => setLatestEventType(null),
          3000,
        );
      }
    }, DETECTION_INTERVAL_MS);

    elapsedIntervalRef.current = setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - sessionStartRef.current) / 1000),
      );
    }, 1000);
  }, []);

  const endDrive = useCallback(async (): Promise<string | null> => {
    if (!activeDrive) return null;

    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    if (latestEventTimeoutRef.current)
      clearTimeout(latestEventTimeoutRef.current);

    const endedAt = Date.now();
    const durationSeconds = Math.floor(
      (endedAt - activeDrive.startedAt) / 1000,
    );
    const finalScore = calculateScore(currentEventsRef.current);
    const safetyRating = getScoreRating(finalScore);

    const completedSession = {
      id: activeDrive.sessionId,
      startedAt: activeDrive.startedAt,
      endedAt,
      durationSeconds,
      events: currentEventsRef.current,
      finalScore,
      safetyRating,
    };

    await saveSession(completedSession);

    setIsActive(false);
    setActiveDrive(null);
    setElapsedSeconds(0);
    setLatestEventType(null);
    currentEventsRef.current = [];

    return activeDrive.sessionId;
  }, [activeDrive]);

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current)
        clearInterval(detectionIntervalRef.current);
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
      if (latestEventTimeoutRef.current)
        clearTimeout(latestEventTimeoutRef.current);
    };
  }, []);

  return {
    isActive,
    activeDrive,
    elapsedSeconds,
    startDrive,
    endDrive,
    latestEventType,
  };
}
