import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function SnippetLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: "700", color: Colors.textPrimary },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Snippet" }} />
      <Stack.Screen name="create" options={{ title: "New Snippet" }} />
      <Stack.Screen name="edit/[id]" options={{ title: "Edit Snippet" }} />
    </Stack>
  );
}
