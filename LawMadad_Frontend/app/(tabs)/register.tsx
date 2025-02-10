import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Next" onPress={() => alert("Register Clicked")} />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#184626" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
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
  input: { backgroundColor: "#fff", padding: 10, marginVertical: 10, width: "80%", borderRadius: 8 }
});
