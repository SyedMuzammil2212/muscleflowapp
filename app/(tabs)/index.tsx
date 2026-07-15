import GetLatestSession from '@/api/getLatestSession';
import { quotes } from '@/components/internaldata';
import Loader from '@/components/loader';
import SessionCard from '@/components/sessionCard';
import { Text, View } from '@/components/Themed';
import { useUser } from '@/components/userContext';
import { router } from 'expo-router';
import WhiteButton from '@/components/WhiteButton';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export default function TabOneScreen() {
  const { user, token } = useUser()
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(true)

  const [session, setSession] = useState({})

  const latestSession = async () => {

    const res = await GetLatestSession(token)
    setSession(res);
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
  return (
    <>
      {loading ?
        <Loader />
        : <Animated.View style={[styles.container, headerAnimatedStyle]}>
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

          <WhiteButton onPress={() => { }} text='Start Workout' />

          <Text style={styles.selectMuscle}>SELECT MUSCLE GROUPS TO BEGIN</Text>




        </Animated.View>
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
