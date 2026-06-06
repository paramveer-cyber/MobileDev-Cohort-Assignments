import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { getScoreColor, getScoreRating } from "@/utils/theme";

type ScoreRingProps = {
  score: number;
  size?: number;
  strokeWidth?: number;
  showRating?: boolean;
  labelOverride?: string;
};

export function ScoreRing({
  score,
  size = 140,
  strokeWidth = 10,
  showRating = true,
  labelOverride,
}: ScoreRingProps) {
  const { theme } = useTheme();
  const scoreColor = getScoreColor(score, theme);
  const rating = getScoreRating(score);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filledLength = (score / 100) * circumference;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${filledLength} ${circumference - filledLength}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          rotation={-90}
          originX={center}
          originY={center}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{score}</Text>
        {showRating && (
          <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
            {labelOverride ?? rating}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
});
