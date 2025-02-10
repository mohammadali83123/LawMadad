import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Law Madad</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/register")}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#184626" 
  },
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 40 
  },
  buttonContainer: { 
    flexDirection: "row", 
    gap: 40
  },
  button: {
    backgroundColor: "#fff", // White background
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  buttonText: {
    color: "#184626", // Green text
    fontSize: 16,
    fontWeight: "bold"
  }
});
