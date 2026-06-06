import { useLightSensor } from "@/hooks/use-light-sensor";
import { darkTheme, lightTheme, type AppTheme } from "@/utils/theme";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Platform } from "react-native";

const DARK_MODE_LUX_THRESHOLD = 40;
const LIGHT_MODE_LUX_THRESHOLD = 400;

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: AppTheme;
  themeMode: ThemeMode;
  isAutoTheme: boolean;
  toggleManualTheme: () => void;
  setAutoTheme: (enabled: boolean) => void;
  lux: number;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { lux, available: lightSensorAvailable } = useLightSensor();
  const [manualMode, setManualMode] = useState<ThemeMode>("light");
  const [isAutoTheme, setIsAutoTheme] = useState(Platform.OS === "android");
  const [hysteresisMode, setHysteresisMode] = useState<ThemeMode>("light");

  const darkThreshold = DARK_MODE_LUX_THRESHOLD;
  const lightThreshold = LIGHT_MODE_LUX_THRESHOLD;

  if (hysteresisMode === "light" && lux < darkThreshold) {
    setHysteresisMode("dark");
  } else if (hysteresisMode === "dark" && lux > lightThreshold) {
    setHysteresisMode("light");
  }

  const sensorAvailable =
    Platform.OS === "android" && isAutoTheme && !!lightSensorAvailable;
  const resolvedMode = sensorAvailable ? hysteresisMode : manualMode;
  const theme = resolvedMode === "dark" ? darkTheme : lightTheme;

  const toggleManualTheme = useCallback(() => {
    setManualMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleSetAutoTheme = useCallback((enabled: boolean) => {
    setIsAutoTheme(enabled);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode: resolvedMode,
        isAutoTheme: sensorAvailable,
        toggleManualTheme,
        setAutoTheme: handleSetAutoTheme,
        lux,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
