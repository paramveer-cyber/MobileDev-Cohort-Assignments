import { Text } from "react-native";
import { HardShadowBox } from "./HardShadowBox";
import { Squashable } from "./Squashable";
import { colors, fontFamily, radii, spacing } from "../lib/design/theme";

export type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Squashable onPress={onPress}>
      <HardShadowBox
        backgroundColor={selected ? colors.blue : colors.paper}
        radius={radii.pill}
        flat={!selected}
        style={{
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.heading,
            fontSize: 14,
            color: selected ? colors.paper : colors.ink,
          }}
        >
          {label}
        </Text>
      </HardShadowBox>
    </Squashable>
  );
}
