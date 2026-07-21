import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function TabTwoScreen() {
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const playAnimations = () => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withTiming(0, { duration: 500 });
  };

  useEffect(() => {
    playAnimations()
  }, [])

  return (
    <Animated.View className="flex-1 items-center justify-center bg-dark w-full p-4" style={headerAnimatedStyle}>
      <Text className="text-xl font-bold">Tab Two</Text>
      <View className="my-8 h-px w-4/5" />
      <Link href="/login">Login</Link>
    </Animated.View>
  );
}
