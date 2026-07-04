import { useRef } from "react";
import { Animated, GestureResponderEvent, Pressable, PressableProps } from "react-native";

export type SquashableProps = PressableProps & {
  children: React.ReactNode;
};

export function Squashable({ children, style, onPressIn, onPressOut, ...pressableProps }: SquashableProps) {
  const pressAnimation = useRef(new Animated.Value(0)).current;

  function handlePressIn(event: GestureResponderEvent) {
    Animated.spring(pressAnimation, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
      bounciness: 0,
    }).start();
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    Animated.spring(pressAnimation, {
      toValue: 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 14,
    }).start();
    onPressOut?.(event);
  }

  const scaleX = pressAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const scaleY = pressAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...pressableProps}>
      <Animated.View style={[{ transform: [{ scaleX }, { scaleY }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}
