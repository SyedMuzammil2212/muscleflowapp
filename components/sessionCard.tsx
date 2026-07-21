import ChartIcon from "@/assets/icons/charticon";
import DumbbellIcon from "@/assets/icons/dumbellicon";
import TimerIcon from "@/assets/icons/timericon";
import formatSessionDate from "@/utils/formatSessionDate";
import { Link } from "expo-router";
import { Text, View } from "react-native";

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
            <View className="w-full bg-card px-3 py-5 rounded-2xl border border-border-accent gap-y-2 items-start justify-start">
                {latest ? <Text className="text-brand font-semibold text-xs"> LATEST SESSION </Text>
                    : <Text className="text-brand font-semibold text-xs"> {formatSessionDate(session?.session?.start_time)}</Text>
                }
                <Text className="text-text-primary font-semibold text-2xl"> {muscles.join(', ')} </Text>

                <View className="w-full flex-row justify-between items-center pl-2 pt-1.5">
                    <View className="flex-row items-center justify-center gap-x-0.5">
                        <TimerIcon />
                        <Text className="text-muted font-semibold text-sm">  {getWorkoutDuration(session?.session?.start_time, session?.session?.end_time)}</Text>
                    </View>
                    <View className="flex-row items-center justify-center gap-x-0.5">
                        <DumbbellIcon />
                        <Text className="text-muted font-semibold text-sm"> {getTotalSets(session)} sets </Text>
                    </View>
                    <View className="flex-row items-center justify-center gap-x-0.5">
                        <ChartIcon />
                        <Text className="text-muted font-semibold text-sm"> {getTotalExercises(session?.muscleGroups)} exercises </Text>
                    </View>
                </View>
            </View>
        </Link>
    )
}