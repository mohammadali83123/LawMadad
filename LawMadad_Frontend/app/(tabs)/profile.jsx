import { View, Text, Image, StyleSheet, Dimensions } from "react-native"
import { useUser, useClerk } from "@clerk/clerk-expo"
import { StatusBar } from "expo-status-bar"
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Button } from "react-native-paper"
import { MaterialCommunityIcons } from '@expo/vector-icons' // Using Expo vector icons instead of lucide-react
import { useNavigation } from '@react-navigation/native' // Import the useNavigation hook

const { width } = Dimensions.get("window")

export default function Profile() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigation = useNavigation() // Hook to navigate

  if (!user) return null

  const handleSignOut = () => {
    signOut()
    navigation.navigate("login/index") // Navigate to the Login screen
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#3e2723", "#2c6b3b", "#1b5e20"]} style={styles.background} />
      <Animated.View entering={FadeInDown.delay(300).duration(1000)} style={styles.profileContainer}>
        <Image source={{ uri: user.imageUrl || "https://via.placeholder.com/150" }} style={styles.profileImage} />
        <Animated.Text entering={FadeInRight.delay(600).duration(1000)} style={styles.name}>
          {user.fullName}
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(900).duration(1000)} style={styles.infoContainer}>
        {/* <View style={styles.infoItem}>
          <MaterialCommunityIcons name="account" size={24} color="#fff" />
          <Text style={styles.infoText}>{user.username}</Text>
        </View> */}
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="email" size={24} color="#fff" />
          <Text style={styles.infoText}>{user.primaryEmailAddress?.emailAddress}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(1200).duration(1000)} style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSignOut} contentStyle={styles.buttonContent} style={styles.button}>
          <MaterialCommunityIcons name="logout" size={16} />
          <Text style={styles.buttonText}>Sign Out</Text>
        </Button>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    width: width * 0.8,
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    width: width * 0.8,
  },
  button: {
    backgroundColor: "#2c6b3b", // Dark greenish color
    borderWidth: 2,             // Border width
    borderColor: "#3e2723",     // Dark brown border color
    borderRadius: 25,           // Rounded corners
    elevation: 10,               // Shadow for Android (you can adjust the value), 
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 10,
  },
})
