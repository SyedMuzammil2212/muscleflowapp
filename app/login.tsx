import Userlogin from "@/api/userLogin";
import Loader from "@/components/loader";
import WhiteButton from "@/components/WhiteButton";
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
import Toast from "react-native-toast-message";


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const checkLogin = async () => {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
            router.replace("/(tabs)")
        }
    }
    useEffect(() => {
        checkLogin()
    }, [])

    const handleLogin = async () => {
        if (!email || !password) {
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
            Toast.show({
                type: "success",
                text1: "Loggedin Successfully",
                text2: "Welcome Back"
            })
            router.replace("/(tabs)")
        } else {
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
                                <View style={styles.container}>
                                    <View style={{ rowGap: 0, alignItems: "center" }}>
                                        <Text style={styles.heading}>Muscleflow</Text>
                                        <View style={styles.tagLine}>
                                            <Text style={styles.taglineText}>Discipline</Text>
                                            <Text style={styles.taglineText}>Authority</Text>
                                            <Text style={styles.taglineText}>Precision</Text>
                                        </View>
                                    </View>

                                    <View style={{ width: "100%", alignItems: "center", justifyContent: "center", rowGap: 6, marginTop: 40 }}>

                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center" }} >
                                            <Text style={{ color: "#e9e9e9ff", width: "80%", fontWeight: 700, fontSize: 16 }}>Email</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Email"
                                                placeholderTextColor="#888"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>

                                        <View style={{ width: "100%", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }} >
                                            <Text style={{ color: "#e9e9e9ff", width: "80%", fontWeight: 700, fontSize: 16 }}>Password</Text>
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
                                        <Text style={{ fontSize: 16, color: "#e9e9e9ff" }}> Forgot Password</Text>
                                        <View style={{ width: 80, height: 2, backgroundColor: "#b2b2b2ff" }} ></View>
                                        <Text style={{ fontSize: 16, color: "#e9e9e9ff" }}> Don't Have an account? <Text style={{ color: "#ffffff", fontWeight: 700 }}>Sign Up</Text></Text>
                                    </View>
                                </View>
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
        color: "#ffffff",
        fontSize: 16,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    heading: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
    },

    input: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 6,
        paddingHorizontal: 15,
        color: "#fff",
        marginTop: 10,
    },
});