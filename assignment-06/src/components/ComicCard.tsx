import { ViewProps } from "react-native";
import { HardShadowBox } from "./HardShadowBox";
import { spacing } from "../lib/design/theme";

export function ComicCard({ children, style, ...viewProps }: ViewProps) {
  return (
    <HardShadowBox style={[{ padding: spacing.md }, style]} {...viewProps}>
      {children}
    </HardShadowBox>
  );
}
