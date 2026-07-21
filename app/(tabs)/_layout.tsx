import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import HistoryIcon from '@/assets/icons/history';
import ProfileIcon from '@/assets/icons/profile';
import WorkoutIcon from '@/assets/icons/workout';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';

import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function AnimatedTabButtonContent({
  focused,
  icon,
  label,
  isHistory = false,
}: {
  focused: boolean;
  icon: (color: string) => React.ReactNode;
  label: string;
  isHistory?: boolean;
}) {
  const activeValue = useSharedValue(focused ? 1 : 0);
  const scaleValue = useSharedValue(focused ? 1.05 : 1);

  useEffect(() => {
    activeValue.value = withTiming(focused ? 1 : 0, { duration: 100 });
    scaleValue.value = withSpring(focused ? 1.05 : 1,);
  }, [focused]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: activeValue.value,
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const color = focused ? "#F8C61E" : "#D2C5AC";

  return (
    <View
      className="flex-1 justify-center items-center h-1/2 rounded-[18px] w-4/5 overflow-hidden"
    >
      {/* Animated background pill */}
      <Animated.View
        className="absolute left-0 right-0 top-0 bottom-0 rounded-[18px] bg-surface-3"
        style={backgroundStyle}
      />

      {/* Spring icon and label wrapper */}
      <Animated.View
        className="items-center justify-center"
        style={iconContainerStyle}
      >
        {icon(color)}
        <Text
          style={{
            color: color,
            fontSize: 12,
            fontWeight: "600",
            marginTop: isHistory ? 6 : 3,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F8C61EF8C61E",
        tabBarInactiveTintColor: "#D2C5ACff",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: "#19202B",
          paddingTop: 6,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: "#4E4633",
          height: "12%"
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,

          tabBarButton: (props) => {
            const focused = props["aria-selected"];

            return (
              <Pressable
                onPress={async (e) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft); props?.onPress?.(e) }}
                onLongPress={props?.onLongPress}
                className="flex-1 mx-2 my-2 items-center justify-center"
              >
                <AnimatedTabButtonContent
                  focused={!!focused}
                  icon={(color) => <WorkoutIcon width={28} height={28} color={color} />}
                  label="Workout"
                />
              </Pressable>
            );
          },
        }}
      />


      <Tabs.Screen
        name="two"
        options={{
          headerShown: false,
          tabBarButton: (props) => {
            const focused = props["aria-selected"];

            return (
              <Pressable
                onPress={async (e) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft); props?.onPress?.(e) }}
                onLongPress={props?.onLongPress}
                className="flex-1 mx-2 my-2 items-center justify-center"
              >
                <AnimatedTabButtonContent
                  focused={!!focused}
                  icon={(color) => <HistoryIcon width={28} height={28} color={color} />}
                  label="History"
                  isHistory={true}
                />
              </Pressable>
            );
          },
        }}
      />


      <Tabs.Screen
        name="three"
        options={{
          headerShown: false,
          tabBarButton: (props) => {
            const focused = props["aria-selected"];

            return (
              <Pressable
                onPress={async (e) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft); props?.onPress?.(e) }}
                onLongPress={props?.onLongPress}
                className="flex-1 mx-2 my-2 items-center justify-center"
              >
                <AnimatedTabButtonContent
                  focused={!!focused}
                  icon={(color) => <ProfileIcon width={28} height={28} color={color} />}
                  label="Profile"
                  isHistory={true}
                />
              </Pressable>
            );
          },
        }}
      />
    </Tabs>
  );
}
