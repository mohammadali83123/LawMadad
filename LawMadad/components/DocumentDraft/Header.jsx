import { View, Text } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

export default function Header() {
  return (
    <View style={{backgroundColor: Colors.PRIMARY, padding:10 }}>
      <Text style={{
        fontFamily:'outfit-bold', 
        fontSize:20, 
        color:Colors.WHITE
        }}>Document Draft</Text>
    </View>
  )
}