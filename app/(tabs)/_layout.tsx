import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import CalendarIcon from '@/assets/icons/calendaricon';
import ProfileIcon from '@/assets/icons/profile';
import StatsIcon from '@/assets/icons/statsicon';
import WorkoutIcon from '@/assets/icons/workout';

const TAB_BAR_HEIGHT = 60;
const TAB_BAR_BOTTOM_MARGIN = 24;

function TabItem({
  focused,
  icon,
}: {
  focused: boolean;
  icon: (color: string) => React.ReactNode;
}) {
  const bgOpacity = useSharedValue(focused ? 1 : 0);
  const scale = useSharedValue(focused ? 1 : 0.9);

  useEffect(() => {
    bgOpacity.value = withTiming(focused ? 1 : 0, { duration: 100 });
    scale.value = withTiming(focused ? 1 : 0.9, { duration: 200 });
  }, [focused]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const color = focused ? '#F8C61E' : '#9AA4B2';

  return (
    <Animated.View style={[styles.tabItem, scaleStyle]}>
      <Animated.View style={[styles.activeHighlight, bgStyle]} />
      {icon(color)}
    </Animated.View>
  );
}

function FloatingTabBar({ state, navigation }: any) {
  const tabs = [
    { name: 'index', icon: (c: string) => <WorkoutIcon width={26} height={26} color={c} /> },
    { name: 'two', icon: (c: string) => <StatsIcon width={26} height={26} color={c} /> },
    { name: 'calendar', icon: (c: string) => <CalendarIcon width={26} height={26} color={c} /> },
    { name: 'three', icon: (c: string) => <ProfileIcon width={26} height={26} color={c} /> },
  ];

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={styles.pillWrapper}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
        )}

        {/* Subtle gold top-edge accent */}
        {/* <View style={styles.topBorder} /> */}

        <View style={styles.tabRow}>
          {tabs.map((tab, index) => {
            const route = state.routes[index];
            const focused = state.index === index;

            return (
              <Pressable
                key={tab.name}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                style={styles.pressable}
              >
                <TabItem focused={focused} icon={tab.icon} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="two" options={{ headerShown: false }} />
      <Tabs.Screen name="calendar" options={{ headerShown: false }} />
      <Tabs.Screen name="three" options={{ headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM_MARGIN,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  pillWrapper: {
    width: '100%',
    height: TAB_BAR_HEIGHT,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(78, 70, 51, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  androidBg: {
    backgroundColor: 'rgba(19, 26, 37, 0.97)',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: 'rgba(248, 198, 30, 0.15)',
    zIndex: 2,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 16,
    width: "100%"
  },
  activeHighlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: 100,
    backgroundColor: 'rgba(248, 198, 30, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248, 198, 30, 0.25)',
  },
});
