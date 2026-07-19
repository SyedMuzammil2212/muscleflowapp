import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import Lightning from '@/assets/icons/lightning';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/components/userContext';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

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
    <View style={styles.successToast}>
      <Lightning color='#6DFF5D' />
      <View>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View style={styles.errorToast}>
      <Lightning color='#FF4F4F' />
      <View>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  successToast: {
    width: "90%",
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    padding: 16,
    borderRadius: 12,
    borderColor: "#6DFF5D",
    borderWidth: 1
  },

  errorToast: {
    width: "90%",
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    padding: 16,
    borderRadius: 12,
    borderColor: "#FF4F4F",
    borderWidth: 1
  },

  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#e4e0e0ff",
    fontSize: 14,
    marginTop: 4,
  },
});

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
