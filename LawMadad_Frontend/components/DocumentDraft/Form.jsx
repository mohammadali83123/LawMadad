import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Form() {
  const [person1Name, setPerson1Name] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [date, setDate] = useState('');
  const [caseCategory, setCaseCategory] = useState('');
  const [advocateName, setAdvocateName] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleGenerateDocument = () => {
    // Implement document generation logic here
    console.log('Generating document...');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Legal Document Form</Text>
      
      <Text style={styles.label}>Person 1 Name:</Text>
      <TextInput
        style={styles.input}
        value={person1Name}
        onChangeText={setPerson1Name}
        placeholder="Enter Person 1 Name"
      />

      <Text style={styles.label}>Person 2 Name:</Text>
      <TextInput
        style={styles.input}
        value={person2Name}
        onChangeText={setPerson2Name}
        placeholder="Enter Person 2 Name"
      />

      <Text style={styles.label}>Date:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Case Category:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={caseCategory}
          onValueChange={(itemValue) => setCaseCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a category" value="" />
          <Picker.Item label="Civil" value="civil" />
          <Picker.Item label="Criminal" value="criminal" />
          <Picker.Item label="Family" value="family" />
          <Picker.Item label="Corporate" value="corporate" />
        </Picker>
      </View>

      <Text style={styles.label}>Advocate Name (if any):</Text>
      <TextInput
        style={styles.input}
        value={advocateName}
        onChangeText={setAdvocateName}
        placeholder="Enter Advocate Name"
      />

      <Text style={styles.label}>Query:</Text>
      <TextInput
        style={[styles.input, styles.promptInput]}
        value={prompt}
        onChangeText={setPrompt}
        placeholder="Enter your Query here"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleGenerateDocument}>
        <Text style={styles.buttonText}>Generate Document</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  promptInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
