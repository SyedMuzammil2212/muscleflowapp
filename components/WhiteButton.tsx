import Lightning from "@/assets/icons/lightning";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";


type WhiteButtonProps = {
    text: string,
    onPress: () => void
}
export default function WhiteButton({ text, onPress }: WhiteButtonProps) {
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
        <Animated.View style={[{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 40 }, animatedStyle]}>
            <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.loginButton}>
                <Lightning color="#3D2E00" />
                <Text style={{ color: "#3D2E00", fontSize: 20, fontWeight: "bold" }}>{text}</Text>

            </Pressable>
        </Animated.View>
    )

}

const styles = StyleSheet.create({

    loginButton: {
        flexDirection: "row",
        columnGap: 10,
        width: "80%",
        height: 50,
        borderRadius: 6,
        paddingHorizontal: 15,
        color: "#3D2E00",
        backgroundColor: "#F8C61E",
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center",
    },


});