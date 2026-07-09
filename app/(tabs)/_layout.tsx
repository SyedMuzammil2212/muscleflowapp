import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import HistoryIcon from '@/assets/icons/history';
import ProfileIcon from '@/assets/icons/profile';
import WorkoutIcon from '@/assets/icons/workout';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/components/userContext';
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
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50%",
                      borderRadius: 18,
                      width: "80%",
                      backgroundColor: focused ? "#3F4A5B" : "transparent",
                    }}
                  >
                    <WorkoutIcon
                      width={28}
                      height={28}
                      color={focused ? "#F8C61E" : "#D2C5AC"}
                    />

                    <Text
                      style={{
                        color: focused ? "#F8C61E" : "#D2C5AC",
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
                      backgroundColor: focused ? "#3F4A5B" : "transparent",
                    }}
                  >
                    <HistoryIcon
                      width={28}
                      height={28}
                      color={focused ? "#F8C61E" : "#D2C5AC"}
                    />


                    <Text
                      style={{
                        color: focused ? "#F8C61E" : "#D2C5AC",
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
                      backgroundColor: focused ? "#3F4A5B" : "transparent",
                    }}
                  >
                    <ProfileIcon
                      width={28}
                      height={28}
                      color={focused ? "#F8C61E" : "#D2C5AC"}
                    />

                    <Text
                      style={{
                        color: focused ? "#F8C61E" : "#D2C5AC",
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
    </AuthProvider>
  );
}
