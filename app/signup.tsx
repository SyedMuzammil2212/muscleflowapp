import CreateUser from "@/api/createUser";
import Loader from "@/components/loader";
import WhiteButton from "@/components/WhiteButton";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Toast from "react-native-toast-message";


export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const opacity = useSharedValue(0)

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))


    const checkLogin = async () => {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
            router.replace("/(tabs)")
        }
    }
    useEffect(() => {
        // checkLogin()
        opacity.value = withTiming(1, { duration: 600 })
    }, [])

    const handleSignUp = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (!email || !username) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Toast.show({
                type: "error",
                text1: "Missing Feilds",
                text2: "Please enter your email and password"
            })
            return
        }
        if (!isValidEmail(email)) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Toast.show({
                type: "error",
                text1: "Invalid Email",
                text2: "Please enter a valid email"
            })
            return
        }
        setLoading(true)
        const res = await CreateUser(email.toLowerCase(), username)
        if (res?.user) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({
                type: "success",
                text1: "Sent OTP",
                text2: "An OTP was sent to your email"
            })
            router.push({
                pathname: "/verifycodepage", params: {
                    email: email.toLowerCase()
                }
            })
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: "error",
                text1: "Signup Failed",
                text2: res?.message
            })
        }

        setLoading(false)
    }

    return (
        <ImageBackground
            source={require("@/assets/images/loginbg.jpeg")}
            style={styles.background}
            resizeMode="cover">


            <>
                <Stack.Screen options={{ headerShown: false }} />
                {
                    !loading ?

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <KeyboardAvoidingView
                                style={styles.mainContainer}
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                            >
                                <Animated.View style={[styles.container, animatedStyle]}>
                                    <View style={{ rowGap: 0, alignItems: "center" }}>
                                        <Text style={styles.heading}>Create Account</Text>
                                        <View style={styles.tagLine}>
                                            <Text style={styles.taglineText}>Enter you email and username to sign up on muscle sets!</Text>

                                        </View>
                                    </View>

                                    <View style={{ width: "100%", alignItems: "center", justifyContent: "center", rowGap: 6, marginTop: 40 }}>

                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center" }} >
                                            <Text style={{ color: "#D2C5AC", width: "80%", fontWeight: 700, fontSize: 16 }}>EMAIL</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Email"
                                                placeholderTextColor="#888"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>

                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }} >
                                            <Text style={{ color: "#D2C5AC", width: "80%", fontWeight: 700, fontSize: 16 }}>USERNAME</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter Username"
                                                placeholderTextColor="#888"
                                                value={username}
                                                onChangeText={setUsername}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                        <WhiteButton onPress={handleSignUp} text="Sign In" />
                                    </View>
                                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, rowGap: 10 }}>

                                        <View style={{ width: 80, height: 2, backgroundColor: "#b2b2b2ff" }} ></View>
                                        <Text style={{ fontSize: 16, color: "#D2C5AC", fontWeight: 600 }}> Already have an account? <Text onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                            router.push("/login")
                                        }} style={{ color: "#F8C61E", fontWeight: 800 }}>Login</Text></Text>
                                    </View>
                                </Animated.View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback> :
                        <Loader />
                }
            </>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    loginButton: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 15,
        color: "#000",
        backgroundColor: "#ffffff",
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    tagLine: {
        flexDirection: "row",
        columnGap: 12,
        alignItems: "center",
        justifyContent: "center",
        width: "80%"
    },
    taglineText: {
        color: "#D2C5AC",
        fontSize: 14,
        textAlign: "center"
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "rgba(13, 20, 30, 0.8)",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    heading: {
        color: "#F8C61E",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
    },

    input: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "#9A9079",
        borderRadius: 6,
        paddingHorizontal: 15,
        color: "#fff",
        marginTop: 10,
    },
});