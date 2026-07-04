import { Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { colors, fontFamily, strokeWidth as strokeWidthTokens } from "./theme";

export type MascotProps = {
  size?: number;
};

const STROKE = strokeWidthTokens.thick;

export function MascotWaving({ size = 120 }: MascotProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Circle cx={60} cy={30} r={14} stroke={colors.ink} strokeWidth={STROKE} />
      <Circle cx={55} cy={28} r={1.8} fill={colors.ink} />
      <Circle cx={65} cy={28} r={1.8} fill={colors.ink} />
      <Path d="M52 34q8 7 16 0" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Line x1={60} y1={44} x2={60} y2={80} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Line x1={60} y1={80} x2={44} y2={108} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Line x1={60} y1={80} x2={76} y2={108} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Line x1={60} y1={52} x2={40} y2={70} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Path d="M60 52L82 36" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Path d="M76 26q5 4 6 10" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
    </Svg>
  );
}

export function MascotCelebrating({ size = 120 }: MascotProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Line x1={20} y1={22} x2={26} y2={16} stroke={colors.yellow} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
      <Line x1={20} y1={16} x2={26} y2={22} stroke={colors.yellow} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
      <Line x1={96} y1={26} x2={102} y2={20} stroke={colors.blue} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
      <Line x1={96} y1={20} x2={102} y2={26} stroke={colors.blue} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
      <Circle cx={60} cy={28} r={14} stroke={colors.ink} strokeWidth={STROKE} />
      <Path d="M53 25q2-3 4 0" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
      <Path d="M63 25q2-3 4 0" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
      <Path d="M53 33q7 6 14 0" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Line x1={60} y1={42} x2={60} y2={78} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Path d="M60 78L44 100" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Path d="M60 78L76 100" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Path d="M60 48L38 22" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      <Path d="M60 48L82 22" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
    </Svg>
  );
}

export function MascotSleepy({ size = 120 }: MascotProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Circle cx={32} cy={72} r={14} stroke={colors.ink} strokeWidth={STROKE} />
        <Path d="M26 70q3-3 6 0" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
        <Path d="M34 70q3-3 6 0" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
        <Path d="M29 78q3 2 6 0" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
        <Line x1={46} y1={72} x2={92} y2={72} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M92 72L108 62" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M92 72L108 82" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
        <Line x1={58} y1={72} x2={58} y2={92} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
      </Svg>
      <Text
        style={{
          position: "absolute",
          top: 8,
          right: 14,
          fontFamily: fontFamily.heading,
          fontSize: 20,
          color: colors.ink,
          transform: [{ rotate: "-8deg" }],
        }}
      >
        Z z z
      </Text>
    </View>
  );
}

export function MascotShrug({ size = 120 }: MascotProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <Circle cx={60} cy={32} r={14} stroke={colors.ink} strokeWidth={STROKE} />
        <Path d="M52 26l4 2" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
        <Path d="M68 26l-4 2" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
        <Circle cx={55} cy={31} r={1.6} fill={colors.ink} />
        <Circle cx={65} cy={31} r={1.6} fill={colors.ink} />
        <Path d="M54 39q3 2 6 2t6-2" stroke={colors.ink} strokeWidth={strokeWidthTokens.thin} strokeLinecap="round" />
        <Line x1={60} y1={46} x2={60} y2={82} stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M60 82L46 110" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M60 82L74 110" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" />
        <Path d="M60 54L40 48L34 58" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M60 54L80 48L86 58" stroke={colors.ink} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text
        style={{
          position: "absolute",
          top: 0,
          right: 22,
          fontFamily: fontFamily.display,
          fontSize: 22,
          color: colors.red,
          transform: [{ rotate: "8deg" }],
        }}
      >
        ?
      </Text>
    </View>
  );
}
