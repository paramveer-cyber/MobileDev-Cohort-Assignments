import { Text } from "react-native";
import { HardShadowBox } from "./HardShadowBox";
import { Squashable, SquashableProps } from "./Squashable";
import { colors, fontFamily, radii, spacing } from "../lib/design/theme";

export type ButtonTone = "blue" | "red" | "green" | "yellow" | "outline";

export type PlayfulButtonProps = Omit<SquashableProps, "children"> & {
  label: string;
  tone?: ButtonTone;
  icon?: React.ReactNode;
  disabled?: boolean;
};

const toneBackground: Record<ButtonTone, string> = {
  blue: colors.blue,
  red: colors.red,
  green: colors.green,
  yellow: colors.yellow,
  outline: colors.paper,
};

const toneTextColor: Record<ButtonTone, string> = {
  blue: colors.paper,
  red: colors.paper,
  green: colors.ink,
  yellow: colors.ink,
  outline: colors.ink,
};

export function PlayfulButton({
  label,
  tone = "blue",
  icon,
  disabled = false,
  style,
  ...squashableProps
}: PlayfulButtonProps) {
  const backgroundColor = disabled ? colors.mist : toneBackground[tone];
  const textColor = disabled ? colors.ink : toneTextColor[tone];

  return (
    <Squashable disabled={disabled} style={style} {...squashableProps}>
      <HardShadowBox
        backgroundColor={backgroundColor}
        radius={radii.md}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.sm,
          paddingVertical: spacing.md - 2,
          paddingHorizontal: spacing.lg,
        }}
      >
        {icon}
        <Text style={{ fontFamily: fontFamily.heading, fontSize: 16, color: textColor }}>{label}</Text>
      </HardShadowBox>
    </Squashable>
  );
}
