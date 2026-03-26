import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFonts, Caveat_400Regular } from "@expo-google-fonts/caveat";

const AnimatedView = Animated.createAnimatedComponent(View);

// ---------------------------------------------------------------------------
// Splash Screen
// ---------------------------------------------------------------------------
export default function SplashScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Caveat_400Regular });

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.72)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(350),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(120),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => router.replace("/onboarding"), 800);
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.content}>
        {/* Logo image with entrance animation */}
        <AnimatedView
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
          />
        </AnimatedView>

        {/* Wordmark */}
        <Animated.View
          style={{
            marginTop: 28,
            opacity: textOpacity,
            transform: [{ translateY: textY }],
          }}
        >
        </Animated.View>
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
  wordmark: {
    fontStyle: "italic",
    fontSize: 54,
    color: "#2C2C2C",
    letterSpacing: 1.5,
  },
});