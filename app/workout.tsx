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
    const { token } = useUser();
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

    // ─── Reset sets when exercise changes ───
    const resetForExercise = (index: number) => {
        setCurrentExerciseIndex(index);
        setSets([{ reps: "", weight: "", done: false }]);
    };

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
            return;
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
    };

    const handleAddSet = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSets((prev) => [...prev, { reps: "", weight: "", done: false }]);
    };

    const handleEndExercise = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.back();
    };

    const handleNextExercise = () => {
        if (!nextExercise) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        resetForExercise(currentExerciseIndex + 1);
    };

    const handleEndWorkout = async () => {
        Alert.alert(
            "End Workout",
            "Are you sure you want to end this workout session?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "End Workout",
                    style: "destructive",
                    onPress: async () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        setLoading(true)
                        await EndSession(token, sessionId);
                        const res = await GetSessionById(token, sessionId);
                        setLoading(false)
                        router.push({
                            pathname: "/workoutdetails",
                            params: { sessionData: JSON.stringify(res) },
                        });
                    },
                },
            ]
        );
    };

    const handleSwitchMuscle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    };

    // ─── Render ───
    return (
        <>
            {loading ? <Loader /> :
                <View className="flex-1 bg-darker" style={{ paddingTop: insets.top }}>
                    <Stack.Screen options={{ headerShown: false }} />

                    {/* ── Top Bar ── */}
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#1C2431]">
                        <Pressable onPress={() => router.back()} hitSlop={12} className="w-9 items-center">
                            <Ionicons name="menu" size={24} color="#95A1B5" />
                        </Pressable>
                        <Text className="text-brand text-[17px] font-extrabold tracking-widest uppercase">{muscleGroupLabel}</Text>
                        <View className="w-9 items-center">
                            <Ionicons name="person-circle" size={34} color="#3A4559" />
                        </View>
                    </View>

                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 16, paddingTop: 20 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* ── Timer Card ── */}
                        <View className="bg-card rounded-2xl border border-border px-5 py-[18px] mb-4">
                            <Text className="text-text-muted text-[11px] font-bold tracking-widest mb-1">TIME ELAPSED</Text>
                            <Text className="text-brand text-[40px] font-extrabold tracking-widest">{formatElapsed(elapsedSeconds)}</Text>
                        </View>

                        {/* ── Exercise Card ── */}
                        <View className="bg-card rounded-2xl border border-border border-t-[3px] border-t-brand px-4 py-[18px] gap-y-3 mb-3.5">
                            {/* Exercise header */}
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <Text className="text-text-primary text-[22px] font-extrabold mb-1.5">{currentExercise?.name}</Text>
                                    <View className="flex-row items-center gap-x-1.5 bg-card-alt border border-[#F8C61E33] rounded-[20px] px-2.5 py-1 self-start">
                                        <Ionicons name="trophy-outline" size={12} color="#F8C61E" />
                                        <Text className="text-brand text-[11px] font-bold">
                                            {completedSetCount} set{completedSetCount !== 1 ? "s" : ""} logged
                                        </Text>
                                    </View>
                                </View>
                                <Pressable
                                    hitSlop={10}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        router.back();
                                    }}
                                >
                                    <Ionicons name="time-outline" size={22} color="#6B7C96" />
                                </Pressable>
                            </View>

                            {/* Divider */}
                            <View className="h-px bg-border" />

                            {/* Column headers */}
                            <View className="flex-row items-center px-1">
                                <Text className="text-text-muted text-[11px] font-bold tracking-wide w-9">SET</Text>
                                <Text className="text-text-muted text-[11px] font-bold tracking-wide flex-1 text-center">REPS</Text>
                                <Text className="text-text-muted text-[11px] font-bold tracking-wide flex-1 text-center">WEIGHT</Text>
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

                            {/* Action row */}
                            <View className="flex-row gap-x-2 mt-1">
                                <Pressable
                                    onPress={handleAddSet}
                                    className="flex-1 bg-dark rounded-xl py-[11px] items-center border border-[#3A4559]"
                                >
                                    <Text className="text-text-subtle text-[13px] font-bold">Add Set</Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleEndExercise}
                                    className="flex-[1.3] bg-dark rounded-xl py-[11px] items-center border border-[#3A4559]"
                                >
                                    <Text className="text-text-primary text-[13px] font-bold">End Exercise</Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleNextExercise}
                                    className={`flex-[1.4] bg-border rounded-xl py-[11px] items-center border border-[#4A5568] ${!nextExercise ? 'opacity-35' : ''}`}
                                    disabled={!nextExercise}
                                >
                                    <Text className="text-text-primary text-[13px] font-bold">Next Exercise</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* ── Next exercise preview ── */}
                        {nextExercise && (
                            <Pressable
                                onPress={handleNextExercise}
                                className="bg-card rounded-[14px] border border-border px-4 py-3.5 flex-row items-center justify-between"
                            >
                                <View>
                                    <Text className="text-text-subtle text-[15px] font-semibold">{nextExercise.name}</Text>
                                    <Text className="text-[#4A5568] text-xs font-medium mt-0.5">{nextExercise.muscle_group_name}</Text>
                                </View>
                                <View className="flex-row items-center gap-x-1.5">
                                    <Text className="text-text-muted text-xs font-semibold">
                                        {loggedSetCounts[nextExercise.id] ?? 0} sets logged
                                    </Text>
                                    <Ionicons name="chevron-forward" size={16} color="#F8C61E" />
                                </View>
                            </Pressable>
                        )}

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
