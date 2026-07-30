import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export default function Loader() {
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        rotate.setValue(0);

        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            {
                resetBeforeIteration: true,
            }
        ).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={{ flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#070F18" }}>
            <Animated.View
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 4,
                    borderColor: "#F8C61E",
                    borderTopColor: "transparent",
                    transform: [{ rotate: spin }],
                }}
            />
        </View>
    );
}