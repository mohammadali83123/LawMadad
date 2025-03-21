import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RootLayout() {

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '562895718428-rhvf0semjgdqgkb4fgnc01d89366394a.apps.googleusercontent.com',
      webClientId: '562895718428-t84d71cputorjgl6andabcsp22i2pf52.apps.googleusercontent.com',
      profileImageSize: 150,
    });
  },[]);
  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf')
  })

  return (
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
        }} />
        <Stack.Screen name="login" options={{
          headerShown: false,
        }}
        />

      </Stack>
  );
}
