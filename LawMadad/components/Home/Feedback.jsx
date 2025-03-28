import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { firestore, auth } from '../../Config/FirebaseConfig';

const Feedback = ({ queryId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const feedbackOptions = [
    'Inappropriate Information',
    'Irrelevant Response',
    'Outdated Information',
    'Other'
  ];

  const submitFeedback = async (feedbackType, reason = null) => {
    const feedbackData = {
      userId: auth.currentUser ? auth.currentUser.uid : null,
      queryId: queryId,
      feedback: feedbackType === 'like' ? 'like' : `dislike - ${reason}`,
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(firestore, 'feedback'), feedbackData);
      setFeedbackSubmitted(true);
      Alert.alert('Feedback Submitted', 'Thank you for your feedback.');
    } catch (error) {
      console.error('Error submitting feedback: ', error);
      Alert.alert('Error', 'Could not submit feedback. Please try again.');
    }
  };

  const handleLike = () => {
    console.log("Like button pressed");
    if (!feedbackSubmitted) {
      submitFeedback('like');
    }
  };

  const handleDislike = () => {
    console.log("Dislike button pressed");
    if (!feedbackSubmitted) {
      setModalVisible(true);
    }
  };

  const handleModalSubmit = () => {
    if (!selectedReason) {
      Alert.alert('Select Reason', 'Please select a reason for disliking.');
      return;
    }
    submitFeedback('dislike', selectedReason);
    setModalVisible(false);
    setSelectedReason('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLike} disabled={feedbackSubmitted}>
        <Text style={styles.buttonText}>Like</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDislike} disabled={feedbackSubmitted}>
        <Text style={styles.buttonText}>Dislike</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade" // Changed from slide to fade for testing
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        // presentationStyle="overFullScreen" // Try commenting out temporarily if issues persist
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Why do you dislike this response?</Text>
            {feedbackOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedReason === option && styles.selectedOption
                ]}
                onPress={() => setSelectedReason(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={handleModalSubmit}>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedReason('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#8b4513',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#8b4513',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#8b4513',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
  },
});

export default Feedback;

