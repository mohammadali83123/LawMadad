"use client"

import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import * as MailComposer from "expo-mail-composer";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../Config/FirebaseConfig";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";

export default function HelpCenter() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isEmailSupported, setIsEmailSupported] = useState(false);

  useEffect(() => {
    // Fetch user email and name from Firebase Auth
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
      setUserName(auth.currentUser.displayName || "User");
    }

    async function checkEmailSupport() {
      const supported = await MailComposer.isSupportedAsync();
      setIsEmailSupported(supported);
    }

    checkEmailSupport();
  }, []);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      Alert.alert("Empty Message", "Please enter your message.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSubmitting(true);
    try {

      MailComposer.composeAsync({
        recipients: ["muhammadalishaikh664@gmail.com"],
        subject: `**LawMadad**: Help Center Message from ${userName}`,
        body: message,
        isHtml: false,
      });
      // Replace the following with your actual submission logic (e.g., saving to Firestore or calling an API)
      // For now, we simulate submission with a timeout:
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Message Sent", "Your message has been sent to our support team.");
      setMessage("");
    } catch (error) {
      console.error(error);
      Alert.alert("Submission Error", "There was an error sending your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#4a6da7", "#8a9eb5"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Help Center</Text>
          <Text style={styles.subtitle}>Contact Us</Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userName}
              editable={false}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userEmail}
              editable={false}
            />
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your message here..."
              placeholderTextColor="#ccc"
              multiline
            />
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSendEmail} 
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                isEmailSupported ? <Text style={styles.submitButtonText}>Send Message</Text> : <Text style={styles.submitButtonText}>Email not supported on this device</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4a6da7",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});