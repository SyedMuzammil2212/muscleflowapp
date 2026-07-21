import GetSessions from '@/api/getSessions';
import Loader from '@/components/loader';
import SessionCard from '@/components/sessionCard';
import { useUser } from '@/components/userContext';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function TabTwoScreen() {
  const { token } = useUser()
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-20);
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const playAnimations = () => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerY.value = withTiming(0, { duration: 500 });
  };

  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const loadSessions = async () => {
    if (!token) return;
    setLoading(true);
    const data = await GetSessions(token, 10);
    if (data?.sessions) {
      setSessions(data.sessions);
      setCursor(data.nextCursor ?? null);
      setHasMore(!!data.hasMore);
    }
    setLoading(false);
    playAnimations();
  }

  useEffect(() => {
    if (token) {
      loadSessions();
    }
  }, [token])

  const loadMore = async () => {
    if (!hasMore || loadingMore || !cursor || !token) return;

    setLoadingMore(true);
    const data = await GetSessions(token, 10, cursor);
    if (data?.sessions) {
      setSessions((prev) => [...prev, ...data.sessions]);
      setCursor(data.nextCursor ?? null);
      setHasMore(!!data.hasMore);
    }
    setLoadingMore(false);
  }

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isNearBottom) {
      loadMore();
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Animated.View className="flex-1 bg-dark w-full p-4 pt-12" style={headerAnimatedStyle}>
          <Text className="text-2xl font-bold text-brand mb-4 px-2">Session History</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ rowGap: 12, paddingBottom: 96 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {sessions.map((item, idx) => (
              <SessionCard key={item?.session?.id || idx} latest={false} session={item} />
            ))}
            
            {loadingMore && (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color="#F8C61E" />
              </View>
            )}

            {!loadingMore && sessions.length === 0 && (
              <View className="items-center justify-center pt-20">
                <Text className="text-text-muted text-base font-semibold">No workout sessions found</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </>
  );
}
