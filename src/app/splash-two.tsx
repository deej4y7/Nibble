import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

// ---------------------------------------------------------------------------
// Splash Screen 2 — Icon only, transitions to Onboarding
// ---------------------------------------------------------------------------
export default function SplashTwo() {
  const router = useRouter();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Fade + gentle scale in, hold, then navigate
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Hold for 1.2s then go to onboarding
      setTimeout(() => router.replace("/onboarding"), 1200);
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <Image
          source={require("../../assets/images/logo_2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 180,
  },
});