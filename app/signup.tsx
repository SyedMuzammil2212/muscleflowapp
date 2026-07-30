import CreateUser from "@/api/createUser";
import GoogleSignUp from "@/api/googleSignup";
import GoogleIcon from "@/assets/icons/googleIcon";
import Loader from "@/components/loader";
import WhiteButton from "@/components/WhiteButton";
import useGoogleAuth from "@/hooks/useGoogleAuth";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Toast from "react-native-toast-message";





import { useUser } from "@/components/userContext";

export default function SignUpScreen() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle } = useGoogleAuth();
    const { refreshUser } = useUser();

    const handleGoogleSignUp = async () => {
        try {
            const idToken = await signInWithGoogle();
            if (!idToken) return;

            setLoading(true);
            const response = await GoogleSignUp(idToken);

            if (response?.token) {
                if (refreshUser) await refreshUser();
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Toast.show({
                    type: "success",
                    text1: "Signed up Successfully",
                    text2: "Welcome to MuscleFlow"
                });
                router.replace("/(tabs)");
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Toast.show({
                    type: "error",
                    text1: "Signup Failed",
                    text2: response.error
                });
            }
            setLoading(false);


        } catch (error) {
            console.log(error);
        }
    };

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
                    email: email.toLowerCase(),
                    flow: "signup"
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
            className="flex-1"
            resizeMode="cover">

            <>
                <Stack.Screen options={{ headerShown: false }} />
                {
                    !loading ?

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <KeyboardAvoidingView
                                className="flex-1 bg-[rgba(13,20,30,0.8)]"
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                            >
                                <Animated.View className="flex-1 justify-center items-center" style={animatedStyle}>
                                    <View className="gap-y-0 items-center">
                                        <Text className="text-brand text-4xl font-bold mb-5">Create Account</Text>
                                        <View className="flex-row gap-x-3 items-center justify-center w-4/5">
                                            <Text className="text-muted text-sm text-center">Enter you email and username to sign up on muscle sets!</Text>
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
                                            <Text className="text-muted w-4/5 font-bold text-base">USERNAME</Text>
                                            <TextInput
                                                className="w-4/5 h-[50px] border border-muted-dim rounded-md px-4 text-white mt-2.5"
                                                placeholder="Enter Username"
                                                placeholderTextColor="#888"
                                                value={username}
                                                onChangeText={setUsername}
                                            />
                                        </View>
                                    </View>
                                    <View className="w-full justify-center items-center mt-2.5">
                                        <WhiteButton marginStay={true} onPress={handleSignUp} text="Sign In" />
                                    </View>
                                    <View className=" flex flex-row gap-3 items-center justify-center mt-6 " >
                                        <View className="w-24 h-0.5 bg-[#D2C5AC]"></View>
                                        <Text className="font-[14px] text-[#D2C5AC]">OR SIGN UP WITH</Text>
                                        <View className="w-24 h-0.5 bg-[#D2C5AC]"></View>
                                    </View>
                                    <Pressable
                                        onPress={handleGoogleSignUp}
                                        className="flex-row gap-x-2.5 w-4/5 h-[50px] rounded-md px-4 border border-muted-dim mt-4 justify-center items-center"
                                    >
                                        <GoogleIcon />
                                        <Text className="text-[#DCE3F1] text-xl font-bold">GOOGLE</Text>
                                    </Pressable>
                                    <View className="items-center justify-center mt-10 gap-y-2.5">
                                        <View className="w-20 h-0.5 bg-[#b2b2b2]" />
                                        <Text className="text-base text-muted font-semibold"> Already have an account? <Text onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                            router.push("/login")
                                        }} className="text-brand font-extrabold">Login</Text></Text>
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