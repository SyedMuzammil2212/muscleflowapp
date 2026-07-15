import DumbbellIcon from "@/assets/icons/dumbellicon";
import TimerIcon from "@/assets/icons/timericon";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";

// Custom Inline SVG Calendar Icon
function CalendarIcon({ width = 14, height = 14, color = "#F8C61E" }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

const { width } = Dimensions.get("window");

interface WorkoutSet {
  set: number;
  weight: string | number;
  reps: number;
}

interface WorkoutExercise {
  id: string | number;
  name: string;
  sets?: WorkoutSet[];
}

interface MuscleGroup {
  id: string | number;
  name: string;
  exercises?: WorkoutExercise[];
}

interface WorkoutSession {
  start_time?: string;
  end_time?: string;
  date_completed?: string;
}

interface SessionData {
  session?: WorkoutSession;
  muscleGroups?: MuscleGroup[];
}

export default function WorkoutDetails() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Parse sessionData from route params if passed
  let sessionData: SessionData | null = null;
  const sessionDataParam = params.sessionData || params.mockSessionData;

  if (sessionDataParam) {
    try {
      const jsonStr = Array.isArray(sessionDataParam) ? sessionDataParam[0] : sessionDataParam;
      sessionData = JSON.parse(jsonStr) as SessionData;
    } catch (error) {
      console.warn("Failed to parse sessionData parameter.", error);
    }
  }

  const session = sessionData?.session;
  const muscleGroups: MuscleGroup[] = sessionData?.muscleGroups || [];

  // 1. Calculate workout duration in minutes
  const getWorkoutDuration = (): number => {
    if (!session?.start_time || !session?.end_time) return 0;
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    const diffInMs = end - start;
    return Math.floor(diffInMs / (1000 * 60));
  };

  // 2. Calculate total volume (sum of weight * reps for all sets)
  const getTotalVolume = (): string => {
    let volume = 0;
    muscleGroups.forEach((group) => {
      group.exercises?.forEach((exercise) => {
        exercise.sets?.forEach((set) => {
          const w = typeof set.weight === "number" ? set.weight : parseFloat(set.weight) || 0;
          volume += w * set.reps;
        });
      });
    });
    return volume.toLocaleString();
  };

  // 3. Format Completed Date
  const getFormattedDate = (): string => {
    const targetDate = session?.date_completed || session?.start_time;
    if (!targetDate) return "";
    return new Date(targetDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // 4. Generate Heading (e.g. "Chest & Biceps")
  const getMusclesTrained = (): string => {
    if (muscleGroups.length === 0) return "Workout Details";
    return muscleGroups.map((group) => group.name).join(" & ");
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* Hide the default screen header to use custom styling */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#F8C61E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Heading */}
        <View style={styles.titleSection}>
          <Text style={styles.workoutName}>{getMusclesTrained()}</Text>
          <View style={styles.dateBadge}>
            <CalendarIcon width={14} height={14} color="#F8C61E" />
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
        </View>

        {/* Duration & Volume Side-by-Side Cards */}
        <View style={styles.metricsRow}>
          {/* Duration Card */}
          <View style={styles.metricCard}>
            <TimerIcon width={22} height={22} color="#F8C61E" />
            <Text style={styles.metricLabel}>DURATION</Text>
            <Text style={styles.metricValue}>{getWorkoutDuration()} min</Text>
          </View>

          {/* Volume Card */}
          <View style={styles.metricCard}>
            <DumbbellIcon width={22} height={22} color="#F8C61E" />
            <Text style={styles.metricLabel}>VOLUME</Text>
            <Text style={styles.metricValue}>{getTotalVolume()} Kg</Text>
          </View>
        </View>

        {/* Muscle Groups Sections */}
        {muscleGroups.map((muscleGroup) => (
          <View key={muscleGroup.id} style={styles.muscleGroupContainer}>
            {/* Muscle Group Title & Divider line */}
            <View style={styles.muscleGroupHeaderRow}>
              <Text style={styles.muscleGroupTitle}>{muscleGroup.name.toUpperCase()}</Text>
              <View style={styles.muscleGroupLine} />
            </View>

            {/* Exercises List */}
            {muscleGroup.exercises?.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                {/* Exercise Header Area */}
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.setsCountBadge}>
                    <Text style={styles.setsCountText}>
                      {exercise.sets?.length} SETS
                    </Text>
                  </View>
                </View>

                {/* Sets Grid */}
                <View style={styles.setsGrid}>
                  {exercise.sets?.map((set) => (
                    <View key={set.set} style={styles.setCard}>
                      <Text style={styles.setNumberLabel}>SET</Text>
                      <Text style={styles.setNumberValue}>{set.set}</Text>

                      <View style={styles.setDetailsRow}>
                        <View style={styles.setDetailsColumn}>
                          <Text style={styles.setSubLabel}>Kg</Text>
                          <Text style={styles.setSubValue}>{set.weight}</Text>
                        </View>
                        <View style={styles.setDetailsColumn}>
                          <Text style={styles.setSubLabel}>reps</Text>
                          <Text style={styles.setSubValue}>{set.reps}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#10141D", // Dark background theme
  },
  headerBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1C2431",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    color: "#F8C61E",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  titleSection: {
    alignItems: "center",
    marginVertical: 12,
    rowGap: 8,
  },
  workoutName: {
    color: "#DCE3F1",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2431",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    columnGap: 6,
    borderWidth: 1,
    borderColor: "#2B3547",
  },
  dateText: {
    color: "#95A1B5",
    fontSize: 13,
    fontWeight: "600",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
    marginVertical: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#19202B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2B3547",
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    rowGap: 6,
  },
  metricLabel: {
    color: "#95A1B5",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  metricValue: {
    color: "#DCE3F1",
    fontSize: 20,
    fontWeight: "800",
  },
  muscleGroupContainer: {
    marginTop: 20,
    rowGap: 14,
  },
  muscleGroupHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  muscleGroupTitle: {
    color: "#F8C61E",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  muscleGroupLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2B3547",
  },
  exerciseCard: {
    backgroundColor: "#19202B",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2B3547",
    borderLeftWidth: 4,
    borderLeftColor: "#F8C61E",
    padding: 16,
    rowGap: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseName: {
    color: "#DCE3F1",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  setsCountBadge: {
    backgroundColor: "#26231E",
    borderColor: "#F8C61E",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  setsCountText: {
    color: "#F8C61E",
    fontSize: 10,
    fontWeight: "800",
  },
  setsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  setCard: {
    width: (width - 32 - 32 - 30) / 2, // calculate exact width to fit 2 columns nicely
    backgroundColor: "#252C37",
    borderColor: "#2B3547",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    rowGap: 8,
  },
  setNumberLabel: {
    color: "#95A1B5",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  setNumberValue: {
    color: "#DCE3F1",
    fontSize: 18,
    fontWeight: "800",
    marginTop: -4,
  },
  setDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#333C4E",
    paddingTop: 8,
  },
  setDetailsColumn: {
    alignItems: "center",
  },
  setSubLabel: {
    color: "#95A1B5",
    fontSize: 9,
    fontWeight: "600",
  },
  setSubValue: {
    color: "#DCE3F1",
    fontSize: 14,
    fontWeight: "700",
  },
});
