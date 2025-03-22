"use client"

import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";

export default function PrivacyScreen() {
  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#4a6da7", "#8a9eb5"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.subtitle}>
            LawMadad AI Legal Chatbot & Document Drafter
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.bodyText}>
              Welcome to LawMadad AI, your trusted legal chatbot and document drafter.
              We are committed to protecting your privacy. This Privacy Policy explains how we
              collect, use, and safeguard your personal data when you use our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.bodyText}>
              When you interact with our chatbot or document drafting features, we may collect:
            </Text>
            <Text style={styles.listItem}>• Your legal queries and inputs</Text>
            <Text style={styles.listItem}>• Usage statistics and device information</Text>
            <Text style={styles.listItem}>• Cookies and technical data for improving our services</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.bodyText}>
              We use your information to:
            </Text>
            <Text style={styles.listItem}>• Provide personalized legal advice and document drafts</Text>
            <Text style={styles.listItem}>• Enhance our AI algorithms and overall service quality</Text>
            <Text style={styles.listItem}>• Ensure a secure and seamless user experience</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.bodyText}>
              We use industry-standard security measures such as encryption and secure storage
              to protect your data. Access to your personal information is limited and monitored.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.bodyText}>
              You have the right to access, modify, or delete your personal data at any time.
              If you have any concerns or questions about our data practices, please contact us.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.bodyText}>
              We may update this Privacy Policy from time to time. Any changes will be posted on this screen
              along with the updated effective date.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.bodyText}>
              If you have any questions regarding this Privacy Policy or our data practices, please contact our support team
              at support@lawmadad.ai.
            </Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#e0e0e0",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    color: "#ddd",
    marginLeft: 10,
    lineHeight: 22,
  },
});