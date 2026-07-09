import { StyleSheet, Text, View } from "react-native";

export default function SessionCard() {

    const session = {
        muscles: ["Chest,Triceps"],
        time: "45 mins",
        totalSets: 12,
        weight: "100kg"

    }
    return (
        <View style={styles.container}  >
            <Text style={{ color: "#F8C61E", fontWeight: "600", fontSize: 12 }}> Latest Session </Text>
            <Text style={{ color: "#DCE3F1", fontWeight: "600", fontSize: 22 }}> {session.muscles[0]} </Text>


            <View style={styles.belowSection}  >
                <View style={styles.subSection} >
                    <Text style={{ color: "#DCE3F1", fontWeight: "600", fontSize: 18 }}> {session.muscles[0]} </Text>
                </View>
                <View style={styles.subSection} >
                    <Text style={{ color: "#DCE3F1", fontWeight: "600", fontSize: 18 }}> {session.time} </Text>
                </View>
                <View style={styles.subSection} >
                    <Text style={{ color: "#DCE3F1", fontWeight: "600", fontSize: 18 }}> {session.totalSets} </Text>
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#19202B",
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#4E4633",
        rowGap: 8,
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    belowSection: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    subSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    }
})