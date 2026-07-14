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
    StyleSheet,
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

        // Light haptic feedback on typing
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

            // Support signup verification flow (if password parameter is present)
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
            <View style={styles.mainContainer}>
                <Stack.Screen options={{ headerShown: false }} />

                {/* Custom Navigation Header */}
                <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity
                        style={styles.backButton}
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
                    style={styles.keyboardView}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View style={styles.innerContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Verify Account</Text>
                            <Text style={styles.cardSubtitle}>
                                Enter the 6-digit code sent to{"\n"}
                                <Text style={styles.emailHighlight}>{emailText}</Text>
                            </Text>

                            {/* OTP inputs container */}
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handlePress}
                                style={styles.otpInputContainer}
                            >
                                {Array.from({ length: 6 }).map((_, index) => {
                                    const char = code[index] || "";
                                    const isCurrent = index === code.length;
                                    const hasChar = char !== "";
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.otpBox,
                                                isCurrent && isFocused && styles.otpBoxFocused,
                                                hasChar && styles.otpBoxFilled,
                                            ]}
                                        >
                                            <Text style={styles.otpText}>{char}</Text>
                                            {isCurrent && isFocused && cursorVisible && (
                                                <View style={styles.cursor} />
                                            )}
                                        </View>
                                    );
                                })}
                            </TouchableOpacity>

                            {/* Hidden TextInput for OTP input */}
                            <TextInput
                                ref={inputRef}
                                style={styles.hiddenInput}
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
                                style={[styles.verifyButton, code.length < 6 && styles.verifyButtonDisabled]}
                                onPress={handleVerify}
                                disabled={loading || code.length < 6}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#0B0E14" />
                                ) : (
                                    <Text style={styles.verifyButtonText}>VERIFY</Text>
                                )}
                            </TouchableOpacity>

                            {/* Resend Link */}
                            <View style={styles.resendContainer}>
                                <Text style={styles.resendText}>
                                    Didn't receive the code?{" "}
                                    {resending ? (
                                        <Text style={styles.resendingText}>Sending...</Text>
                                    ) : (
                                        <Text style={styles.resendLink} onPress={handleResend}>
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

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#0B0E14",
    },
    keyboardView: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 80,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        position: "absolute",
        left: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        color: "#F8C61E",
        fontSize: 22,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    card: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: "#151B26",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#232E3F",
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    cardTitle: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    cardSubtitle: {
        color: "#D2C5AC",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
    },
    emailHighlight: {
        color: "#F8C61E",
        fontWeight: "bold",
    },
    otpInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 30,
        columnGap: 8,
    },
    otpBox: {
        flex: 1,
        height: 56,
        backgroundColor: "#1C2534",
        borderWidth: 1,
        borderColor: "#3D372C",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    otpBoxFocused: {
        borderColor: "#F8C61E",
        borderWidth: 1.5,
    },
    otpBoxFilled: {
        borderColor: "#9A9079",
    },
    otpText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
    },
    cursor: {
        position: "absolute",
        width: 2,
        height: 22,
        backgroundColor: "#F8C61E",
    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
        width: 1,
        height: 1,
        zIndex: -1,
    },
    verifyButton: {
        width: "100%",
        height: 54,
        backgroundColor: "#F8C61E",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#F8C61E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 25,
    },
    verifyButtonDisabled: {
        backgroundColor: "rgba(248, 198, 30, 0.5)",
    },
    verifyButtonText: {
        color: "#0B0E14",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    resendContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    resendText: {
        color: "#D2C5AC",
        fontSize: 14,
    },
    resendLink: {
        color: "#F8C61E",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    resendingText: {
        color: "#9A9079",
        fontStyle: "italic",
    },
});
