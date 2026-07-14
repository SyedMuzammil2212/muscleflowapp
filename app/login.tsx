import Userlogin from "@/api/userLogin";
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
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Toast from "react-native-toast-message";


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const opacity = useSharedValue(0)


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

    const handleLogin = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (!email || !password) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Toast.show({
                type: "error",
                text1: "Missing Feilds",
                text2: "Please enter your email and password"
            })
            return
        }
        setLoading(true)
        console.log(email.toLowerCase(), password)
        const res = await Userlogin(email.toLowerCase(), password)
        console.log(res);
        if (res?.token) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({
                type: "success",
                text1: "Loggedin Successfully",
                text2: "Welcome Back"
            })
            router.replace("/(tabs)")
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: "error",
                text1: "Login Failed",
                text2: res.error
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
                                        <Text style={styles.heading}>Muscleflow</Text>
                                        <View style={styles.tagLine}>
                                            <Text style={styles.taglineText}>DISCIPLINE  .</Text>
                                            <Text style={styles.taglineText}>AUTHORITY  .</Text>
                                            <Text style={styles.taglineText}>PRECISION</Text>
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
                                            <Text style={{ color: "#D2C5AC", width: "80%", fontWeight: 700, fontSize: 16 }}>PASSWORD</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Password"
                                                placeholderTextColor="#888"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                                        <WhiteButton onPress={handleLogin} text="Log In" />
                                    </View>
                                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, rowGap: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                router.push("/forgotpass");
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, color: "#D2C5AC", fontWeight: 600 }}> Forgot Password</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: 80, height: 2, backgroundColor: "#b2b2b2ff" }} ></View>
                                        <Text style={{ fontSize: 16, color: "#D2C5AC", fontWeight: 600 }}> Don't Have an account? <Text onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                            router.push("/signup")
                                        }} style={{ color: "#F8C61E", fontWeight: 800 }}>Sign Up</Text></Text>
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
        justifyContent: "center"
    },
    taglineText: {
        color: "#D2C5AC",
        fontSize: 14,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "rgba(13, 20, 30, 0.6)",
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