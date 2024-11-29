import { View, TextInput, Text, Button, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';  // Import Markdown component

export default function Home() {
  const [inputQuery, setInputQuery] = useState('');
  const [respondedQuery, setRespondedQuery] = useState('');

  // Function to handle API call
  const handleQuerySubmit = async () => {
    try {
      console.log("Query Submitted. Input Query is:", inputQuery);
      const response = await axios.post('https://e248-34-74-127-250.ngrok-free.app/query', { query: inputQuery });
      console.log(response.data.response);
      setRespondedQuery(response.data.response); // Assume the response has an "answer" field
    } catch (error) {
      console.error("Error fetching response:", error);
      setRespondedQuery("An error occurred while fetching the response.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.queryContainer}>
          <Text style={styles.queryHeader}>Your Query Answer:</Text>
          <Markdown>{respondedQuery || 'No query submitted yet.'}</Markdown> {/* Render markdown formatted text */}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder='Enter your query' 
          keyboardType='default'
          value={inputQuery} 
          onChangeText={(text) => setInputQuery(text)} 
          multiline
          numberOfLines={5}
          style={styles.textArea}
          textAlignVertical="top"
        />
        <Button 
          title="Submit" 
          color="#28a745"
          onPress={handleQuerySubmit} // Call the API on submit
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
    elevation: 5,
  },
  queryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 10,
  },
  inputContainer: {
    padding: 10,
    marginVertical: 20,
  },
  textArea: {
    height: 100,
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
    elevation: 3,
    marginBottom: 20,
  },
});


