import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function Home() {
  const [inputQuery, setInputQuery] = useState('');
  const [respondedQuery, setRespondedQuery] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.queryContainer}>
          <Text style={styles.queryHeader}>Your Query Answer:</Text>
          <Text style={styles.queryText}>{respondedQuery || 'No query submitted yet.'}</Text>
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Enter your query' 
          keyboardType='default'
          value={inputQuery} 
          onChangeText={(text) => setInputQuery(text)} 
          multiline
          numberOfLines={5} // Set default number of lines
          style={styles.textArea} // Use the text area style
          textAlignVertical="top" // Align text to the top
        />
        <Button 
          title="Submit" 
          color="#28a745" // Green button color
          onPress={() => { 
            console.log("Query Submitted. Input Query is:", inputQuery); 
            setRespondedQuery(inputQuery); 
          }} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  queryContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingStart: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  queryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  queryText: {
    fontSize: 16,
    color: '#495057',
  },
  inputContainer: {
    padding: 10,
    marginVertical: 20,
  },
  textArea: {
    height: 100, // Adjusted initial height of the textarea
    borderColor: '#6c757d',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // For Android
    marginBottom:20,
  },
});
