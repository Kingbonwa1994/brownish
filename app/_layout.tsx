import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {  router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const initialOptions = {
    clientId: "test",
    currency: "USD",
    intent: "capture",
};

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <PayPalScriptProvider options={initialOptions}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="sign-in" options={{ headerShown: false,  
        headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ), }}
          
        />
      </Stack>
      </PayPalScriptProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
