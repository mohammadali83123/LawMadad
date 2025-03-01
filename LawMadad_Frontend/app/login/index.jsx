import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from './../../constants/Colors'
import { Pressable } from 'react-native'
import {useRouter} from 'expo-router'



export default function Home() {
  
  const router = useRouter();

  const onPress = () => {
    router.push('/login/loginScreen');  
  }

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