import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";

import Lightning from '@/assets/icons/lightning';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/components/userContext';
import * as WebBrowser from "expo-web-browser";
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

WebBrowser.maybeCompleteAuthSession();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="w-[90%] bg-[#111] flex-row items-center gap-x-2.5 p-4 rounded-xl border border-[#6DFF5D]">
      <Lightning color='#6DFF5D' />
      <View>
        <Text className="text-white text-base font-bold">{text1}</Text>
        <Text className="text-[#e4e0e0] text-sm mt-1">{text2}</Text>
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View className="w-[90%] bg-[#111] flex-row items-center gap-x-2.5 p-4 rounded-xl border border-[#FF4F4F]">
      <Lightning color='#FF4F4F' />
      <View>
        <Text className="text-white text-base font-bold">{text1}</Text>
        <Text className="text-[#e4e0e0] text-sm mt-1">{text2}</Text>
      </View>
    </View>
  ),
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const AppTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#252C37",
      card: "#252C37",
      primary: "#F8C61E",
      text: "#DCE3F1",
      border: "#252C37",
      notification: "#F8C61E",
    },
  };

  return (
    <AuthProvider>
      <ThemeProvider value={AppTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="workout" options={{ headerShown: false }} />
          <Stack.Screen name="workoutdetails" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} />
      </ThemeProvider>
    </AuthProvider>
  );
}
