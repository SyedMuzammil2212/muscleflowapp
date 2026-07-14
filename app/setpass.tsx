import SetPasswordCall from "@/api/setpasswordapi";
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
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Toast from "react-native-toast-message";


export default function SetPasswordScreen() {

    const { email } = useLocalSearchParams();
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
            const res = await SetPasswordCall(emailText, password)
            if (res?.user) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Password set successfully",
                });
                router.push("/login")


            } else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: res?.message || "Something went wrong. Please try again.",
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
                            style={styles.mainContainer}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                        >
                            <Animated.View style={[styles.container, animatedStyle]}>
                                <View style={{ rowGap: 0, alignItems: "center", width: "80%" }}>
                                    <View style={styles.iconCircle}>
                                        <LockIcon />
                                    </View>
                                    <Text style={styles.heading}>Set Your Password</Text>
                                    <Text style={styles.taglineText}>Enter a password for your accoun with the email : <Text style={{ color: "#F8C61E" }}>{emailText}</Text></Text>
                                </View>

                                <View style={{ width: "100%", alignItems: "center", justifyContent: "center", rowGap: 24, marginTop: 40 }}>

                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center" }} >
                                        <Text style={{ color: "#D2C5AC", width: "80%", fontWeight: 700, fontSize: 16 }}>PASSWORD</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter Password"
                                            placeholderTextColor="#888"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                    <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center" }} >
                                        <Text style={{ color: "#D2C5AC", width: "80%", fontWeight: 700, fontSize: 16 }}>CONFIRM PASSWORD</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm Password"
                                            placeholderTextColor="#888"
                                            value={confirm}
                                            onChangeText={setConfirm}
                                            secureTextEntry={true}
                                        />
                                    </View>


                                </View>
                                <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 0 }}>
                                    <WhiteButton onPress={handleSetPassword} text="Set Password" />
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, rowGap: 10 }}>

                                    <View style={{ width: 80, height: 2, backgroundColor: "#b2b2b2ff" }} ></View>
                                    <Text style={{ fontSize: 16, color: "#D2C5AC", fontWeight: 600 }}> Just a step away from
                                        <Text style={{ color: "#F8C61E" }}> accessing you account</Text>
                                    </Text>
                                </View>

                            </Animated.View>

                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback > :
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