import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
      <Text>login coming soon!</Text>
    </View>
  );
}