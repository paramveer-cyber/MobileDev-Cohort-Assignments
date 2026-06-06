import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { loadAllSessions } from "@/db/sessions";
import { AnimatedSplashScreen } from "@/components/SplashScreen";

function RootStack() {
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="drive/summary" options={{ presentation: "card" }} />
      </Stack>
    </KeyboardAvoidingView>
  );
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    void loadAllSessions().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootStack />
        {!splashDone && (
          <AnimatedSplashScreen onFinished={() => setSplashDone(true)} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
