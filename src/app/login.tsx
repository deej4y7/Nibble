import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

// ---------------------------------------------------------------------------
// LoginScreen
// ---------------------------------------------------------------------------
export default function LoginScreen() {
  const router = useRouter();

  // ── Form state ──────────────────────────────────────────────────────────
  // useState stores what the user types in each field
  const [identifier, setIdentifier] = useState(""); // username/email/phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");            // error message to show
  const [isLoading, setIsLoading] = useState(false); // show loading screen?

  // ── Focus state — tracks which input is active (for red border on error) ─
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused]     = useState(false);

  // ── Breathing animation values ───────────────────────────────────────────
  // These drive the pulse effect on the logo during loading
  const breathScale   = useRef(new Animated.Value(1)).current;
  const breathOpacity = useRef(new Animated.Value(0.7)).current;

  // ── Start breathing loop when loading screen appears ────────────────────
  useEffect(() => {
    if (!isLoading) return;

    // Animated.loop runs the animation forever until we stop it
    // It scales the logo from 1 → 1.15 → 1 smoothly, like breathing
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(breathScale, {
            toValue: 1.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(breathOpacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(breathScale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(breathOpacity, {
            toValue: 0.7,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    breathLoop.start();

    // After 2.5s of "loading", navigate to home
    const timer = setTimeout(() => {
      breathLoop.stop();
      router.replace("/home");
    }, 2500);

    // Cleanup: stop animation and timer if component unmounts
    return () => {
      breathLoop.stop();
      clearTimeout(timer);
    };
  }, [isLoading]);

  // ── Handle login button press ────────────────────────────────────────────
  const handleLogin = () => {
    // Basic validation — check fields aren't empty
    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(""); // clear any previous error

    // TODO: Replace this block with real Supabase auth call:
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) { setError("Username or Password does not match"); return; }

    // For now simulate a failed login if password is wrong (mock)
    // Remove this when Supabase is connected
    if (password !== "password123") {
      setError("Username or Password does not match");
      return;
    }

    // Success → show loading screen
    setIsLoading(true);
  };

  // ── Handle Google login ──────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    // TODO: Implement Supabase Google OAuth
    // await supabase.auth.signInWithOAuth({ provider: 'google' })
    setIsLoading(true);
  };

  // ── Handle Apple login ───────────────────────────────────────────────────
  const handleAppleLogin = () => {
    // TODO: Implement Supabase Apple OAuth
    // await supabase.auth.signInWithOAuth({ provider: 'apple' })
    setIsLoading(true);
  };

  // ── Determine input border color ─────────────────────────────────────────
  // If there's an error → red border
  // If focused → orange border
  // Default → gray border
  const getInputStyle = (focused: boolean) => [
    styles.input,
    focused && styles.inputFocused,
    error && styles.inputError,
  ];

  // ── Loading Screen ───────────────────────────────────────────────────────
  // Show this instead of the form when login is processing
  if (isLoading) {
    return (
      <View style={styles.loadingRoot}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
        <Animated.Image
          source={require("../../assets/images/logo_2.png")}
          style={[
            styles.loadingLogo,
            {
              transform: [{ scale: breathScale }],
              opacity: breathOpacity,
            },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  }

  // ── Login Form ───────────────────────────────────────────────────────────
  return (
    // KeyboardAvoidingView pushes the form up when the keyboard opens
    // so the inputs don't get hidden behind the keyboard
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#FAFAFA" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

        {/* Logo */}
        <Image
          source={require("../../assets/images/logo_2.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>LOGIN TO GET REAL FOOD</Text>

        {/* Username / Email / Phone input */}
        <TextInput
          style={getInputStyle(identifierFocused)}
          placeholder="Username, Email or Phone Number"
          placeholderTextColor="#AAAAAA"
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            setError(""); // clear error when user starts typing
          }}
          onFocus={() => setIdentifierFocused(true)}
          onBlur={() => setIdentifierFocused(false)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password input */}
        <TextInput
          style={getInputStyle(passwordFocused)}
          placeholder="Password"
          placeholderTextColor="#AAAAAA"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          secureTextEntry // hides password characters
        />

        {/* Error message — only shows when error state is set */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* LOGIN button */}
        <TouchableOpacity
          style={styles.btnLogin}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>LOGIN</Text>
        </TouchableOpacity>

        {/* CONTINUE WITH GOOGLE */}
        <TouchableOpacity
          style={styles.btnSocial}
          onPress={handleGoogleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>CONTINUE WITH GOOGLE</Text>
        </TouchableOpacity>

        {/* CONTINUE WITH APPLE */}
        <TouchableOpacity
          style={styles.btnSocial}
          onPress={handleAppleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>CONTINUE WITH APPLE</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  // ── Login form ──
  root: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 0.3,
  },

  // Inputs
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "transparent", // invisible border by default
  },
  inputFocused: {
    borderColor: "#F5A623", // orange when focused
    backgroundColor: "#FFF",
  },
  inputError: {
    borderColor: "#E53935", // red when there's an error
    backgroundColor: "#FFF",
  },

  // Error text
  errorText: {
    color: "#E53935",
    fontSize: 13,
    alignSelf: "flex-start",
    marginBottom: 12,
    marginLeft: 8,
  },

  // Buttons
  btnLogin: {
    width: "60%",
    backgroundColor: "#F5A623",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  btnSocial: {
    width: "60%",
    backgroundColor: "#F5A623",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 12,
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
    textAlign: "center",
  },

  // ── Loading screen ──
  loadingRoot: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLogo: {
    width: 180,
    height: 160,
  },
});