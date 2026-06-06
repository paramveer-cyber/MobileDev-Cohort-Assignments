import { DeviceMotion } from "expo-sensors";
import { useEffect, useState } from "react";

type DeviceMotionData = {
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  rotationAlpha: number;
  rotationBeta: number;
  rotationGamma: number;
};

export function useDeviceMotion() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [data, setData] = useState<DeviceMotionData>({
    accelerationX: 0,
    accelerationY: 0,
    accelerationZ: 0,
    rotationAlpha: 0,
    rotationBeta: 0,
    rotationGamma: 0,
  });

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    void (async () => {
      const isAvailable = await DeviceMotion.isAvailableAsync();
      setAvailable(isAvailable);
      if (!isAvailable) return;

      await DeviceMotion.requestPermissionsAsync();
      DeviceMotion.setUpdateInterval(16);

      subscription = DeviceMotion.addListener((motionData) => {
        const accel = motionData.acceleration;
        const rotation = motionData.rotation;

        setData({
          accelerationX: accel?.x ?? 0,
          accelerationY: accel?.y ?? 0,
          accelerationZ: accel?.z ?? 0,
          rotationAlpha: rotation?.alpha ?? 0,
          rotationBeta: rotation?.beta ?? 0,
          rotationGamma: rotation?.gamma ?? 0,
        });
      });
    })();

    return () => subscription?.remove();
  }, []);

  return { available, ...data };
}
