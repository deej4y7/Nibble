import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts, Caveat_400Regular } from "@expo-google-fonts/caveat";

const { width } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Carousel slide data
// Replace the `image` requires with your actual illustration assets
// ---------------------------------------------------------------------------
const SLIDES = [
  {
    id: "1",
    image: require("../../assets/images/burger.png"),
    caption: "FIND FOOD\nWITHIN REACH",
  },
  {
    id: "2",
    image: require("../../assets/images/fries.png"),
    caption: "UMM... YEAH,\nFOOD APP",
  },
  {
    id: "3",
    image: require("../../assets/images/menu.png"),
    caption: "CALMING WAY TO FIND FOOD AND TO FIND\nTASTE IN FOOD YAY :D",
  },
  {
    id: "4",
    image: require("../../assets/images/motorcycle.png"),
    caption: "fast app and easy delivery (may vary)",
  }
];

// ---------------------------------------------------------------------------
// Onboarding Screen
// ---------------------------------------------------------------------------
export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [fontsLoaded] = useFonts({ Caveat_400Regular });

  // Track which slide is visible
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* ── Top: Logo icon + Wordmark ── */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.headerIcon}
          resizeMode="contain"
        />
      </View>

      {/* ── Carousel ── */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.slideImage}
              resizeMode="contain"
            />
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />

      {/* ── Dot indicators ── */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* ── Buttons ── */}
      <View style={styles.buttonArea}>
        {/* LOGIN + SIGNUP side by side */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push("/login")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push("/signup")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>SIGNUP</Text>
          </TouchableOpacity>
        </View>

        {/* GUEST below */}
        <TouchableOpacity
          style={styles.btnGuest}
          onPress={() => router.push("/home")}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>GUEST</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },

  // Header
  header: {
    alignItems: "center",
    marginTop: 48,
    height: 100,
    justifyContent: "center",
  },
  headerIcon: {
    width: 200,
    height: 200,
  },

  // Carousel
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40
  },
  slideImage: {
    width: 220,
    height: 220,
  },
  caption: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 26,
    fontFamily: "System",
    textTransform: "uppercase",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D9D9D9",
  },
  dotActive: {
    backgroundColor: "#F5A623",
    width: 20,
  },

  // Buttons
  buttonArea: {
    width: "100%",
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 12,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGuest: {
    width: "55%",
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1,
  },
});