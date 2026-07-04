import { StyleSheet, View, ViewProps } from "react-native";
import { colors, radii, shadowOffset, strokeWidth } from "../lib/design/theme";

export type HardShadowBoxProps = ViewProps & {
  backgroundColor?: string;
  radius?: number;
  borderColor?: string;
  shadowColor?: string;
  flat?: boolean;
};

export function HardShadowBox({
  children,
  style,
  backgroundColor = colors.paper,
  radius = radii.lg,
  borderColor = colors.ink,
  shadowColor = colors.ink,
  flat = false,
  ...viewProps
}: HardShadowBoxProps) {
  return (
    <View style={{ position: "relative" }}>
      {!flat && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: shadowColor,
              borderRadius: radius,
              transform: [{ translateX: shadowOffset }, { translateY: shadowOffset }],
            },
          ]}
        />
      )}
      <View
        {...viewProps}
        style={[
          {
            backgroundColor,
            borderRadius: radius,
            borderWidth: strokeWidth.thick,
            borderColor,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
