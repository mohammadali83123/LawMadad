import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthProvider } from "../context/AuthContext";
import AuthGuard from "../components/AuthGuard";

export default function RootLayout() {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      profileImageSize: 150,
    });
  }, []);

  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
  });

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
        }} />
        <Stack.Screen name="login" options={{
          headerShown: false,
        }} />
      </Stack>
    </AuthProvider>
  );
}