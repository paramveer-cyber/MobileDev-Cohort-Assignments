import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  LanguageColors,
  LanguageLabels,
  Spacing,
} from "../constants/theme";
import { Language } from "../types";

interface Props {
  language: Language;
  size?: "sm" | "md";
}

export default function LanguageBadge({ language, size = "md" }: Props) {
  const color = LanguageColors[language] ?? "#888";
  const label = LanguageLabels[language] ?? language;
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        { borderColor: color + "55", backgroundColor: color + "18" },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: color },
          isSmall && styles.dotSmall,
        ]}
      />
      <Text style={[styles.text, { color }, isSmall && styles.textSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSmall: {
    width: 5,
    height: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 10,
  },
});
