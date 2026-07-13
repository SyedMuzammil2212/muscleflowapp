import ForgotPassCall from "@/api/forgotPasswordCall";
import ForgotPasswordIcon from "@/assets/icons/forgotPasswordIcon";
import Loader from "@/components/loader";
import WhiteButton from "@/components/WhiteButton";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Toast from "react-native-toast-message";


export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

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
                            style={styles.mainContainer}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            <View style={styles.container}>
                                <View style={{ rowGap: 0, alignItems: "center", width: "80%" }}>
                                    <View style={styles.iconCircle}>
                                        <ForgotPasswordIcon />
                                    </View>
                                    <Text style={styles.heading}>Forgot Password?</Text>
                                    <Text style={styles.taglineText}>Enter your email address and we will send you a 6 digit verification code to you email</Text>
                                </View>

                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center", rowGap: 6, marginTop: 40 }}>

                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center" }} >
                                        <Text style={{ color: "#D2C5AC", width: "80%", fontWeight: 700, fontSize: 16 }}>EMAIL</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Email"
                                            placeholderTextColor="#888"
                                            value={email}
                                            onChangeText={setEmail}
                                        />
                                    </View>


                                </View>
                                <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 0 }}>
                                    <WhiteButton onPress={handleLogin} text="Send Code" />
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, rowGap: 10 }}>

                                    <View style={{ width: 80, height: 2, backgroundColor: "#b2b2b2ff" }} ></View>
                                    <Text style={{ fontSize: 16, color: "#D2C5AC", fontWeight: 600 }}> Already have an account? <Text onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.replace("/login"); }} style={{ color: "#F8C61E", fontWeight: 800 }}>Login</Text></Text>
                                </View>

                            </View>

                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback> :
                    <Loader />
            }
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    iconCircle: { width: 96, height: 96, backgroundColor: "#232A35", borderRadius: 50, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#9A9079", marginBottom: 50, marginTop: 50 },

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
        fontSize: 16,
        textAlign: "center"
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "rgba(13, 20, 30, 1)",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    heading: {
        color: "#DCE3F1",
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
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