import EndSession from "@/api/endSession";
import GetSessionById from "@/api/getSessionById";
import LogSet from "@/api/logSet";
import Loader from "@/components/loader";
import { useUser } from "@/components/userContext";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ───────────────────────────────────────────────────────────────────
type ExerciseObject = {
    id: number;
    name: string;
    muscle_group_id: number;
    muscle_group_name: string;
};

type SetRow = {
    reps: string;
    weight: string;
    done: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatElapsed(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function WorkoutScreen() {
    const insets = useSafeAreaInsets();
    const { token, unit } = useUser();
    const params = useLocalSearchParams<{
        sessionId: string;
        exerciseJson: string;
        allExercisesJson: string;
        muscleGroupLabel: string;
        startTime: string;
    }>();

    const [session, setSession] = useState()
    const [loading, setLoading] = useState<boolean>(false)

    // Parse params
    const sessionId = Number(params.sessionId);
    const allExercises: ExerciseObject[] = params.allExercisesJson
        ? JSON.parse(params.allExercisesJson)
        : [];
    const initialExercise: ExerciseObject = params.exerciseJson
        ? JSON.parse(params.exerciseJson)
        : allExercises[0];
    const muscleGroupLabel = params.muscleGroupLabel ?? "WORKOUT";
    const startTime = params.startTime ?? new Date().toISOString();

    // ─── State ───
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(
        () => allExercises.findIndex((e) => e.id === initialExercise?.id) ?? 0
    );
    const [sets, setSets] = useState<SetRow[]>([
        { reps: "", weight: "", done: false },
    ]);
    const [loggedSetCounts, setLoggedSetCounts] = useState<Record<number, number>>({});
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
        const diff = Date.now() - new Date(startTime).getTime();
        return Math.max(0, Math.floor(diff / 1000));
    });
    const [loggingIndex, setLoggingIndex] = useState<number | null>(null);

    const currentExercise = allExercises[currentExerciseIndex] ?? initialExercise;
    const nextExercise = allExercises[currentExerciseIndex + 1] ?? null;
    const completedSetCount = sets.filter((s) => s.done).length;

    // ─── Timer ───
    useEffect(() => {
        const interval = setInterval(() => {
            const diff = Date.now() - new Date(startTime).getTime();
            setElapsedSeconds(Math.max(0, Math.floor(diff / 1000)));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // ─── Handlers ───
    const updateSet = (index: number, field: "reps" | "weight", value: string) => {
        setSets((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value.replace(/[^0-9.]/g, "") };
            return next;
        });
    };

    const handleConfirmSet = async (index: number) => {
        const row = sets[index];
        const repsNum = parseFloat(row.reps);
        const weightNum = parseFloat(row.weight);

        if (!row.reps || !row.weight || isNaN(repsNum) || isNaN(weightNum)) {
            Alert.alert("Missing data", "Please enter both reps and weight before confirming.");
            return false;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setLoggingIndex(index);

        const setNumber = index + 1;
        await LogSet(token, {
            log_session_id: sessionId,
            exercise_id: currentExercise.id,
            muscle_group_id: currentExercise.muscle_group_id,
            set_number: setNumber,
            weight: weightNum,
            reps: repsNum,
        });

        setLoggedSetCounts((prev) => ({
            ...prev,
            [currentExercise.id]: (prev[currentExercise.id] ?? 0) + 1,
        }));

        setSets((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], done: true };
            return next;
        });
        setLoggingIndex(null);
        return true;
    };

    const handleAddSet = async () => {
        const lastIndex = sets.length - 1;
        const lastSet = sets[lastIndex];

        if (lastSet && !lastSet.done) {
            const success = await handleConfirmSet(lastIndex);
            if (!success) return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const prevWeight = lastSet ? lastSet.weight : "";
        setSets((prev) => [...prev, { reps: "", weight: prevWeight, done: false }]);
    };

    const handleEndExercise = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.back();
    };

    const handleEndWorkout = async () => {
        Alert.alert(
            "End Workout?",
            "Are you sure you want to finish this session?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "End Session",
                    style: "destructive",
                    onPress: async () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        if (sessionId) {
                            setLoading(true);
                            await EndSession(token, sessionId);
                            const res = await GetSessionById(token, sessionId);
                            setLoading(false);
                            if (res) {
                                router.replace({
                                    pathname: "/workoutdetails",
                                    params: {
                                        mockSessionData: JSON.stringify(res),
                                        returnTo: "home",
                                    },
                                });
                            } else {
                                router.replace("/(tabs)");
                            }
                        } else {
                            router.replace("/(tabs)");
                        }
                    },
                },
            ]
        );
    };

    const handleSwitchMuscle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.back();
    };

    // ─── Render ───
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            {loading ? <Loader /> :
                <View className="flex-1 bg-darker" style={{ paddingTop: insets.top }}>
                    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                        {/* ── Top Bar ── */}
                        <View className="flex-row justify-between items-center py-4">
                            <Pressable
                                onPress={() => router.back()}
                                className="w-10 h-10 rounded-full bg-dark border border-border items-center justify-center"
                            >
                                <Ionicons name="arrow-back" size={20} color="#DCE3F1" />
                            </Pressable>

                            {/* Timer Pill */}
                            <View className="flex-row items-center gap-x-1.5 bg-card border border-border px-4 py-1.5 rounded-full">
                                <View className="w-2 h-2 rounded-full bg-[#22C55E]" />
                                <Text className="text-brand text-xs font-mono font-extrabold tracking-wider">
                                    {formatElapsed(elapsedSeconds)}
                                </Text>
                            </View>
                        </View>

                        {/* ── Exercise Card ── */}
                        <View className="bg-card rounded-2xl border border-border p-4 gap-y-4 mb-4">
                            {/* Exercise Header */}
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1 pr-2">
                                    <Text className="text-brand text-[11px] font-extrabold tracking-wider uppercase">
                                        {muscleGroupLabel}
                                    </Text>
                                    <Text className="text-text-primary text-xl font-extrabold mt-0.5">
                                        {currentExercise?.name}
                                    </Text>
                                    <View className="flex-row items-center gap-x-1 mt-1">
                                        <Ionicons name="trophy-outline" size={12} color="#F8C61E" />
                                        <Text className="text-brand text-[11px] font-bold">
                                            {completedSetCount} set{completedSetCount !== 1 ? "s" : ""} logged
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Column headers */}
                            <View className="flex-row items-center px-1">
                                <Text className="text-text-muted text-[11px] font-bold tracking-wide w-9">SET</Text>
                                <Text className="text-text-muted text-[11px] font-bold tracking-wide flex-1 text-center">REPS</Text>
                                <Text className="text-text-muted text-[11px] font-bold tracking-wide flex-1 text-center">WEIGHT ({unit ? unit.toUpperCase() : 'KG'})</Text>
                                <View className="w-9" />
                            </View>

                            {/* Set rows */}
                            {sets.map((row, idx) => (
                                <SetRowItem
                                    key={idx}
                                    index={idx}
                                    row={row}
                                    isLogging={loggingIndex === idx}
                                    onChangeReps={(v) => updateSet(idx, "reps", v)}
                                    onChangeWeight={(v) => updateSet(idx, "weight", v)}
                                    onConfirm={() => handleConfirmSet(idx)}
                                />
                            ))}

                            {/* ── Set action buttons inside card ── */}
                            <View className="flex-row gap-x-2 pt-2">
                                <Pressable
                                    onPress={handleAddSet}
                                    className="flex-1 bg-brand/10 rounded-xl py-3 items-center justify-center border border-brand/40 flex-row gap-x-1.5"
                                >
                                    <Ionicons name="add" size={18} color="#F8C61E" />
                                    <Text className="text-brand text-[13px] font-bold">Add Set</Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleEndExercise}
                                    className="flex-1 bg-dark rounded-xl py-3 items-center justify-center border border-[#3A4559]"
                                >
                                    <Text className="text-text-primary text-[13px] font-bold">Finish Exercise</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View className="h-[100px]" />
                    </ScrollView>

                    {/* ── Bottom Floating Buttons ── */}
                    <View
                        className="flex-row gap-x-3 px-4 pt-3 border-t border-[#1C2431] bg-darker"
                        style={{ paddingBottom: insets.bottom + 12 }}
                    >
                        <Pressable onPress={handleSwitchMuscle} className="flex-1 flex-row items-center justify-center gap-x-2 bg-card rounded-[30px] py-3.5 border border-border">
                            <Ionicons name="shuffle" size={18} color="#DCE3F1" />
                            <Text className="text-text-primary text-sm font-bold">Switch Muscle</Text>
                        </Pressable>

                        <Pressable onPress={handleEndWorkout} className="flex-[1.6] flex-row items-center justify-center gap-x-2 bg-brand rounded-[30px] py-3.5">
                            <Ionicons name="stop-circle-outline" size={18} color="#10141D" />
                            <Text className="text-darker text-sm font-extrabold">End Workout</Text>
                        </Pressable>
                    </View>
                </View>}
        </>
    );
}

