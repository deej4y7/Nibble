import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFonts, Caveat_400Regular } from "@expo-google-fonts/caveat";

// ---------------------------------------------------------------------------
// Splash Screen 1 — Static, no animation, immediately goes to splash-two
// ---------------------------------------------------------------------------
export default function SplashScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Caveat_400Regular });

  useEffect(() => {
    // Show briefly then hand off to Splash 2 which has the animation
    const timer = setTimeout(() => {
      router.replace("/splash-two");
    }, 2000); // adjust ms to control how long Splash 1 is visible

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
});