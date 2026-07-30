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
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
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
  const { user, token, unit, refreshUser } = useUser();
  const [tab, setTab] = useState(1);
  const [musclegroups, setMusclegroups] = useState<Array<muscleObject>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<Array<number>>([]);
  const [exercises, setExercises] = useState<Array<exerciseObject>>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [activeMuscleFilter, setActiveMuscleFilter] = useState<number | null>(null);
  const [nosession, setNosession] = useState(false);

  const [session, setSession] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await latestSession();
    if (refreshUser) refreshUser();
    setRefreshing(false);
  };

  const getExcercisesByMuscles = async () => {
    setLoading(true);
    try {
      const sessionRes = await StartSession(token);
      if (sessionRes?.session?.id) {
        setSessionId(sessionRes.session.id);
        setSessionStartTime(sessionRes.session.start_time);
      }

      const requestData = { musclegroupids: selectedId };
      const res = await GetExercisesByMuscleIds(token, requestData);
      if (res?.exercises) {
        setExercises(res.exercises);
        setActiveMuscleFilter(null);
      }
    } catch (e) {
      console.log(e);
    }
    setTab(3);
    setLoading(false);
  };

  const handleQuickStartTemplate = async (templateName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let targetKeywords: string[] = [];
    if (templateName === 'Push') targetKeywords = ['chest', 'triceps', 'shoulders', 'push'];
    else if (templateName === 'Pull') targetKeywords = ['back', 'biceps', 'pull', 'lats'];
    else if (templateName === 'Legs') targetKeywords = ['legs', 'quadriceps', 'hamstrings', 'calves', 'glutes', 'abs'];
    else if (templateName === 'Full Body') targetKeywords = musclegroups.map(m => m.name.toLowerCase());

    const matchedIds = musclegroups
      .filter(m => targetKeywords.some(kw => m.name.toLowerCase().includes(kw)))
      .map(m => m.id);

    const idsToUse = matchedIds.length > 0 ? matchedIds : musclegroups.slice(0, 2).map(m => m.id);
    setSelectedId(idsToUse);

    setLoading(true);
    try {
      const sessionRes = await StartSession(token);
      if (sessionRes?.session?.id) {
        setSessionId(sessionRes.session.id);
        setSessionStartTime(sessionRes.session.start_time);
      }
      const res = await GetExercisesByMuscleIds(token, { musclegroupids: idsToUse });
      if (res?.exercises) {
        setExercises(res.exercises);
        setActiveMuscleFilter(null);
      }
    } catch (e) {
      console.log(e);
    }
    setTab(3);
    setLoading(false);
  };

  const latestSession = async () => {
    setLoading(true);
    try {
      const res = await GetLatestSession(token);
      const res2 = await GetAllMuscleGroups(token);
      setSession(res);
      setMusclegroups(res2?.muscleGroups || []);
      if (!res?.session || res?.nosession) {
        setNosession(true);
      } else {
        setNosession(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      latestSession();
    } else {
      router.push("/login");
    }
  }, [token]);

  function getRandomQuote(quotesArray: Array<String>) {
    if (!quotesArray || quotesArray.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    return quotesArray[randomIndex];
  }

  const [dailyQuote] = useState(() => getRandomQuote(quotes));

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatVol = (vol: number = 0) => {
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}k`;
    return `${Math.round(vol)}`;
  };

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(30);

  const playAnimations = () => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withTiming(0, { duration: 500 });
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    cardY.value = withDelay(200, withTiming(0, { duration: 500 }));
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

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
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
      {loading ? (
        <Loader />
      ) : tab === 1 ? (
        <ScrollView
          className="flex-1 bg-[#070F18] w-full"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#F8C61E"
              title="Updating..."
              titleColor="#F8C61E"
              colors={["#F8C61E"]}
              progressBackgroundColor="#151C26"
            />
          }
        >
          {/* Header Banner */}
          <Animated.View style={headerAnimatedStyle} className="w-full mb-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-x-3">
                <View className="w-12 h-12 rounded-full border-2 border-brand bg-[#151C26] items-center justify-center">
                  <Text className="text-brand text-xl font-bold">
                    {user?.username?.slice(0, 1).toUpperCase() || 'M'}
                  </Text>
                </View>
                <View>
                  <Text className="text-[#9AA4B2] text-xs font-semibold">{getGreeting()},</Text>
                  <Text className="text-[#DCE3F1] text-xl font-bold">{user?.username || 'Athlete'} 👋</Text>
                </View>
              </View>

              {/* Streak Badge */}
              <View className="bg-[#151C26] border border-[#4E4633]/40 px-3 py-1.5 rounded-full flex-row items-center gap-x-1.5">
                <Ionicons name="flame" size={16} color="#F8C61E" />
                <Text className="text-[#F8C61E] text-xs font-bold">{user?.stats?.streak ?? 0}d</Text>
              </View>
            </View>

            {/* Motivational Quote Glass Card */}
            <LinearGradient
              colors={['rgba(248,198,30,0.08)', 'rgba(248,198,30,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16 }}
            >
              <View className="border border-[#4E4633]/40 rounded-2xl p-4 flex-row items-center gap-x-3">
                <View className="w-9 h-9 rounded-xl bg-brand/15 items-center justify-center border border-brand/30">
                  <Ionicons name="sparkles" size={18} color="#F8C61E" />
                </View>
                <Text className="text-[#DCE3F1] text-xs font-medium italic flex-1 leading-5">
                  "{dailyQuote}"
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Quick Stats Bar */}
          <Animated.View style={cardAnimatedStyle} className="w-full mb-6">
            <View className="flex-row gap-x-2">
              <View className="flex-1 bg-[#151C26] border border-[#4E4633]/30 p-3 rounded-xl items-center gap-y-0.5">
                <Ionicons name="barbell-outline" size={18} color="#F8C61E" />
                <Text className="text-[#F8C61E] text-base font-extrabold">{user?.stats?.workoutCount ?? 0}</Text>
                <Text className="text-[#9AA4B2] text-[10px] uppercase font-bold">Workouts</Text>
              </View>
              <View className="flex-1 bg-[#151C26] border border-[#4E4633]/30 p-3 rounded-xl items-center gap-y-0.5">
                <Ionicons name="flame-outline" size={18} color="#F8C61E" />
                <Text className="text-[#F8C61E] text-base font-extrabold">{user?.stats?.streak ?? 0} days</Text>
                <Text className="text-[#9AA4B2] text-[10px] uppercase font-bold">Streak</Text>
              </View>
              <View className="flex-1 bg-[#151C26] border border-[#4E4633]/30 p-3 rounded-xl items-center gap-y-0.5">
                <Ionicons name="fitness-outline" size={18} color="#F8C61E" />
                <Text className="text-[#F8C61E] text-base font-extrabold">{formatVol(user?.stats?.totalVolume)}</Text>
                <Text className="text-[#9AA4B2] text-[10px] uppercase font-bold">Volume ({unit})</Text>
              </View>
            </View>
          </Animated.View>

          {/* Quick Start Templates Section */}
          <View className="w-full mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[#D2C5AC] text-xs font-semibold tracking-wider uppercase">
                QUICK START ROUTINES
              </Text>
              <Text className="text-[#555E6E] text-[11px]">1-Tap Launch</Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {[
                { name: 'Push', icon: 'flash', desc: 'Chest, Shoulders, Triceps' },
                { name: 'Pull', icon: 'body', desc: 'Back, Biceps, Lats' },
                { name: 'Legs', icon: 'walk', desc: 'Quads, Hamstrings, Abs' },
                { name: 'Full Body', icon: 'fitness', desc: 'All Muscle Groups' },
              ].map((template) => (
                <TouchableOpacity
                  key={template.name}
                  onPress={() => handleQuickStartTemplate(template.name)}
                  activeOpacity={0.8}
                  style={{ width: '48.5%' }}
                  className="bg-[#151C26] border border-[#4E4633]/40 p-3.5 rounded-2xl gap-y-1.5"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="w-7 h-7 rounded-lg bg-brand/15 items-center justify-center">
                      <Ionicons name={template.icon as any} size={15} color="#F8C61E" />
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#555E6E" />
                  </View>
                  <Text className="text-[#DCE3F1] text-sm font-bold mt-1">{template.name} Day</Text>
                  <Text className="text-[#555E6E] text-[10px] font-medium">{template.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Latest Session Highlight */}
          <View className="w-full mb-6">
            <Text className="text-[#D2C5AC] text-xs font-semibold tracking-wider uppercase mb-3">
              LATEST SESSION
            </Text>
            {!nosession ? (
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
            ) : (
              <View className="bg-[#151C26] border border-dashed border-[#4E4633]/50 rounded-2xl p-6 items-center justify-center gap-y-2">
                <Ionicons name="barbell-outline" size={32} color="#555E6E" />
                <Text className="text-[#DCE3F1] text-sm font-semibold">No recent sessions</Text>
                <Text className="text-[#555E6E] text-xs text-center">Start a workout below to log your first session!</Text>
              </View>
            )}
          </View>

          {/* Primary Action Button */}
          <View className="w-full">
            <WhiteButton marginStay={false} onPress={() => { setTab(2); }} text="Start Custom Workout" />
          </View>
        </ScrollView>
      ) : tab === 2 ? (
        <View className="flex-1 w-full">
          <SelectMuscleSection
            getExcercisesByMuscles={getExcercisesByMuscles}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setTab={setTab}
            musclegroups={musclegroups}
          />
        </View>
      ) : tab === 3 ? (
        /* EXERCISE PICKER */
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveMuscleFilter(null);
                }}
                className={`px-3 py-1 rounded-full border ${activeMuscleFilter === null ? 'bg-card border-brand' : 'bg-dark border-border'}`}
              >
                <Text className={`text-[13px] font-semibold ${activeMuscleFilter === null ? 'text-brand' : 'text-text-muted'}`}>ALL</Text>
              </Pressable>
              {muscleTabsForPicker.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveMuscleFilter(m.id);
                  }}
                  className={`px-3 py-1 rounded-full border ${activeMuscleFilter === m.id ? 'bg-card border-brand' : 'bg-dark border-border'}`}
                >
                  <Text className={`text-[13px] font-semibold ${activeMuscleFilter === m.id ? 'text-brand' : 'text-text-muted'}`}>{m.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Exercise list */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 110, rowGap: 12 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#F8C61E"
                title="Updating..."
                titleColor="#F8C61E"
                colors={["#F8C61E"]}
                progressBackgroundColor="#151C26"
              />
            }
          >
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
                    <Text className="text-text-muted text-xs font-semibold">{exercise.muscle_group_name}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#F8C61E" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </>
  );
}
