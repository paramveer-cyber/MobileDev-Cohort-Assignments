import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH - 48;

type TutorialSlide = {
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
};

function PlacePhoneIcon({ color }: { color: string }) {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Rect x={22} y={8} width={28} height={48} rx={5} fill="none" stroke={color} strokeWidth={2.5} />
      <Rect x={27} y={14} width={18} height={30} rx={2} fill={color} opacity={0.15} />
      <Circle cx={36} cy={50} r={3} fill={color} opacity={0.6} />
      <Path d="M10 36 L18 36 M54 36 L62 36" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M14 28 L18 36 L14 44" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M58 28 L54 36 L58 44" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SensorIcon({ color }: { color: string }) {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Circle cx={36} cy={36} r={8} fill={color} />
      <Circle cx={36} cy={36} r={16} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
      <Circle cx={36} cy={36} r={26} fill="none" stroke={color} strokeWidth={1.5} opacity={0.25} />
      <Path d="M36 10 L36 18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M36 54 L36 62" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M10 36 L18 36" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M54 36 L62 36" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

function ScoreIcon({ color }: { color: string }) {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Circle cx={36} cy={36} r={26} fill="none" stroke={color} strokeWidth={3} opacity={0.2} />
      <Path
        d="M10 36 A26 26 0 0 1 62 36"
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
      />
      <Text style={{ fill: color, fontSize: 16, fontWeight: "800" }} x={28} y={42}>100</Text>
      <Path d="M28 52 L36 44 L44 56" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
    </Svg>
  );
}

function PenaltyIcon({ color }: { color: string }) {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Path d="M36 12 L64 58 L8 58 Z" fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      <Path d="M36 30 L36 44" stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={36} cy={51} r={2.5} fill={color} />
    </Svg>
  );
}

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: "Mount Your Phone",
    description:
      "Place your phone in a dashboard or windshield mount before starting. The sensors need a stable reference to accurately detect driving events.",
    accentColor: "#1B4FD8",
    icon: <PlacePhoneIcon color="#1B4FD8" />,
  },
  {
    title: "Sensors Watch Everything",
    description:
      "The accelerometer and gyroscope detect harsh braking, sharp turns, sudden acceleration, and even if you pick up your phone while driving.",
    accentColor: "#1A7A3C",
    icon: <SensorIcon color="#1A7A3C" />,
  },
  {
    title: "You Start at 100",
    description:
      "Your safety score begins at 100 each drive. Drive smoothly and it stays high — the animated face reflects your score in real time.",
    accentColor: "#C47800",
    icon: <ScoreIcon color="#C47800" />,
  },
  {
    title: "Events Deduct Points",
    description:
      "Phone handling costs the most (−10 pts). Harsh braking and acceleration cost −5 each. Sharp turns −3. Minor excess movement −2.",
    accentColor: "#E63329",
    icon: <PenaltyIcon color="#E63329" />,
  },
];

type TutorialModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

export function TutorialModal({ visible, onDismiss }: TutorialModalProps) {
  const { theme } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const isLastSlide = currentSlideIndex === TUTORIAL_SLIDES.length - 1;
  const currentSlide = TUTORIAL_SLIDES[currentSlideIndex];

  const handleNext = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    if (isLastSlide) {
      onDismiss();
      setCurrentSlideIndex(0);
    } else {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * SLIDE_WIDTH, animated: true });
    }
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    if (newIndex !== currentSlideIndex) setCurrentSlideIndex(newIndex);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <View style={[styles.accentBar, { backgroundColor: currentSlide.accentColor }]} />

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEnabled={false}
            style={{ width: SLIDE_WIDTH }}
          >
            {TUTORIAL_SLIDES.map((slide) => (
              <View key={slide.title} style={[styles.slide, { width: SLIDE_WIDTH }]}>
                <View style={[styles.iconCircle, { borderColor: slide.accentColor + "30", backgroundColor: slide.accentColor + "10" }]}>
                  {slide.icon}
                </View>
                <Text style={[styles.slideTitle, { color: theme.text }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.slideDescription, { color: theme.textSecondary }]}>
                  {slide.description}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.dotsRow}>
            {TUTORIAL_SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentSlideIndex
                        ? currentSlide.accentColor
                        : theme.border,
                    width: index === currentSlideIndex ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            {currentSlideIndex > 0 && (
              <TouchableOpacity
                style={[styles.skipButton, { borderColor: theme.border }]}
                onPress={() => {
                  const prevIndex = currentSlideIndex - 1;
                  setCurrentSlideIndex(prevIndex);
                  scrollRef.current?.scrollTo({ x: prevIndex * SLIDE_WIDTH, animated: true });
                }}
              >
                <Text style={[styles.skipText, { color: theme.textSecondary }]}>Back</Text>
              </TouchableOpacity>
            )}
            {currentSlideIndex === 0 && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => { onDismiss(); setCurrentSlideIndex(0); }}
              >
                <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
              </TouchableOpacity>
            )}
            <Animated.View style={[styles.nextButtonWrapper, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: currentSlide.accentColor }]}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={styles.nextButtonText}>
                  {isLastSlide ? "Let's Go" : "Next"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
  },
  accentBar: {
    height: 5,
    width: "100%",
  },
  slide: {
    paddingTop: 32,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  slideDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingBottom: 16,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    marginBottom: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    alignItems: "center",
  },
  skipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 15,
    fontWeight: "600",
  },
  nextButtonWrapper: {
    flex: 2,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
