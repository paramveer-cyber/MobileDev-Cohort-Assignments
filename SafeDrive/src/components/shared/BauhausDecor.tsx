import { useTheme } from "@/context/ThemeContext";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
  Polygon,
  Rect,
} from "react-native-svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type BauhausDecorProps = {
  variant?: "home" | "drive" | "history" | "minimal";
};

export function BauhausDecor({ variant = "home" }: BauhausDecorProps) {
  const { themeMode } = useTheme();

  const isDark = themeMode === "dark";

  const red = isDark ? "#FF4D47" : "#E63329";
  const blue = isDark ? "#5B8AFF" : "#1B4FD8";
  const yellow = isDark ? "#FFD600" : "#D4A800";
  const lineColor = isDark ? "#888888" : "#333333";

  const shapeOpacity = isDark ? 0.55 : 0.45;
  const strokeOpacity = isDark ? 0.65 : 0.5;
  const lineOpacity = isDark ? 0.3 : 0.22;

  const wigglePath1 = useMemo(
    () =>
      `M -10 80 C 30 50, 70 110, 110 80 C 150 50, 190 110, 230 80 C 270 50, 310 110, 350 80 C 390 50, 430 110, 470 80 C 510 50, 550 110, ${SCREEN_WIDTH + 10} 80`,
    [],
  );

  const wigglePath2 = useMemo(
    () =>
      `M -10 0 C 40 -30, 80 30, 130 0 C 180 -30, 220 30, 270 0 C 320 -30, 360 30, 410 0 C 460 -30, 500 30, ${SCREEN_WIDTH + 10} 0`,
    [],
  );

  if (variant === "minimal") {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          style={StyleSheet.absoluteFill}
        >
          <Circle
            cx={SCREEN_WIDTH - 30}
            cy={60}
            r={18}
            fill={blue}
            opacity={shapeOpacity}
          />
          <Circle
            cx={40}
            cy={SCREEN_HEIGHT - 100}
            r={10}
            fill={red}
            opacity={shapeOpacity}
          />
          <Circle
            cx={SCREEN_WIDTH - 50}
            cy={SCREEN_HEIGHT - 160}
            r={6}
            fill={yellow}
            opacity={shapeOpacity}
          />
          <Path
            d={wigglePath1}
            stroke={blue}
            strokeWidth={1.5}
            fill="none"
            opacity={strokeOpacity}
            translateY={SCREEN_HEIGHT - 200}
          />
        </Svg>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={StyleSheet.absoluteFill}
      >
        <Circle
          cx={SCREEN_WIDTH - 40}
          cy={-20}
          r={90}
          fill={blue}
          opacity={shapeOpacity}
        />
        <Circle
          cx={-30}
          cy={SCREEN_HEIGHT * 0.35}
          r={70}
          fill={red}
          opacity={shapeOpacity}
        />
        <Circle
          cx={SCREEN_WIDTH * 0.6}
          cy={SCREEN_HEIGHT - 60}
          r={100}
          fill={yellow}
          opacity={shapeOpacity * 0.75}
        />

        <Circle
          cx={SCREEN_WIDTH * 0.15}
          cy={180}
          r={8}
          fill={red}
          opacity={shapeOpacity}
        />
        <Circle
          cx={SCREEN_WIDTH * 0.15 + 22}
          cy={180}
          r={8}
          fill={yellow}
          opacity={shapeOpacity}
        />
        <Circle
          cx={SCREEN_WIDTH * 0.15 + 44}
          cy={180}
          r={8}
          fill={blue}
          opacity={shapeOpacity}
        />

        <Circle
          cx={SCREEN_WIDTH - 60}
          cy={SCREEN_HEIGHT * 0.55}
          r={5}
          fill={blue}
          opacity={shapeOpacity}
        />
        <Circle
          cx={SCREEN_WIDTH - 42}
          cy={SCREEN_HEIGHT * 0.55}
          r={5}
          fill={red}
          opacity={shapeOpacity}
        />
        <Circle
          cx={SCREEN_WIDTH - 24}
          cy={SCREEN_HEIGHT * 0.55}
          r={5}
          fill={yellow}
          opacity={shapeOpacity}
        />

        <Circle
          cx={SCREEN_WIDTH * 0.8}
          cy={SCREEN_HEIGHT * 0.3}
          r={40}
          fill="none"
          stroke={red}
          strokeWidth={2.5}
          opacity={strokeOpacity}
        />
        <Circle
          cx={SCREEN_WIDTH * 0.2}
          cy={SCREEN_HEIGHT * 0.7}
          r={25}
          fill="none"
          stroke={blue}
          strokeWidth={2}
          opacity={strokeOpacity}
        />

        <Rect
          x={SCREEN_WIDTH - 80}
          y={SCREEN_HEIGHT * 0.7}
          width={40}
          height={40}
          fill={red}
          opacity={shapeOpacity}
          rotation={15}
          originX={SCREEN_WIDTH - 60}
          originY={SCREEN_HEIGHT * 0.7 + 20}
        />
        <Rect
          x={20}
          y={SCREEN_HEIGHT * 0.15}
          width={24}
          height={24}
          fill={yellow}
          opacity={shapeOpacity}
          rotation={-10}
          originX={32}
          originY={SCREEN_HEIGHT * 0.15 + 12}
        />

        <Polygon
          points={`${SCREEN_WIDTH * 0.85},${SCREEN_HEIGHT * 0.18} ${SCREEN_WIDTH * 0.85 - 20},${SCREEN_HEIGHT * 0.18 + 34} ${SCREEN_WIDTH * 0.85 + 20},${SCREEN_HEIGHT * 0.18 + 34}`}
          fill={yellow}
          opacity={shapeOpacity}
        />

        <Ellipse
          cx={SCREEN_WIDTH * 0.3}
          cy={SCREEN_HEIGHT * 0.88}
          rx={50}
          ry={18}
          fill={blue}
          opacity={shapeOpacity}
          rotation={-20}
          originX={SCREEN_WIDTH * 0.3}
          originY={SCREEN_HEIGHT * 0.88}
        />

        <Path
          d={wigglePath1}
          stroke={blue}
          strokeWidth={2}
          fill="none"
          opacity={strokeOpacity}
          translateY={SCREEN_HEIGHT * 0.42}
        />
        <Path
          d={wigglePath2}
          stroke={red}
          strokeWidth={1.5}
          fill="none"
          opacity={strokeOpacity}
          translateY={SCREEN_HEIGHT * 0.62}
        />

        <Line
          x1={0}
          y1={SCREEN_HEIGHT * 0.25}
          x2={SCREEN_WIDTH * 0.4}
          y2={SCREEN_HEIGHT * 0.25}
          stroke={lineColor}
          strokeWidth={1}
          opacity={lineOpacity}
        />
        <Line
          x1={SCREEN_WIDTH * 0.6}
          y1={SCREEN_HEIGHT * 0.78}
          x2={SCREEN_WIDTH}
          y2={SCREEN_HEIGHT * 0.78}
          stroke={lineColor}
          strokeWidth={1}
          opacity={lineOpacity}
        />

        <Path
          d={`M ${SCREEN_WIDTH * 0.05} ${SCREEN_HEIGHT * 0.5} A 45 45 0 0 1 ${SCREEN_WIDTH * 0.05 + 90} ${SCREEN_HEIGHT * 0.5}`}
          fill="none"
          stroke={yellow}
          strokeWidth={3}
          opacity={strokeOpacity}
        />
      </Svg>
    </View>
  );
}
