import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BorderRadius, Colors, Spacing, Typography } from "../constants/theme";
import { Snippet } from "../types";
import LanguageBadge from "./LanguageBadge";

interface Props {
  snippet: Snippet;
  onPress: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export default function SnippetCard({
  snippet,
  onPress,
  onToggleFavorite,
  onDelete,
}: Props) {
  const preview = snippet.code.slice(0, 120).replace(/\n/g, " ");

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {snippet.title}
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={8}
            style={styles.iconBtn}
          >
            <Text style={{ fontSize: 18 }}>
              {snippet.isFavorite ? "⭐" : "☆"}
            </Text>
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8} style={styles.iconBtn}>
            <Text style={{ fontSize: 16, color: Colors.textMuted }}>🗑</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.codePreview}>
        <Text style={styles.codeText} numberOfLines={2}>
          {preview}
        </Text>
      </View>

      <View style={styles.footer}>
        <LanguageBadge language={snippet.language} size="sm" />
        {snippet.tags.length > 0 && (
          <View style={styles.tags}>
            {snippet.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {snippet.tags.length > 3 && (
              <Text style={styles.tagText}>+{snippet.tags.length - 3}</Text>
            )}
          </View>
        )}
        {snippet.attachments.length > 0 && (
          <Text style={styles.attachmentHint}>
            📎 {snippet.attachments.length}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    marginRight: Spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  iconBtn: {
    padding: 4,
  },
  codePreview: {
    backgroundColor: Colors.codeBackground,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  codeText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: Typography.fontMono,
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tags: {
    flexDirection: "row",
    gap: Spacing.xs,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  attachmentHint: {
    color: Colors.textMuted,
    fontSize: 11,
    marginLeft: "auto",
  },
});
