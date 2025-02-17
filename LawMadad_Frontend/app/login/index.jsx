import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from './../../constants/Colors'
import { Pressable } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { useCallback } from 'react';
import { useUser } from '@clerk/clerk-expo';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  
  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const { user } = useUser(); // Fetch user details
  
  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'LawMadad' }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive({ session: createdSessionId });

        console.log("User Info:", user);
        console.log("Username:", user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress);
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View style={{
      backgroundColor: Colors.WHITE,
      height:'100%'
      
    }}>
      <Image style={{ width: '100%', height: 400 }} source={require("./../../assets/images/logo.png")} />
      <View style={{
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: '#367f39'
      }}>
        <Text
          style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            textAlign: 'center',
            marginTop: 30
          }}> Ready to Get Legal Assistant?</Text>
        <Text style={{
          fontFamily: 'outfit',
          textAlign: 'center',
          paddingTop: 10,
          color: Colors.GRAY
        }}>LawMadad is an AI Legal Assistant and Legal Document Drafter</Text>

        <Pressable onPress={onPress} style={{
          padding: 14,
          marginTop: 70,
          backgroundColor: Colors.PRIMARY,
          width: '100%',
          borderRadius: 14
        }}>
          <Text style={{
            color: Colors.WHITE,
            textAlign: 'center'
          }}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  )
}