import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SnippetForm from "../../../../components/SnippetForm";
import { Colors } from "../../../../constants/theme";
import { updateSnippet } from "../../../../database/snippets";
import { useSnippet } from "../../../../hooks/useSnippets";
import { CreateSnippetInput } from "../../../../types";

export default function EditSnippetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { snippet, loading } = useSnippet(id);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!snippet) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>Snippet not found</Text>
      </SafeAreaView>
    );
  }

  async function handleSubmit(input: CreateSnippetInput) {
    await updateSnippet(id, input);
    router.back();
  }

  return (
    <SnippetForm
      initialValues={snippet}
      onSubmit={handleSubmit}
      submitLabel="Update Snippet"
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  text: { color: Colors.textSecondary },
});
