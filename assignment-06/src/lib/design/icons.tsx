import Svg, { Circle, Line, Path } from "react-native-svg";
import { colors, strokeWidth as strokeWidthTokens } from "./theme";

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaultProps = {
  size: 24,
  color: colors.ink,
  strokeWidth: strokeWidthTokens.thick,
};

export function PlusIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={12} y1={5} x2={12} y2={19} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={5} y1={12} x2={19} y2={12} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function GearIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  const toothAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3.5} stroke={color} strokeWidth={strokeWidth} />
      {toothAngles.map((angleDegrees) => {
        const angleRadians = (angleDegrees * Math.PI) / 180;
        const innerRadius = 6.5;
        const outerRadius = 9.5;
        const x1 = 12 + innerRadius * Math.cos(angleRadians);
        const y1 = 12 + innerRadius * Math.sin(angleRadians);
        const x2 = 12 + outerRadius * Math.cos(angleRadians);
        const y2 = 12 + outerRadius * Math.sin(angleRadians);
        return (
          <Line key={angleDegrees} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        );
      })}
    </Svg>
  );
}

export function FlameIcon({ size = defaultProps.size, color = colors.yellow, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21c4.2 0 7-2.8 7-6.8 0-3.6-2.6-5.6-3.8-8.2-0.8 1.8-0.9 3.4-2.5 3.4-1.2 0-1.3-1.9-0.5-3.9-3.7 1.9-6.7 5.6-6.7 8.7 0 4 2.8 6.8 6.5 6.8z"
        fill={color}
        stroke={colors.ink}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CheckIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12.5l5 5L20 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TrashIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M9 7V4h6v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 7l1.2 13h7.6L17 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={10} y1={11} x2={10.5} y2={17} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={14} y1={11} x2={13.5} y2={17} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function PencilIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20l0.9-4.6L15.4 4.9a1.5 1.5 0 0 1 2.1 0l1.6 1.6a1.5 1.5 0 0 1 0 2.1L8.6 19.1 4 20z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={13.5} y1={6.8} x2={17.2} y2={10.5} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function HomeIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11.5L12 4l8 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 10v10h12V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 10.5a6 6 0 0 1 12 0c0 4.5 1.8 5.5 1.8 5.5H4.2S6 15 6 10.5z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function BellOffIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 10.5a6 6 0 0 1 12 0c0 4.5 1.8 5.5 1.8 5.5H4.2S6 15 6 10.5z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={4} y1={20} x2={20} y2={4} stroke={colors.red} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function CopyIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 9h9v11H9z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 15H4V4h11v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChartIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M12 20V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M20 20v-7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1={3} y1={20} x2={21} y2={20} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function MoonIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SendIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11L20 4l-6 16-3-7-7-2z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ClockIcon({ size = defaultProps.size, color = defaultProps.color, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 7.5V12l3.2 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
