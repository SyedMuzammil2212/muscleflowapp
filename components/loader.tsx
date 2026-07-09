import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

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
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.loader,
                    {
                        transform: [{ rotate: spin }],
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#0D141E"
    },

    loader: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 8,
        borderColor: "#F8C61E",          // Your brand color
        borderTopColor: "transparent",   // Creates the gap
    },
});