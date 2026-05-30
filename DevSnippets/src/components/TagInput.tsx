import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BorderRadius, Colors, Spacing } from "../constants/theme";

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
  const [input, setInput] = useState("");

  function addTag() {
    const tag = input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "");
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <View style={styles.container}>
      <View style={styles.tagsList}>
        {tags.map((tag) => (
          <Pressable
            key={tag}
            style={styles.tag}
            onPress={() => removeTag(tag)}
          >
            <Text style={styles.tagText}>#{tag}</Text>
            <Text style={styles.remove}>✕</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add tag..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={addTag}
          blurOnSubmit={false}
        />
        <Pressable style={styles.addBtn} onPress={addTag}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "18",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary + "44",
  },
  tagText: {
    color: Colors.primary,
    fontSize: 12,
  },
  remove: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: Colors.primaryText,
    fontSize: 18,
    fontWeight: "700",
  },
});
