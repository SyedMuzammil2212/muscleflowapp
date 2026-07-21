import ForgotPassCall from "@/api/forgotPasswordCall";
import ForgotPasswordIcon from "@/assets/icons/forgotPasswordIcon";
import Loader from "@/components/loader";
import WhiteButton from "@/components/WhiteButton";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Toast from "react-native-toast-message";


export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const opacity = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 600 })
    }, [])

    const handleLogin = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (!email) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Toast.show({
                type: "error",
                text1: "Missing Feilds",
                text2: "Please enter your email"
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
        const res = await ForgotPassCall(email.toLowerCase())
        if (res?.user) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Toast.show({
                type: "success",
                text1: "Sent Successfully",
                text2: "Code sent to your email"
            })
            router.push({
                pathname: "/verifycodepage",
                params: {
                    email: email.toLowerCase()
                }
            })
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: "error",
                text1: "Email Not Registered",
                text2: res?.message || "Something went wrong"
            })
        }

        setLoading(false)
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            {
                !loading ?

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            className="flex-1 bg-[rgba(13,20,30,1)]"
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            <Animated.View className="flex-1 justify-center items-center" style={animatedStyle}>
                                <View className="gap-y-0 items-center w-4/5">
                                    <View className="w-24 h-24 bg-surface-2 rounded-full justify-center items-center border border-muted-dim mb-12 mt-12">
                                        <ForgotPasswordIcon />
                                    </View>
                                    <Text className="text-text-primary text-2xl font-bold mb-2.5">Forgot Password?</Text>
                                    <Text className="text-muted text-base text-center">Enter your email address and we will send you a 6 digit verification code to you email</Text>
                                </View>

                                <View className="w-full items-center justify-center gap-y-1.5 mt-10">
                                    <View className="w-full justify-start items-center">
                                        <Text className="text-muted w-4/5 font-bold text-base">EMAIL</Text>
                                        <TextInput
                                            className="w-4/5 h-[50px] border border-muted-dim rounded-md px-4 text-white mt-2.5"
                                            placeholder="Enter Email"
                                            placeholderTextColor="#888"
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>
                                </View>
                                <View className="w-full justify-center items-center mt-0">
                                    <WhiteButton onPress={handleLogin} text="Send Code" />
                                </View>
                                <View className="items-center justify-center mt-10 gap-y-2.5">
                                    <View className="w-20 h-0.5 bg-[#b2b2b2]" />
                                    <Text className="text-base text-muted font-semibold"> Already have an account? <Text onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.replace("/login"); }} className="text-brand font-extrabold">Login</Text></Text>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback> :
                    <Loader />
            }
        </>
    );
}