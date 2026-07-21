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

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

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
        const res = await Userlogin(email.toLowerCase(), password)
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
            className="flex-1"
            resizeMode="cover">

            <>
                <Stack.Screen options={{ headerShown: false }} />
                {
                    !loading ?

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <KeyboardAvoidingView
                                className="flex-1 bg-[rgba(13,20,30,0.6)]"
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                            >
                                <Animated.View className="flex-1 justify-center items-center" style={animatedStyle}>
                                    <View className="gap-y-0 items-center">
                                        <Text className="text-brand text-4xl font-bold mb-5">Muscleflow</Text>
                                        <View className="flex-row gap-x-3 items-center justify-center">
                                            <Text className="text-muted text-sm">DISCIPLINE  .</Text>
                                            <Text className="text-muted text-sm">AUTHORITY  .</Text>
                                            <Text className="text-muted text-sm">PRECISION</Text>
                                        </View>
                                    </View>

                                    <View className="w-full items-center justify-center gap-y-1.5 mt-10">

                                        <View className="w-full justify-start items-center">
                                            <Text className="text-muted w-4/5 font-bold text-base">EMAIL</Text>
                                            <TextInput
                                                className="w-4/5 h-[50px] border border-muted-dim rounded-md px-4 text-white mt-2.5"
                                                placeholder="Email"
                                                placeholderTextColor="#888"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>

                                        <View className="w-full justify-start items-center mt-4">
                                            <Text className="text-muted w-4/5 font-bold text-base">PASSWORD</Text>
                                            <TextInput
                                                className="w-4/5 h-[50px] border border-muted-dim rounded-md px-4 text-white mt-2.5"
                                                placeholder="Password"
                                                placeholderTextColor="#888"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry
                                            />
                                        </View>
                                    </View>
                                    <View className="w-full justify-center items-center mt-2.5">
                                        <WhiteButton onPress={handleLogin} text="Log In" />
                                    </View>
                                    <View className="items-center justify-center mt-10 gap-y-2.5">
                                        <TouchableOpacity
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                router.push("/forgotpass");
                                            }}
                                        >
                                            <Text className="text-base text-muted font-semibold"> Forgot Password</Text>
                                        </TouchableOpacity>
                                        <View className="w-20 h-0.5 bg-[#b2b2b2]" />
                                        <Text className="text-base text-muted font-semibold"> Don't Have an account? <Text onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                            router.push("/signup")
                                        }} className="text-brand font-extrabold">Sign Up</Text></Text>
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