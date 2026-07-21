import DumbbellIcon from "@/assets/icons/dumbellicon";
import TimerIcon from "@/assets/icons/timericon";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
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

  const getWorkoutDuration = (): number => {
    if (!session?.start_time || !session?.end_time) return 0;
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    const diffInMs = end - start;
    return Math.floor(diffInMs / (1000 * 60));
  };

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

  const getFormattedDate = (): string => {
    const targetDate = session?.date_completed || session?.start_time;
    if (!targetDate) return "";
    return new Date(targetDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMusclesTrained = (): string => {
    if (muscleGroups.length === 0) return "Workout Details";
    return muscleGroups.map((group) => group.name).join(" & ");
  };

  return (
    <View className="flex-1 bg-darker" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header Bar */}
      <View className="h-14 flex-row items-center justify-between px-4 border-b border-[#1C2431]">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="w-10 h-10 justify-center items-start"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#F8C61E" />
        </TouchableOpacity>
        <Text className="text-brand text-xl font-bold text-center">Workout Details</Text>
        <View className="w-10" />
      </View>

      {/* Main Content Area */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Heading */}
        <View className="items-center my-3 gap-y-2">
          <Text className="text-text-primary text-[28px] font-extrabold text-center">{getMusclesTrained()}</Text>
          <View className="flex-row items-center bg-surface px-3 py-1.5 rounded-[20px] gap-x-1.5 border border-border">
            <CalendarIcon width={14} height={14} color="#F8C61E" />
            <Text className="text-text-subtle text-[13px] font-semibold">{getFormattedDate()}</Text>
          </View>
        </View>

        {/* Duration & Volume Side-by-Side Cards */}
        <View className="flex-row justify-between gap-x-3 my-4">
          {/* Duration Card */}
          <View className="flex-1 bg-card rounded-2xl border border-border py-4 px-2 items-center gap-y-1.5">
            <TimerIcon width={22} height={22} color="#F8C61E" />
            <Text className="text-text-subtle text-[11px] font-bold tracking-wide">DURATION</Text>
            <Text className="text-text-primary text-xl font-extrabold">{getWorkoutDuration()} min</Text>
          </View>

          {/* Volume Card */}
          <View className="flex-1 bg-card rounded-2xl border border-border py-4 px-2 items-center gap-y-1.5">
            <DumbbellIcon width={22} height={22} color="#F8C61E" />
            <Text className="text-text-subtle text-[11px] font-bold tracking-wide">VOLUME</Text>
            <Text className="text-text-primary text-xl font-extrabold">{getTotalVolume()} Kg</Text>
          </View>
        </View>

        {/* Muscle Groups Sections */}
        {muscleGroups.map((muscleGroup) => (
          <View key={muscleGroup.id} className="mt-5 gap-y-3.5">
            {/* Muscle Group Title & Divider line */}
            <View className="flex-row items-center gap-x-2">
              <Text className="text-brand text-base font-extrabold tracking-wide">{muscleGroup.name.toUpperCase()}</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Exercises List */}
            {muscleGroup.exercises?.map((exercise) => (
              <View key={exercise.id} className="bg-card rounded-2xl border border-border border-l-[4px] border-l-brand p-4 gap-y-4">
                {/* Exercise Header Area */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-text-primary text-lg font-bold flex-1 mr-2">{exercise.name}</Text>
                  <View className="bg-card-alt border border-brand rounded px-2 py-1">
                    <Text className="text-brand text-[10px] font-extrabold">
                      {exercise.sets?.length} SETS
                    </Text>
                  </View>
                </View>

                {/* Sets Grid */}
                <View className="flex-row flex-wrap gap-3">
                  {exercise.sets?.map((set) => (
                    <View
                      key={set.set}
                      className="bg-dark border border-border rounded-xl py-3 px-2 items-center gap-y-2"
                      style={{ width: (width - 32 - 32 - 30) / 2 }}
                    >
                      <Text className="text-text-subtle text-[9px] font-bold tracking-wide">SET</Text>
                      <Text className="text-text-primary text-lg font-extrabold -mt-1">{set.set}</Text>

                      <View className="flex-row justify-around w-full border-t border-[#333C4E] pt-2">
                        <View className="items-center">
                          <Text className="text-text-subtle text-[9px] font-semibold">Kg</Text>
                          <Text className="text-text-primary text-sm font-bold">{set.weight}</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-text-subtle text-[9px] font-semibold">reps</Text>
                          <Text className="text-text-primary text-sm font-bold">{set.reps}</Text>
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
