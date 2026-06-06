import { useTheme } from "@/context/ThemeContext";
import {
  EVENT_IONICONS,
  EVENT_LABELS,
  EVENT_SCORE_PENALTIES,
  type DriveEventType,
} from "@/utils/driveTypes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EventBadgeProps = {
  type: DriveEventType;
  count?: number;
  compact?: boolean;
};

const EVENT_COLORS: Record<DriveEventType, string> = {
  harsh_brake: "#E63329",
  harsh_acceleration: "#FF8C00",
  sharp_turn: "#1B4FD8",
  aggressive_steering: "#7B2FBE",
  excessive_movement: "#0A8A5A",
  phone_handling: "#C41E3A",
};

export function EventBadge({ type, count, compact = false }: EventBadgeProps) {
  const { theme } = useTheme();
  const color = EVENT_COLORS[type];
  const penalty = EVENT_SCORE_PENALTIES[type];
  const iconName = EVENT_IONICONS[type];

  if (compact) {
    return (
      <View
        style={[
          styles.compactBadge,
          { backgroundColor: color + "20", borderColor: color + "40" },
        ]}
      >
        <Ionicons name={iconName} size={12} color={color} />
        {count !== undefined && (
          <Text style={[styles.compactCount, { color }]}>{count}</Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.surface,
          borderColor: color + "30",
          borderLeftColor: color,
        },
      ]}
    >
      <Ionicons name={iconName} size={18} color={color} />
      <View style={styles.badgeContent}>
        <Text style={[styles.label, { color: theme.text }]}>
          {EVENT_LABELS[type]}
        </Text>
        {count !== undefined && (
          <Text style={[styles.countText, { color: theme.textSecondary }]}>
            ×{count}
          </Text>
        )}
      </View>
      <Text style={[styles.penalty, { color }]}>−{penalty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 3,
    marginBottom: 8,
    gap: 10,
  },
  badgeContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  countText: {
    fontSize: 12,
    fontWeight: "400",
  },
  penalty: {
    fontSize: 13,
    fontWeight: "700",
  },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  compactCount: {
    fontSize: 11,
    fontWeight: "700",
  },
});
