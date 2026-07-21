import ForgotPassCall from "@/api/forgotPasswordCall";
import VerifyOtp from "@/api/verifyOtp";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function VerifyCodeScreen() {
    const { email } = useLocalSearchParams();
    const emailText = (email as string) || "alex.rivera@example.com";
    const insets = useSafeAreaInsets();

    const [code, setCode] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!isFocused) return;
        const interval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(interval);
    }, [isFocused]);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const handleCodeChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, "");
        setCode(cleaned);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (cleaned.length === 6) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Keyboard.dismiss();
        }
    };

    const handleVerify = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (code.length < 6) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Toast.show({
                type: "error",
                text1: "Invalid Code",
                text2: "Please enter the 6-digit code",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await VerifyOtp(emailText, code)

            if (res.check == "ok") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "OTP verified successfully!",
                });
                router.push({
                    pathname: "/setpass",
                    params: {
                        email: emailText,
                    }
                })
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Toast.show({
                    type: "error",
                    text1: "Verification Failed",
                    text2: res?.message || "Invalid OTP code",
                });
            }
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: "error",
                text1: "Verification Error",
                text2: error.response?.data?.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setResending(true);
        try {
            const res = await ForgotPassCall(emailText);
            if (res?.user) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Toast.show({
                    type: "success",
                    text1: "Code Resent",
                    text2: "A new code has been sent to your email",
                });
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Toast.show({
                    type: "error",
                    text1: "Failed to Resend",
                    text2: res?.message || "Could not resend the code.",
                });
            }
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response?.data?.message || "Failed to resend. Please check your network.",
            });
        } finally {
            setResending(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-deepest-2">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Custom Navigation Header */}
                <View
                    className="absolute top-0 left-0 right-0 flex-row items-center justify-center h-20 px-5 z-10"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <TouchableOpacity
                        className="absolute left-5 justify-center items-center"
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View className="flex-1 justify-center items-center px-5">
                        <View className="w-full max-w-[380px] bg-card-dark rounded-2xl border border-border-card py-8 px-6 items-center shadow-lg">
                            <Text className="text-white text-2xl font-bold mb-2.5 text-center">Verify Account</Text>
                            <Text className="text-muted text-[15px] text-center leading-[22px] mb-7">
                                Enter the 6-digit code sent to{"\n"}
                                <Text className="text-brand font-bold">{emailText}</Text>
                            </Text>

                            {/* OTP inputs container */}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handlePress}
                                className="flex-row justify-between w-full mb-7 gap-x-2"
                            >
                                {Array.from({ length: 6 }).map((_, index) => {
                                    const char = code[index] || "";
                                    const isCurrent = index === code.length;
                                    const hasChar = char !== "";
                                    return (
                                        <View
                                            key={index}
                                            className={[
                                                "flex-1 h-14 bg-surface rounded-lg justify-center items-center border",
                                                isCurrent && isFocused ? "border-brand border-[1.5px]" : hasChar ? "border-muted-dim" : "border-border-otp",
                                            ].join(" ")}
                                        >
                                            <Text className="text-white text-2xl font-bold">{char}</Text>
                                            {isCurrent && isFocused && cursorVisible && (
                                                <View className="absolute w-0.5 h-[22px] bg-brand" />
                                            )}
                                        </View>
                                    );
                                })}
                            </TouchableOpacity>

                            {/* Hidden TextInput for OTP input */}
                            <TextInput
                                ref={inputRef}
                                className="absolute opacity-0 w-px h-px -z-10"
                                value={code}
                                onChangeText={handleCodeChange}
                                maxLength={6}
                                keyboardType="number-pad"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                textContentType="oneTimeCode"
                                autoComplete="one-time-code"
                                autoFocus
                            />

                            {/* Verify Button */}
                            <TouchableOpacity
                                className={`w-full h-[54px] rounded-xl justify-center items-center mb-6 ${code.length < 6 ? "bg-[rgba(248,198,30,0.5)]" : "bg-brand"}`}
                                onPress={handleVerify}
                                disabled={loading || code.length < 6}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#0B0E14" />
                                ) : (
                                    <Text className="text-deepest-2 text-base font-bold tracking-widest">VERIFY</Text>
                                )}
                            </TouchableOpacity>

                            {/* Resend Link */}
                            <View className="flex-row items-center justify-center">
                                <Text className="text-muted text-sm">
                                    Didn't receive the code?{" "}
                                    {resending ? (
                                        <Text className="text-muted-dim italic">Sending...</Text>
                                    ) : (
                                        <Text className="text-brand font-bold underline" onPress={handleResend}>
                                            Resend
                                        </Text>
                                    )}
                                </Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}
