import { Text, View } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center", // Horizontal
        alignItems: "center", // Vertical
      }}
    >
        <Redirect href="/login" />
    </View>
  );
}
