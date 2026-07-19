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
  StyleSheet,
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
      // 1. Start the workout session
      const sessionRes = await StartSession(token)
      if (sessionRes?.session?.id) {
        setSessionId(sessionRes.session.id)
        setSessionStartTime(sessionRes.session.start_time)
      }

      // 2. Fetch exercises for selected muscles
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

    quoteOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 500 })
    );
    quoteY.value = withDelay(
      150,
      withTiming(0, { duration: 500 })
    );

    cardOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 500 })
    );

    cardY.value = withDelay(
      300,
      withTiming(0, { duration: 500 })
    );

    cardScale.value = withDelay(
      300,
      withTiming(1, { duration: 500 })
    );
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

  // Derive unique muscle groups that have exercises
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
          <Animated.View style={[styles.container, headerAnimatedStyle]}>
            <View style={styles.upperContainer}>
              <Text style={styles.title}> Welcome Back</Text>
              <Text style={styles.title}>{user?.username}!</Text>
              <Animated.View style={quoteAnimatedStyle}>
                <Text style={{ color: "#D2C5AC", fontSize: 16, fontWeight: 600, textAlign: "center", marginTop: 20 }}>
                  "{getRandomQuote(quotes)}"
                </Text>
              </Animated.View>
            </View>
            <Animated.View style={cardAnimatedStyle}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  router.push({
                    pathname: "/workoutdetails",
                    params: { sessionData: JSON.stringify(session) },
                  });
                }}
                style={{ width: "100%" }}
              >
                <SessionCard latest={true} session={session} />
              </TouchableOpacity>
            </Animated.View>

            <WhiteButton onPress={() => { setTab(2) }} text='Start Workout' />

            <Text style={styles.selectMuscle}>SELECT MUSCLE GROUPS TO BEGIN</Text>

          </Animated.View> : tab == 2 ? <View style={{ flex: 1, width: "100%" }}>
            <SelectMuscleSection getExcercisesByMuscles={getExcercisesByMuscles} selectedId={selectedId} setSelectedId={setSelectedId} setTab={setTab} musclegroups={musclegroups} />

          </View> : tab == 3 ? (
            /* ─── EXERCISE PICKER ─── */
            <View style={pickerStyles.container}>
              {/* Header */}
              <View style={pickerStyles.header}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTab(2);
                    setSessionId(null);
                  }}
                  style={pickerStyles.backBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="arrow-back" size={22} color="#F8C61E" />
                </Pressable>
                <Text style={pickerStyles.headerTitle}>{muscleGroupLabel}</Text>
                <View style={{ width: 30 }} />
              </View>

              <Text style={pickerStyles.subTitle}>Pick an exercise to begin</Text>

              {/* Muscle filter tabs */}
              {muscleTabsForPicker.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={pickerStyles.tabsRow} contentContainerStyle={{ paddingHorizontal: 16, columnGap: 10, alignItems: 'center' }}>
                  <Pressable
                    onPress={() => setActiveMuscleFilter(null)}
                    style={[pickerStyles.tab, activeMuscleFilter === null && pickerStyles.tabActive]}
                  >
                    <Text style={[pickerStyles.tabText, activeMuscleFilter === null && pickerStyles.tabTextActive]}>All</Text>
                  </Pressable>
                  {muscleTabsForPicker.map(m => (
                    <Pressable
                      key={m.id}
                      onPress={() => setActiveMuscleFilter(m.id)}
                      style={[pickerStyles.tab, activeMuscleFilter === m.id && pickerStyles.tabActive]}
                    >
                      <Text style={[pickerStyles.tabText, activeMuscleFilter === m.id && pickerStyles.tabTextActive]}>{m.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {/* Exercise list */}
              <ScrollView style={{ flex: 1 }} contentContainerStyle={pickerStyles.list} showsVerticalScrollIndicator={false}>
                {filteredExercises.map((exercise, idx) => (
                  <Pressable
                    key={exercise.id}
                    onPress={() => handlePickExercise(exercise)}
                    style={({ pressed }) => [pickerStyles.exerciseCard, pressed && { opacity: 0.75 }]}
                  >
                    <View style={pickerStyles.exerciseLeft}>
                      <View style={pickerStyles.exerciseNumBadge}>
                        <Text style={pickerStyles.exerciseNum}>{idx + 1}</Text>
                      </View>
                      <View>
                        <Text style={pickerStyles.exerciseName}>{exercise.name}</Text>
                        <Text style={pickerStyles.exerciseMuscle}>{exercise.muscle_group_name}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#F8C61E" />
                  </Pressable>
                ))}

                {filteredExercises.length === 0 && (
                  <Text style={pickerStyles.emptyText}>No exercises found for this muscle group.</Text>
                )}
              </ScrollView>
            </View>
          ) : <View></View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#252C37",
    width: "100%",
    padding: 16
  },
  upperContainer: {
    backgroundColor: "#252C37",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 50
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#F8C61E",
    opacity: 0.8,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  selectMuscle: {
    color: "#D2C5AC",
    fontSize: 15,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 40,
  }
});

const pickerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10141D',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backBtn: {
    width: 30,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F8C61E',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subTitle: {
    color: '#6B7C96',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabsRow: {
    flexShrink: 0,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#19202B',
    borderWidth: 1,
    borderColor: '#2B3547',
  },
  tabActive: {
    backgroundColor: '#26231E',
    borderColor: '#F8C61E',
  },
  tabText: {
    color: '#6B7C96',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#F8C61E',
  },
  list: {
    padding: 16,
    paddingBottom: 40,
    rowGap: 12,
  },
  exerciseCard: {
    backgroundColor: '#19202B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2B3547',
    borderLeftWidth: 3,
    borderLeftColor: '#F8C61E',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    flex: 1,
  },
  exerciseNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#252C37',
    borderWidth: 1,
    borderColor: '#3A4559',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNum: {
    color: '#F8C61E',
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseName: {
    color: '#DCE3F1',
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseMuscle: {
    color: '#6B7C96',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  emptyText: {
    color: '#6B7C96',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
});
