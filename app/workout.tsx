import EndSession from "@/api/endSession";
import LogSet from "@/api/logSet";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@/components/userContext";

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
    // Track how many sets have been logged per exercise: exerciseId -> count
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
            // Only allow digits or empty
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

    const handleEndWorkout = () => {
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
                        await EndSession(token, sessionId);
                        router.dismissAll();
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
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* ── Top Bar ── */}
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} hitSlop={12} style={styles.menuBtn}>
                    <Ionicons name="menu" size={24} color="#95A1B5" />
                </Pressable>
                <Text style={styles.topBarTitle}>{muscleGroupLabel}</Text>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person-circle" size={34} color="#3A4559" />
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Timer Card ── */}
                <View style={styles.timerCard}>
                    <Text style={styles.timerLabel}>TIME ELAPSED</Text>
                    <Text style={styles.timerValue}>{formatElapsed(elapsedSeconds)}</Text>
                </View>

                {/* ── Exercise Card ── */}
                <View style={styles.exerciseCard}>
                    {/* Exercise header */}
                    <View style={styles.exerciseHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.exerciseName}>{currentExercise?.name}</Text>
                            <View style={styles.prBadge}>
                                <Ionicons name="trophy-outline" size={12} color="#F8C61E" />
                                <Text style={styles.prText}>
                                    {completedSetCount} set{completedSetCount !== 1 ? "s" : ""} logged
                                </Text>
                            </View>
                        </View>
                        <Pressable
                            hitSlop={10}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                // go back to exercise picker (history / swap)
                                router.back();
                            }}
                        >
                            <Ionicons name="time-outline" size={22} color="#6B7C96" />
                        </Pressable>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Column headers */}
                    <View style={styles.columnRow}>
                        <Text style={[styles.columnLabel, { width: 36 }]}>SET</Text>
                        <Text style={[styles.columnLabel, { flex: 1, textAlign: "center" }]}>REPS</Text>
                        <Text style={[styles.columnLabel, { flex: 1, textAlign: "center" }]}>WEIGHT</Text>
                        <View style={{ width: 36 }} />
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
                    <View style={styles.actionRow}>
                        <Pressable
                            onPress={handleAddSet}
                            style={styles.addSetBtn}
                        >
                            <Text style={styles.addSetText}>Add Set</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleEndExercise}
                            style={styles.endExBtn}
                        >
                            <Text style={styles.endExText}>End Exercise</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleNextExercise}
                            style={[styles.nextExBtn, !nextExercise && styles.btnDisabled]}
                            disabled={!nextExercise}
                        >
                            <Text style={styles.nextExText}>Next Exercise</Text>
                        </Pressable>
                    </View>
                </View>

                {/* ── Next exercise preview ── */}
                {nextExercise && (
                    <Pressable
                        onPress={handleNextExercise}
                        style={styles.nextPreviewCard}
                    >
                        <View>
                            <Text style={styles.nextPreviewName}>{nextExercise.name}</Text>
                            <Text style={styles.nextPreviewMuscle}>{nextExercise.muscle_group_name}</Text>
                        </View>
                        <View style={styles.nextPreviewRight}>
                            <Text style={styles.nextPreviewSets}>
                                {loggedSetCounts[nextExercise.id] ?? 0} sets logged
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#F8C61E" />
                        </View>
                    </Pressable>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* ── Bottom Floating Buttons ── */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <Pressable onPress={handleSwitchMuscle} style={styles.switchMuscleBtn}>
                    <Ionicons name="shuffle" size={18} color="#DCE3F1" />
                    <Text style={styles.switchMuscleText}>Switch Muscle</Text>
                </Pressable>

                <Pressable onPress={handleEndWorkout} style={styles.endWorkoutBtn}>
                    <Ionicons name="stop-circle-outline" size={18} color="#10141D" />
                    <Text style={styles.endWorkoutText}>End Workout</Text>
                </Pressable>
            </View>
        </View>
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
        <View style={rowStyles.row}>
            {/* Set number */}
            <Text style={rowStyles.setNum}>{index + 1}</Text>

            {/* Reps input */}
            <View style={[rowStyles.inputWrap, row.done && rowStyles.inputWrapDone]}>
                {row.done ? (
                    <Text style={rowStyles.inputDoneText}>{row.reps}</Text>
                ) : (
                    <TextInput
                        style={rowStyles.input}
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
            <View style={[rowStyles.inputWrap, row.done && rowStyles.inputWrapDone]}>
                {row.done ? (
                    <Text style={rowStyles.inputDoneText}>{row.weight}</Text>
                ) : (
                    <TextInput
                        style={rowStyles.input}
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
                style={[rowStyles.confirmBtn, row.done && rowStyles.confirmBtnDone]}
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

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#10141D",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#1C2431",
    },
    menuBtn: {
        width: 36,
        alignItems: "center",
    },
    topBarTitle: {
        color: "#F8C61E",
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: 2,
        textTransform: "uppercase",
    },
    avatarPlaceholder: {
        width: 36,
        alignItems: "center",
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 20,
    },
    // Timer card
    timerCard: {
        backgroundColor: "#19202B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2B3547",
        paddingHorizontal: 20,
        paddingVertical: 18,
        marginBottom: 16,
    },
    timerLabel: {
        color: "#6B7C96",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    timerValue: {
        color: "#F8C61E",
        fontSize: 40,
        fontWeight: "800",
        letterSpacing: 2,
        fontVariant: ["tabular-nums"],
    },
    // Exercise card
    exerciseCard: {
        backgroundColor: "#19202B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2B3547",
        borderTopWidth: 3,
        borderTopColor: "#F8C61E",
        paddingHorizontal: 16,
        paddingVertical: 18,
        rowGap: 12,
        marginBottom: 14,
    },
    exerciseHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    exerciseName: {
        color: "#DCE3F1",
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 6,
    },
    prBadge: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 5,
        backgroundColor: "#26231E",
        borderWidth: 1,
        borderColor: "#F8C61E33",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: "flex-start",
    },
    prText: {
        color: "#F8C61E",
        fontSize: 11,
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: "#2B3547",
    },
    columnRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    columnLabel: {
        color: "#6B7C96",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
    },
    // Action row
    actionRow: {
        flexDirection: "row",
        columnGap: 8,
        marginTop: 4,
    },
    addSetBtn: {
        flex: 1,
        backgroundColor: "#252C37",
        borderRadius: 10,
        paddingVertical: 11,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3A4559",
    },
    addSetText: {
        color: "#95A1B5",
        fontSize: 13,
        fontWeight: "700",
    },
    endExBtn: {
        flex: 1.3,
        backgroundColor: "#252C37",
        borderRadius: 10,
        paddingVertical: 11,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3A4559",
    },
    endExText: {
        color: "#DCE3F1",
        fontSize: 13,
        fontWeight: "700",
    },
    nextExBtn: {
        flex: 1.4,
        backgroundColor: "#2B3547",
        borderRadius: 10,
        paddingVertical: 11,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#4A5568",
    },
    nextExText: {
        color: "#DCE3F1",
        fontSize: 13,
        fontWeight: "700",
    },
    btnDisabled: {
        opacity: 0.35,
    },
    // Next exercise preview
    nextPreviewCard: {
        backgroundColor: "#19202B",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#2B3547",
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    nextPreviewName: {
        color: "#95A1B5",
        fontSize: 15,
        fontWeight: "600",
    },
    nextPreviewMuscle: {
        color: "#4A5568",
        fontSize: 12,
        fontWeight: "500",
        marginTop: 2,
    },
    nextPreviewRight: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 6,
    },
    nextPreviewSets: {
        color: "#6B7C96",
        fontSize: 12,
        fontWeight: "600",
    },
    // Bottom bar
    bottomBar: {
        flexDirection: "row",
        columnGap: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#1C2431",
        backgroundColor: "#10141D",
    },
    switchMuscleBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 8,
        backgroundColor: "#19202B",
        borderRadius: 30,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "#2B3547",
    },
    switchMuscleText: {
        color: "#DCE3F1",
        fontSize: 14,
        fontWeight: "700",
    },
    endWorkoutBtn: {
        flex: 1.6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 8,
        backgroundColor: "#F8C61E",
        borderRadius: 30,
        paddingVertical: 14,
    },
    endWorkoutText: {
        color: "#10141D",
        fontSize: 14,
        fontWeight: "800",
    },
});

const rowStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
        paddingHorizontal: 4,
    },
    setNum: {
        width: 36,
        color: "#6B7C96",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
    },
    inputWrap: {
        flex: 1,
        backgroundColor: "#252C37",
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#F8C61E55",
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    },
    inputWrapDone: {
        borderColor: "#22C55E33",
        backgroundColor: "#162118",
    },
    input: {
        color: "#DCE3F1",
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
        width: "100%",
        height: "100%",
    },
    inputDoneText: {
        color: "#22C55E",
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
    },
    confirmBtn: {
        width: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    confirmBtnDone: {
        opacity: 1,
    },
});
