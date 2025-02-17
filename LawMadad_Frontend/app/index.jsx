import { useUser } from "@clerk/clerk-expo";
import { Text, View } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, isLoaded } = useUser(); // Destructure isLoaded to check for loading state

  if (!isLoaded) {
    // Optionally, you can show a loading spinner or placeholder
    return null;
  }
  console.log("User Info:", user);
  console.log("Username:", user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center", // Horizontal
        alignItems: "center", // Vertical
      }}
    >
      {user ? (
        <>
          <Text>{user.fullName}</Text>
          <Redirect href="/(tabs)/home"/>
        </>
      ) : (
        <Redirect href="/login" />
      )}
    </View>
  );
}
