import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function SnippetLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
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
    </View>
  );
}
