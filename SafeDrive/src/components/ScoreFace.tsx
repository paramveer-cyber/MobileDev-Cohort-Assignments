import { useTheme } from "@/context/ThemeContext";
import { getScoreColor, getScoreRating } from "@/utils/theme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

type ScoreFaceProps = {
  score: number;
  size?: number;
  showRating?: boolean;
  labelOverride?: string;
};

function buildMouthPath(
  smileAmount: number,
  centerX: number,
  centerY: number,
  mouthWidth: number,
): string {
  const halfWidth = mouthWidth / 2;
  const curveDepth = smileAmount * 22 - 6;
  return `M ${centerX - halfWidth} ${centerY} Q ${centerX} ${centerY + curveDepth} ${centerX + halfWidth} ${centerY}`;
}

function buildBrowPath(
  frownAmount: number,
  side: "left" | "right",
  eyeCenterX: number,
  browY: number,
): string {
  const browHalfWidth = 12;
  const tilt = frownAmount * 6;
  if (side === "left") {
    return `M ${eyeCenterX - browHalfWidth} ${browY + tilt} L ${eyeCenterX + browHalfWidth} ${browY - tilt}`;
  }
  return `M ${eyeCenterX - browHalfWidth} ${browY - tilt} L ${eyeCenterX + browHalfWidth} ${browY + tilt}`;
}

export function ScoreFace({
  score,
  size = 180,
  showRating = true,
  labelOverride,
}: ScoreFaceProps) {
  const { theme } = useTheme();
  const scoreColor = getScoreColor(score, theme);
  const rating = getScoreRating(score);

  const animatedScore = useRef(new Animated.Value(score)).current;
  const eyeOpacityLeft = useRef(new Animated.Value(0.9)).current;
  const eyeOpacityRight = useRef(new Animated.Value(0.9)).current;
  const faceShakeX = useRef(new Animated.Value(0)).current;
  const prevScore = useRef(score);

  useEffect(() => {
    const scoreDrop = prevScore.current - score;
    prevScore.current = score;

    Animated.timing(animatedScore, {
      toValue: score,
      duration: 600,
      useNativeDriver: false,
    }).start();

    if (scoreDrop > 0) {
      Animated.sequence([
        Animated.timing(faceShakeX, {
          toValue: 5,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(faceShakeX, {
          toValue: -5,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(faceShakeX, {
          toValue: 4,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(faceShakeX, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(eyeOpacityLeft, {
          toValue: 0.2,
          duration: 120,
          useNativeDriver: false,
        }),
        Animated.timing(eyeOpacityLeft, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      Animated.sequence([
        Animated.timing(eyeOpacityRight, {
          toValue: 0.2,
          duration: 120,
          useNativeDriver: false,
        }),
        Animated.timing(eyeOpacityRight, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [score]);

  const center = size / 2;
  const faceRadius = size * 0.38;
  const eyeOffsetX = faceRadius * 0.35;
  const eyeY = center - faceRadius * 0.1;
  const eyeRx = faceRadius * 0.13;
  const mouthY = center + faceRadius * 0.28;
  const mouthWidth = faceRadius * 0.9;
  const browY = eyeY - faceRadius * 0.26;

  const smileAmount = animatedScore.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const frownAmount = animatedScore.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const faceCircleOpacity = animatedScore.interpolate({
    inputRange: [0, 30, 70, 100],
    outputRange: [0.85, 0.9, 0.95, 1],
    extrapolate: "clamp",
  });

  const mouthPath = smileAmount.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      buildMouthPath(0, center, mouthY, mouthWidth),
      buildMouthPath(0.25, center, mouthY, mouthWidth),
      buildMouthPath(0.5, center, mouthY, mouthWidth),
      buildMouthPath(0.75, center, mouthY, mouthWidth),
      buildMouthPath(1, center, mouthY, mouthWidth),
    ],
    extrapolate: "clamp",
  });

  const leftBrowPath = frownAmount.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      buildBrowPath(0, "left", center - eyeOffsetX, browY),
      buildBrowPath(0.5, "left", center - eyeOffsetX, browY),
      buildBrowPath(1, "left", center - eyeOffsetX, browY),
    ],
    extrapolate: "clamp",
  });

  const rightBrowPath = frownAmount.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      buildBrowPath(0, "right", center + eyeOffsetX, browY),
      buildBrowPath(0.5, "right", center + eyeOffsetX, browY),
      buildBrowPath(1, "right", center + eyeOffsetX, browY),
    ],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={{ transform: [{ translateX: faceShakeX }] }}>
        <Svg width={size} height={size}>
          <AnimatedCircle
            cx={center}
            cy={center}
            r={faceRadius}
            fill={scoreColor}
            opacity={faceCircleOpacity}
          />

          <AnimatedEllipse
            cx={center - eyeOffsetX}
            cy={eyeY}
            rx={eyeRx}
            ry={eyeRx}
            fill="white"
            opacity={eyeOpacityLeft}
          />
          <AnimatedEllipse
            cx={center + eyeOffsetX}
            cy={eyeY}
            rx={eyeRx}
            ry={eyeRx}
            fill="white"
            opacity={eyeOpacityRight}
          />

          <AnimatedPath
            d={mouthPath}
            stroke="white"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          />

          <AnimatedPath
            d={leftBrowPath}
            stroke="white"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.85}
          />
          <AnimatedPath
            d={rightBrowPath}
            stroke="white"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.85}
          />
        </Svg>
      </Animated.View>

      <View style={styles.scoreLabelContainer}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>

      {showRating && (
        <Text style={[styles.ratingText, { color: scoreColor }]}>
          {labelOverride ?? rating}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scoreLabelContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 14,
  },
  scoreText: {
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 8,
  },
});
