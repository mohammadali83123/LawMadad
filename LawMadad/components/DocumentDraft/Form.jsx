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
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
// import { getDocumentAsync } from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';

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

  const handleGenerateDocument = async () => {
    try {
      const response = await fetch('https://ali4568-lawmadad-documentdraft.hf.space/documentdraft/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error('Failed to generate document');
  
      const blob = await response.blob();
  
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];
        const filename = `Affidavit_${formData.full_name.replace(/\s/g, '_')}.docx`;
        const fileUri = FileSystem.documentDirectory + filename;
  
        try {
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Media library permission is required.');
            return;
          }
  
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync('Download', asset, false);
  
          Alert.alert('Success', 'Document saved to Downloads folder!');
        } catch (saveError) {
          console.error('Saving error:', saveError);
          Alert.alert('Error', 'Failed to save document.');
        }
      };
  
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Generation failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  // const handleGenerateDocument = async () => {
  //   try {
  //     const response = await fetch('https://ali4568-lawmadad-documentdraft.hf.space/documentdraft/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData),
  //     });
  
  //     if (!response.ok) throw new Error('Failed to generate document');
  
  //     const blob = await response.blob();
  
  //     const reader = new FileReader();
  //     reader.onloadend = async () => {
  //       const base64Data = reader.result.split(',')[1];
  
  //       try {
  //         // Use SAF to let the user pick where to save
  //         const filename = `Affidavit_${formData.full_name.replace(/\s/g, '_')}.docx`;
  
  //         const permission = await getDocumentAsync({
  //           type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //           copyToCacheDirectory: false,
  //         });
  
  //         if (permission.type === 'success') {
  //           await FileSystem.writeAsStringAsync(permission.uri, base64Data, {
  //             encoding: FileSystem.EncodingType.Base64,
  //           });
  
  //           Alert.alert('Success', 'Document saved to Downloads folder or chosen location!');
  //         } else {
  //           Alert.alert('Cancelled', 'File save cancelled.');
  //         }
  //       } catch (saveError) {
  //         console.error('Saving error:', saveError);
  //         Alert.alert('Error', 'Failed to save document.');
  //       }
  //     };
  
  //     reader.readAsDataURL(blob);
  //   } catch (error) {
  //     console.error('Generation failed:', error);
  //     Alert.alert('Error', error.message);
  //   }
  // };

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
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
