import Lightning from "@/assets/icons/lightning";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WhiteButton({ text }: { text: string }) {
    return (
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 40 }}>
            <Pressable style={({ pressed }) => [
                styles.loginButton,
                {
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.9 : 1,
                },
            ]}>
                <Lightning />
                <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>{text}</Text>

            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({

    loginButton: {
        flexDirection: "row",
        columnGap: 10,
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


});