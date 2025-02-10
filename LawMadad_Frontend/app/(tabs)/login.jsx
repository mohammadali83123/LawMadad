import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input} placeholder="Enter Your Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Enter Your Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Forgot Password?"></Button>

      <Button title="Login" onPress={() => alert("Login Clicked")} />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#184626" },
  placeholder:{textAlign:"center"},
  
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 10, marginVertical: 10, width: "80%", borderRadius: 8 }
});
