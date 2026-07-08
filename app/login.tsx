import WhiteButton from "@/components/WhiteButton";
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

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
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

                    <View style={{ width: "100%", alignItems: "center", rowGap: 6, marginTop: 40 }}>


                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 40 }}>
                        <WhiteButton text="Log In" />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

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
        backgroundColor: "#000",
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
        borderRadius: 10,
        paddingHorizontal: 15,
        color: "#fff",
        marginTop: 15,
    },
});