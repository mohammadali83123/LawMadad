import { View, TextInput, Button, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'

export default function home() {
  const [inputQuery, setInputQuery] = useState('');

  return (
    <View style={{flex:1,}}>
      <View style={{flex:1, paddingTop:10,
      }}>
        <Text>Your Query Answer Will be here</Text>
      </View>
      <View style={{
        justifyContent: "flex-end",
      }}>
        <TextInput placeholder='Enter your query' keyboardType='default'
          value={inputQuery} onChangeText={(text) => setInputQuery(text)} style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            paddingHorizontal: 10,
            marginBottom: 20,
            borderRadius: 5,
            paddingEnd: 10,
          }}>
        </TextInput>
        <Button title="Submit" onPress={()=> console.log("Quesry Submitted Input Query is this\n", inputQuery)} />
      </View>
    </View>
  )
}