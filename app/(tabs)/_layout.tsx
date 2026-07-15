import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import HistoryIcon from '@/assets/icons/history';
import ProfileIcon from '@/assets/icons/profile';
import WorkoutIcon from '@/assets/icons/workout';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/components/userContext';
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
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "50%",
        borderRadius: 18,
        width: "80%",
        overflow: "hidden",
      }}
    >
      {/* Animated background pill */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderRadius: 18,
            backgroundColor: "#3F4A5B",
          },
          backgroundStyle,
        ]}
      />

      {/* Spring icon and label wrapper */}
      <Animated.View
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
          },
          iconContainerStyle,
        ]}
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
    <AuthProvider>
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
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 8,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
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
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 8,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
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
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 8,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
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
    </AuthProvider>
  );
}
