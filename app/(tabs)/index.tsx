import GetAllMuscleGroups from '@/api/getAllMusclesGroups';
import GetExercisesByMuscleIds from '@/api/getExcercisesByMuscleIds';
import GetLatestSession from '@/api/getLatestSession';
import StartSession from '@/api/startSession';
import { quotes } from '@/components/internaldata';
import Loader from '@/components/loader';
import SelectMuscleSection from '@/components/selectmusclesection';
import SessionCard from '@/components/sessionCard';
import { useUser } from '@/components/userContext';
import WhiteButton from '@/components/WhiteButton';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type muscleObject = {
  id: number,
  name: string,
  user_id: any
}

type exerciseObject = {
  id: number,
  name: string,
  user_id: any,
  muscle_group_id: number,
  muscle_group_name: string
}

export default function TabOneScreen() {
  const { user, token } = useUser()
  const [tab, setTab] = useState(1)
  const [musclegroups, setMusclegroups] = useState<Array<muscleObject>>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<Array<number>>([]);
  const [exercises, setExercises] = useState<Array<exerciseObject>>([])
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null)
  const [activeMuscleFilter, setActiveMuscleFilter] = useState<number | null>(null)

  const [session, setSession] = useState({})

  const getExcercisesByMuscles = async () => {
    setLoading(true)
    try {
      const sessionRes = await StartSession(token)
      if (sessionRes?.session?.id) {
        setSessionId(sessionRes.session.id)
        setSessionStartTime(sessionRes.session.start_time)
      }

      const requestData = { musclegroupids: selectedId }
      const res = await GetExercisesByMuscleIds(token, requestData)
      if (res?.exercises) {
        setExercises(res.exercises)
        setActiveMuscleFilter(null)
      }
    } catch (e) {
      console.log(e)
    }
    setTab(3)
    setLoading(false)
  }

  const latestSession = async () => {
    const res = await GetLatestSession(token)
    const res2 = await GetAllMuscleGroups(token)
    setSession(res);
    setMusclegroups(res2?.muscleGroups)
    if (res?.session) {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (token) {
      latestSession();
    }
  }, [token]);

  function getRandomQuote(quotes: Array<String>) {
    if (!quotes || quotes.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);

  const quoteOpacity = useSharedValue(0);
  const quoteY = useSharedValue(20);

  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(30);
  const cardScale = useSharedValue(0.95);

  const playAnimations = () => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withTiming(0, { duration: 500 });

    quoteOpacity.value = withDelay(150, withTiming(1, { duration: 500 }));
    quoteY.value = withDelay(150, withTiming(0, { duration: 500 }));

    cardOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    cardY.value = withDelay(300, withTiming(0, { duration: 500 }));
    cardScale.value = withDelay(300, withTiming(1, { duration: 500 }));
  };

  useEffect(() => {
    if (!loading) {
      playAnimations();
    }
  }, [loading]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const quoteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
    transform: [{ translateY: quoteY.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: cardY.value },
      { scale: cardScale.value },
    ],
  }));

  const muscleTabsForPicker = musclegroups.filter(m => selectedId.includes(m.id));
  const filteredExercises = activeMuscleFilter
    ? exercises.filter(e => e.muscle_group_id === activeMuscleFilter)
    : exercises;

  const muscleGroupLabel = muscleTabsForPicker.map(m => m.name).join(' & ').toUpperCase() || 'WORKOUT';

  const handlePickExercise = (exercise: exerciseObject) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/workout',
      params: {
        sessionId: String(sessionId),
        exerciseJson: JSON.stringify(exercise),
        allExercisesJson: JSON.stringify(exercises),
        muscleGroupLabel,
        startTime: new Date().toISOString(),
      }
    });
  };

  return (
    <>
      {loading ?
        <Loader />
        : tab == 1 ?
          <Animated.View className="flex-1 items-center justify-center bg-dark w-full p-4" style={headerAnimatedStyle}>
            <View className="bg-dark items-center justify-center w-full pb-12">
              <Text className="text-4xl font-bold text-brand opacity-80"> Welcome Back</Text>
              <Text className="text-4xl font-bold text-brand opacity-80">{user?.username}!</Text>
              <Animated.View style={quoteAnimatedStyle}>
                <Text className="text-muted text-base font-semibold text-center mt-5">
                  "{getRandomQuote(quotes)}"
                </Text>
              </Animated.View>
            </View>
            <Animated.View className="w-full" style={cardAnimatedStyle}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  router.push({
                    pathname: "/workoutdetails",
                    params: { sessionData: JSON.stringify(session) },
                  });
                }}
                className="w-full"
              >
                <SessionCard latest={true} session={session} />
              </TouchableOpacity>
            </Animated.View>

            <WhiteButton onPress={() => { setTab(2) }} text='Start Workout' />

            <Text className="text-muted text-[15px] font-semibold text-center mt-10">SELECT MUSCLE GROUPS TO BEGIN</Text>

          </Animated.View> : tab == 2 ? <View className="flex-1 w-full">
            <SelectMuscleSection getExcercisesByMuscles={getExcercisesByMuscles} selectedId={selectedId} setSelectedId={setSelectedId} setTab={setTab} musclegroups={musclegroups} />

          </View> : tab == 3 ? (
            /* ─── EXERCISE PICKER ─── */
            <View className="flex-1 bg-darker w-full">
              {/* Header */}
              <View className="flex-row items-center justify-between px-4 pt-[60px] pb-3">
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTab(2);
                    setSessionId(null);
                  }}
                  className="w-[30px] items-center"
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="arrow-back" size={22} color="#F8C61E" />
                </Pressable>
                <Text className="text-brand text-lg font-extrabold tracking-widest text-center">{muscleGroupLabel}</Text>
                <View className="w-[30px]" />
              </View>

              <Text className="text-text-muted text-[13px] font-medium text-center mb-4">Pick an exercise to begin</Text>

              {/* Muscle filter tabs */}
              {muscleTabsForPicker.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="shrink-0 mb-3 max-h-[30px]" contentContainerStyle={{ paddingHorizontal: 16, columnGap: 10, alignItems: 'center' }}>
                  <Pressable
                    onPress={() => setActiveMuscleFilter(null)}
                    className={`px-4 py-[7px] rounded-[20px] border ${activeMuscleFilter === null ? 'bg-card-alt border-brand' : 'bg-card border-border'}`}
                  >
                    <Text className={`text-[13px] font-semibold ${activeMuscleFilter === null ? 'text-brand' : 'text-text-muted'}`}>All</Text>
                  </Pressable>
                  {muscleTabsForPicker.map(m => (
                    <Pressable
                      key={m.id}
                      onPress={() => setActiveMuscleFilter(m.id)}
                      className={`px-4 py-[7px] rounded-[20px] border ${activeMuscleFilter === m.id ? 'bg-card-alt border-brand' : 'bg-card border-border'}`}
                    >
                      <Text className={`text-[13px] font-semibold ${activeMuscleFilter === m.id ? 'text-brand' : 'text-text-muted'}`}>{m.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {/* Exercise list */}
              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40, rowGap: 12 }} showsVerticalScrollIndicator={false}>
                {filteredExercises.map((exercise, idx) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => handlePickExercise(exercise)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
                    className="bg-card rounded-[14px] border border-border border-l-[3px] border-l-brand px-4 py-3.5 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-x-3 flex-1">
                      <View className="w-8 h-8 rounded-full bg-dark border border-[#3A4559] items-center justify-center">
                        <Text className="text-brand text-[13px] font-bold">{idx + 1}</Text>
                      </View>
                      <View>
                        <Text className="text-text-primary text-base font-bold">{exercise.name}</Text>
                        <Text className="text-text-muted text-xs font-medium mt-0.5">{exercise.muscle_group_name}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#F8C61E" />
                  </Pressable>
                ))}

                {filteredExercises.length === 0 && (
                  <Text className="text-text-muted text-sm text-center mt-10">No exercises found for this muscle group.</Text>
                )}
              </ScrollView>
            </View>
          ) : <View />
      }
    </>
  );
}
