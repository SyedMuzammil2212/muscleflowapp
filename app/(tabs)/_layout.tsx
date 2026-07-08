import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import HistoryIcon from '@/assets/icons/history';
import ProfileIcon from '@/assets/icons/profile';
import WorkoutIcon from '@/assets/icons/workout';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from 'react-native';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#9a9a9aff",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: "#111",
          paddingTop: 6,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: "grey",
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
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                    borderRadius: 18,
                    width: "80%",
                    backgroundColor: focused ? "#4A4A4A" : "transparent",
                  }}
                >
                  <WorkoutIcon
                    width={28}
                    height={28}
                    color={focused ? "#FFF" : "#9A9A9A"}
                  />

                  <Text
                    style={{
                      color: focused ? "#FFF" : "#9A9A9A",
                      marginTop: 3,
                    }}
                  >
                    Workout
                  </Text>
                </View>
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
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                    borderRadius: 18,
                    width: "80%",
                    backgroundColor: focused ? "#4A4A4A" : "transparent",
                  }}
                >
                  <HistoryIcon
                    width={28}
                    height={28}
                    color={focused ? "#FFF" : "#9A9A9A"}
                  />


                  <Text
                    style={{
                      color: focused ? "#FFF" : "#9A9A9A",
                      marginTop: 6,
                    }}
                  >
                    History
                  </Text>
                </View>
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
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50%",
                    borderRadius: 18,
                    width: "80%",
                    backgroundColor: focused ? "#4A4A4A" : "transparent",
                  }}
                >
                  <ProfileIcon
                    width={28}
                    height={28}
                    color={focused ? "#FFF" : "#9A9A9A"}
                  />

                  <Text
                    style={{
                      color: focused ? "#FFF" : "#9A9A9A",
                      marginTop: 6,
                    }}
                  >
                    Profile
                  </Text>
                </View>
              </Pressable>
            );
          },
        }}
      />
    </Tabs>
  );
}
