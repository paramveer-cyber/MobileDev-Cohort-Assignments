import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import Svg, {
  Circle,
  Line,
  Path,
  Rect,
} from "react-native-svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BAUHAUS_RED = "#E63329";
const BAUHAUS_BLUE = "#1B4FD8";
const BAUHAUS_YELLOW = "#F5C800";
const CREAM = "#F5F0E8";
const BLACK = "#0D0D0D";

type AnimatedSplashScreenProps = {
  onFinished: () => void;
};

export function AnimatedSplashScreen({ onFinished }: AnimatedSplashScreenProps) {
  const bgScale = useRef(new Animated.Value(0)).current;
  const redCircleScale = useRef(new Animated.Value(0)).current;
  const blueCircleScale = useRef(new Animated.Value(0)).current;
  const yellowRectRotate = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(24)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(bgScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(redCircleScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: 120,
          useNativeDriver: true,
        }),
        Animated.spring(blueCircleScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: 220,
          useNativeDriver: true,
        }),
        Animated.spring(yellowRectRotate, {
          toValue: 1,
          tension: 45,
          friction: 6,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(logoTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onFinished());
  }, []);

  const yellowRotation = yellowRectRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-45deg", "15deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill={CREAM} />
          <Line
            x1={0} y1={SCREEN_HEIGHT * 0.35}
            x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.35}
            stroke={BLACK} strokeWidth={1} opacity={0.08}
          />
          <Line
            x1={0} y1={SCREEN_HEIGHT * 0.65}
            x2={SCREEN_WIDTH} y2={SCREEN_HEIGHT * 0.65}
            stroke={BLACK} strokeWidth={1} opacity={0.08}
          />
          <Line
            x1={SCREEN_WIDTH * 0.33} y1={0}
            x2={SCREEN_WIDTH * 0.33} y2={SCREEN_HEIGHT}
            stroke={BLACK} strokeWidth={1} opacity={0.06}
          />
          <Line
            x1={SCREEN_WIDTH * 0.67} y1={0}
            x2={SCREEN_WIDTH * 0.67} y2={SCREEN_HEIGHT}
            stroke={BLACK} strokeWidth={1} opacity={0.06}
          />
          <Circle
            cx={SCREEN_WIDTH - 40} cy={-20} r={100}
            fill={BAUHAUS_BLUE} opacity={0.12}
          />
          <Circle
            cx={-20} cy={SCREEN_HEIGHT - 60} r={80}
            fill={BAUHAUS_RED} opacity={0.1}
          />
          <Path
            d={`M -10 80 C 30 50, 70 110, 110 80 C 150 50, 190 110, 230 80 C 270 50, 310 110, 350 80 C 390 50, 430 110, ${SCREEN_WIDTH + 10} 80`}
            stroke={BAUHAUS_BLUE} strokeWidth={1.5} fill="none" opacity={0.18}
            translateY={SCREEN_HEIGHT * 0.78}
          />
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.topCircle,
          { transform: [{ scale: blueCircleScale }] },
        ]}
      />

      <Animated.View
        style={[
          styles.accentCircle,
          { transform: [{ scale: redCircleScale }] },
        ]}
      />

      <Animated.View
        style={[
          styles.yellowRect,
          { transform: [{ rotate: yellowRotation }] },
        ]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <Svg width={64} height={64} viewBox="0 0 64 64">
            <Circle cx={32} cy={32} r={32} fill={BAUHAUS_BLUE} />
            <Path
              d="M20 38 C20 28, 44 28, 44 38"
              stroke={CREAM} strokeWidth={3} fill="none" strokeLinecap="round"
            />
            <Circle cx={24} cy={28} r={3} fill={CREAM} />
            <Circle cx={40} cy={28} r={3} fill={CREAM} />
            <Path
              d="M28 44 L32 32 L36 44"
              stroke={BAUHAUS_YELLOW} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Animated.Text style={styles.appName}>
          SAFE DRIVE
        </Animated.Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Drive smart. Arrive safe.
      </Animated.Text>

      <View style={styles.bottomDots}>
        <View style={[styles.dot, { backgroundColor: BAUHAUS_RED }]} />
        <View style={[styles.dot, { backgroundColor: BAUHAUS_YELLOW }]} />
        <View style={[styles.dot, { backgroundColor: BAUHAUS_BLUE }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  topCircle: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: BAUHAUS_BLUE,
    opacity: 0.85,
  },
  accentCircle: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.18,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: BAUHAUS_RED,
    opacity: 0.8,
  },
  yellowRect: {
    position: "absolute",
    bottom: 60,
    right: 30,
    width: 70,
    height: 70,
    backgroundColor: BAUHAUS_YELLOW,
    opacity: 0.9,
  },
  logoContainer: {
    alignItems: "center",
    gap: 20,
  },
  iconWrapper: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 8,
    color: BLACK,
  },
  tagline: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.22,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1.5,
    color: "#4A4A4A",
  },
  bottomDots: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