// ─── Set Row Sub-component ────────────────────────────────────────────────────
type SetRowProps = {
    index: number;
    row: SetRow;
    isLogging: boolean;
    onChangeReps: (v: string) => void;
    onChangeWeight: (v: string) => void;
    onConfirm: () => void;
};

function SetRowItem({ index, row, isLogging, onChangeReps, onChangeWeight, onConfirm }: SetRowProps) {
    return (
        <View className="flex-row items-center gap-x-2 px-1">
            {/* Set number */}
            <Text className="w-9 text-text-muted text-[15px] font-bold text-center">{index + 1}</Text>

            {/* Reps input */}
            <View className={`flex-1 rounded-xl border-[1.5px] h-[46px] items-center justify-center ${row.done ? 'border-[#22C55E33] bg-[#162118]' : 'border-[#F8C61E55] bg-dark'}`}>
                {row.done ? (
                    <Text className="text-[#22C55E] text-[17px] font-bold text-center">{row.reps}</Text>
                ) : (
                    <TextInput
                        className="text-text-primary text-[17px] font-bold text-center w-full h-full"
                        value={row.reps}
                        onChangeText={onChangeReps}
                        keyboardType="numeric"
                        placeholder="—"
                        placeholderTextColor="#4A5568"
                        maxLength={4}
                        editable={!row.done}
                    />
                )}
            </View>

            {/* Weight input */}
            <View className={`flex-1 rounded-xl border-[1.5px] h-[46px] items-center justify-center ${row.done ? 'border-[#22C55E33] bg-[#162118]' : 'border-[#F8C61E55] bg-dark'}`}>
                {row.done ? (
                    <Text className="text-[#22C55E] text-[17px] font-bold text-center">{row.weight}</Text>
                ) : (
                    <TextInput
                        className="text-text-primary text-[17px] font-bold text-center w-full h-full"
                        value={row.weight}
                        onChangeText={onChangeWeight}
                        keyboardType="numeric"
                        placeholder="—"
                        placeholderTextColor="#4A5568"
                        maxLength={6}
                        editable={!row.done}
                    />
                )}
            </View>

            {/* Confirm / check button */}
            <Pressable
                onPress={row.done ? undefined : onConfirm}
                className="w-9 items-center justify-center"
                disabled={row.done || isLogging}
            >
                {isLogging ? (
                    <ActivityIndicator size={24} color="#F8C61E" />
                ) : (
                    <Ionicons
                        name={row.done ? "checkmark-circle" : "add-circle-outline"}
                        size={28}
                        color={row.done ? "#22C55E" : "#F8C61E"}
                    />
                )}
            </Pressable>
        </View>
    );
}
