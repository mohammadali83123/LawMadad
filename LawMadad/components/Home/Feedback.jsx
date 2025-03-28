import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { firestore, auth } from '../../Config/FirebaseConfig';
import AntDesign from '@expo/vector-icons/AntDesign';

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
        console.log(queryId);
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
            <TouchableOpacity style={styles.likeButton} onPress={handleLike} disabled={feedbackSubmitted}>
                <AntDesign name="like2" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dislikeButton} onPress={handleDislike} disabled={feedbackSubmitted}>
                <AntDesign name="dislike2" size={20} color="black" />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
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
        marginTop: 5,
        marginBottom: 5,
    },
    likeButton: {
        backgroundColor: '#28a745', // Green for like
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    likeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dislikeButton: {
        backgroundColor: '#dc3545', // Red for dislike
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dislikeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    modalTitle: {
        color: '#333',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    optionButton: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedOption: {
        backgroundColor: '#cce5ff',
        borderColor: '#66b0ff',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 12,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

export default Feedback;
