"use client"

import React, { useState, useEffect } from "react"
import { TouchableOpacity, Text, StyleSheet, ScrollView, View, Platform, StatusBar } from "react-native"
import Animated from "react-native-reanimated"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { firestore, auth } from "../../Config/FirebaseConfig"
import Fontisto from '@expo/vector-icons/Fontisto';

const Sidebar = ({ toggleSidebar, animatedStyle }) => {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const q = query(
      collection(firestore, "Query"),
      where("userId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setHistory(data)
    })

    return () => unsubscribe()
  }, [])

  return (
    <Animated.View style={[styles.sidebar, animatedStyle]}>
      <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
        <Fontisto name="close-a" size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.sidebarTitle}>Menu</Text>
      <Text style={styles.historyTitle}>Your Query History</Text>
      <ScrollView style={styles.historyContainer}>
        {history.length === 0 ? (
          <Text style={styles.noHistoryText}>No queries found.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyQuery}>{item.user_query}</Text>
              <Text style={styles.historyTimestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#2c2c2c",
    padding: 20,
    zIndex: 1000,
    paddingTop: Platform.OS === "ios" ? 40 : StatusBar.currentHeight || 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  sidebarTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  iconText: {
    color: "white",
    fontSize: 24,
  },
  historyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyContainer: {
    flex: 1,
  },
  noHistoryText: {
    color: "white",
    fontSize: 16,
  },
  historyItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 10,
  },
  historyQuery: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  historyTimestamp: {
    color: "#ccc",
    fontSize: 12,
  },
})

export default Sidebar
