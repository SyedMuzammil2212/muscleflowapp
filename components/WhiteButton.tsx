import Lightning from "@/assets/icons/lightning";
import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";


type WhiteButtonProps = {
    text: string,
    onPress: () => void
    marginStay?: boolean
}
export default function WhiteButton({ text, onPress, marginStay = true }: WhiteButtonProps) {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))

    const handlePressIn = () => {
        scale.value = withSpring(0.9);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const handlePressOut = () => {
        scale.value = withSpring(1);
    }

    const handlePress = () => {
        onPress();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    return (
        <Animated.View className={`w-full justify-center items-center ${marginStay ? "mt-10" : ""}`} style={animatedStyle}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="flex-row gap-x-2.5 w-4/5 h-[50px] rounded-md px-4 bg-brand mt-4 justify-center items-center"
            >
                <Lightning color="#3D2E00" />
                <Text className="text-[#3D2E00] text-xl font-bold">{text}</Text>
            </Pressable>
        </Animated.View>
    )

}