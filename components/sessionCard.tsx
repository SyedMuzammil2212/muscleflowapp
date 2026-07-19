import ChartIcon from "@/assets/icons/charticon";
import DumbbellIcon from "@/assets/icons/dumbellicon";
import TimerIcon from "@/assets/icons/timericon";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SessionCard({ session, latest = false }: { session: any, latest: boolean }) {

    type MuscleGroup = {
        id: number;
        name: string;
    };

    type WorkoutResponse = {
        muscleGroups: MuscleGroup[];
    };

    const getMusclesTrained = (data: WorkoutResponse): string[] => {
        return data.muscleGroups.map((group) => group.name);
    };

    const getWorkoutDuration = (
        startTime: string,
        endTime: string | null | undefined
    ): string => {
        if (!startTime) return "—";
        if (!endTime) return "Ongoing";
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const mins = Math.floor((end - start) / (1000 * 60));
        return mins < 0 ? "—" : `${mins} min`;
    };

    const getTotalSets = (data: any): number => {
        return data.muscleGroups.reduce((totalSets: any, muscleGroup: any) => {
            return (
                totalSets +
                muscleGroup.exercises.reduce((exerciseTotal: any, exercise: any) => {
                    return exerciseTotal + exercise.sets.length;
                }, 0)
            );
        }, 0);
    };

    const getTotalExercises = (muscleGroups: any[] = []): number => {
        return muscleGroups.reduce((total, muscleGroup) => {
            return total + muscleGroup.exercises.length;
        }, 0);
    };

    const muscles = getMusclesTrained(session);




    return (
        <Link href={`/workoutdetails?mockSessionData=${JSON.stringify(session)}`}>
            <View style={styles.container}  >
                {latest && <Text style={{ color: "#F8C61E", fontWeight: "600", fontSize: 12 }}> LATEST SESSION </Text>}
                <Text style={{ color: "#DCE3F1", fontWeight: "600", fontSize: 24 }}> {muscles.join(', ')} </Text>


                <View style={styles.belowSection}  >
                    <View style={styles.subSection} >
                        <TimerIcon />
                        <Text style={{ color: "#D2C5AC", fontWeight: "600", fontSize: 14 }}>  {getWorkoutDuration(session?.session?.start_time, session?.session?.end_time)}</Text>
                    </View>
                    <View style={styles.subSection} >
                        <DumbbellIcon />
                        <Text style={{ color: "#D2C5AC", fontWeight: "600", fontSize: 14 }}> {getTotalSets(session)} sets </Text>
                    </View>
                    <View style={styles.subSection} >
                        <ChartIcon />
                        <Text style={{ color: "#D2C5AC", fontWeight: "600", fontSize: 14 }}> {getTotalExercises(session?.muscleGroups)} exercises </Text>
                    </View>

                </View>

            </View>
        </Link>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#19202B",
        paddingHorizontal: 12,
        paddingVertical: 20,
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
        paddingLeft: 8,
        paddingTop: 6
    },
    subSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
    }
})