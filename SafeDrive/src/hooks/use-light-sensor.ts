import { LightSensor } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const UPDATE_INTERVAL_MS = 16;
const SMOOTHING_SAMPLES = 5;

export function useLightSensor() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [lux, setLux] = useState(0);
  const recentReadings = useRef<number[]>([]);

  useEffect(() => {
    if (Platform.OS !== "android") {
      setAvailable(false);
      return;
    }

    let subscription: { remove: () => void } | undefined;

    void (async () => {
      const isAvailable = await LightSensor.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;

      LightSensor.setUpdateInterval(UPDATE_INTERVAL_MS);

      subscription = LightSensor.addListener((data) => {
        const readings = recentReadings.current;
        readings.push(data.illuminance);
        if (readings.length > SMOOTHING_SAMPLES) readings.shift();
        const average =
          readings.reduce((sum, v) => sum + v, 0) / readings.length;
        const smoothedLux = Math.round(average);
        setLux(smoothedLux);
      });
    })();

    return () => subscription?.remove();
  }, []);

  return { available, lux };
}
