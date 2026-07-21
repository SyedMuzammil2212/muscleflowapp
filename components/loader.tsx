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
        <View className="justify-center items-center h-full bg-deepest">
            <Animated.View
                className="w-[50px] h-[50px] rounded-full border-[8px] border-brand border-t-transparent"
                style={{ transform: [{ rotate: spin }] }}
            />
        </View>
    );
}