import { Text, View } from "react-native";
import { fontFamily, colors, spacing } from "../lib/design/theme";

export type EmptyStateProps = {
  mascot: React.ReactNode;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function EmptyState({ mascot, title, subtitle, children }: EmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md, padding: spacing.lg }}>
      {mascot}
      <Text style={{ fontFamily: fontFamily.heading, fontSize: 20, color: colors.ink, textAlign: "center" }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ fontFamily: fontFamily.body, fontSize: 14, color: colors.ink, opacity: 0.6, textAlign: "center" }}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
}
