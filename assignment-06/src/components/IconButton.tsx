import { HardShadowBox } from "./HardShadowBox";
import { Squashable, SquashableProps } from "./Squashable";
import { colors, radii } from "../lib/design/theme";

export type IconButtonProps = Omit<SquashableProps, "children"> & {
  icon: React.ReactNode;
  backgroundColor?: string;
};

export function IconButton({ icon, backgroundColor = colors.paper, style, ...squashableProps }: IconButtonProps) {
  return (
    <Squashable style={style} {...squashableProps}>
      <HardShadowBox
        backgroundColor={backgroundColor}
        radius={radii.pill}
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        {icon}
      </HardShadowBox>
    </Squashable>
  );
}
