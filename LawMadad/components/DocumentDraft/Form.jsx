import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Form() {
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    gender: '',
    religion: '',
    address: '',
    city: '',
    case_versus: '',
    app_under_section: '',
    court_name: '',
    court_no: '',
    court_type: '',
    jurisdiction: '',
    case_number: '',
    date: '',
    sections: '',
    police_station: '',
    purpose: '',
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

    const handleGenerateDocument = async () => {
      try {
        const response = await fetch('https://ali4568-lawmadad-documentdraft.hf.space/documentdraft/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to generate document');
        }

        const blob = await response.blob();

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result.split(',')[1];
          const filename = `Affidavit_${formData.full_name.replace(/\s/g, '_')}.docx`;
          const fileUri = FileSystem.documentDirectory + filename;

          try {
            // Save base64 string as file
            await FileSystem.writeAsStringAsync(fileUri, base64Data, {
              encoding: FileSystem.EncodingType.Base64,
            });

            console.log('File saved at:', fileUri);
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri);
            } else {
              Alert.alert('Success', `Document saved to:\n${fileUri}`);
            }
          } catch (saveError) {
            console.error('Error saving file:', saveError);
            Alert.alert('Error', 'Could not save document.');
          }
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Document generation failed:', error);
        Alert.alert('Error', error.message);
      }
    };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Document Draft Form</Text>

      {Object.entries(formData).map(([key, value]) => (
        <View key={key}>
          <Text style={styles.label}>{key.replace(/_/g, ' ')}:</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={`Enter ${key.replace(/_/g, ' ')}`}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleGenerateDocument}>
        <Text style={styles.buttonText}>Generate & Download</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
