import SetPasswordCall from "@/api/setpasswordapi";
import VerifySignupOtp from "@/api/verifySignupOtp";
import LockIcon from "@/assets/icons/lockIcon";
import Loader from "@/components/loader";
import WhiteButton from "@/components/WhiteButton";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
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


export default function SetPasswordScreen() {

    const { email, otp, flow } = useLocalSearchParams();
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const emailText = (email as string) || "alex.rivera@example.com";
    const [loading, setLoading] = useState(false);

    const opacity = useSharedValue(0)

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 600 })
    }, [])

    const handleSetPassword = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (!password || !confirm) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please fill all the fields",
            });
            return;
        }

        if (password.length < 8) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password must be at least 8 characters long",
            });
            return;
        }

        if (password !== confirm) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Passwords do not match",
            });
            return;
        }

        setLoading(true);
        try {
            let res;
            if (flow === "signup") {
                res = await VerifySignupOtp(emailText, (otp as string) || "", password);
            } else {
                res = await SetPasswordCall(emailText, password);
            }

            if (res?.user) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: flow === "signup" ? "Account verified & password set!" : "Password set successfully",
                });
                router.push("/login")
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: res?.error || res?.message || "Something went wrong. Please try again.",
                })
            }

        } catch (e: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: e.message,
            })
        } finally {
            setLoading(false)
        }
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
                                        <LockIcon />
                                    </View>
                                    <Text className="text-text-primary text-2xl font-bold mb-2.5">Set Your Password</Text>
                                    <Text className="text-muted text-base text-center">Enter a password for your accoun with the email : <Text className="text-brand">{emailText}</Text></Text>
                                </View>

                                <View className="w-full items-center justify-center gap-y-6 mt-10">

                                    <View className="w-full justify-start items-center">
                                        <Text className="text-muted w-4/5 font-bold text-base">PASSWORD</Text>
                                        <TextInput
                                            className="w-4/5 h-[50px] border border-muted-dim rounded-md px-4 text-white mt-2.5"
                                            placeholder="Enter Password"
                                            placeholderTextColor="#888"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                    <View className="w-full justify-start items-center">
                                        <Text className="text-muted w-4/5 font-bold text-base">CONFIRM PASSWORD</Text>
                                        <TextInput
                                            className="w-4/5 h-[50px] border border-muted-dim rounded-md px-4 text-white mt-2.5"
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#888"
                                            value={confirm}
                                            onChangeText={setConfirm}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                                <View className="w-full justify-center items-center mt-0">
                                    <WhiteButton onPress={handleSetPassword} text="Set Password" />
                                </View>
                                <View className="items-center justify-center mt-10 gap-y-2.5">
                                    <View className="w-20 h-0.5 bg-[#b2b2b2]" />
                                    <Text className="text-base text-muted font-semibold"> Just a step away from
                                        <Text className="text-brand"> accessing you account</Text>
                                    </Text>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback> :
                    <Loader />
            }
        </>
    );
}