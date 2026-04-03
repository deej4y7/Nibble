import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Carousel slide data
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
    caption: "FAST APP AND EASY DELIVERY (MAY VARY)",
  },
];

// ---------------------------------------------------------------------------
// SlidingDot
// Each dot watches the carousel's live scroll progress and smoothly
// grows/shrinks in real time as the user drags — not just on snap.
// ---------------------------------------------------------------------------
function SlidingDot({
  index,
  progressValue,
  total,
}: {
  index: number;
  progressValue: SharedValue<number>;
  total: number;
}) {
  const animStyle = useAnimatedStyle(() => {
    // How far is this dot from the current scroll position?
    // e.g. if progress = 1.4 and this dot is index 1, distance = 0.4
    // We use modulo (%) so it works correctly with looping
    const distance = Math.abs((progressValue.value % total) - index);

    // Map distance → width:  0 = active (20px),  1 = inactive (8px)
    const dotWidth = interpolate(
      distance,
      [0, 1],
      [20, 8],
      Extrapolation.CLAMP,
    );

    // Map distance → opacity:  0 = fully visible,  1 = faded
    const opacity = interpolate(
      distance,
      [0, 1],
      [1, 0.3],
      Extrapolation.CLAMP,
    );

    return { width: dotWidth, opacity };
  });

  return <Animated.View style={[styles.dot, animStyle]} />;
}

// ---------------------------------------------------------------------------
// Onboarding Screen
// ---------------------------------------------------------------------------
export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // progressValue tracks the exact scroll position of the carousel in real time
  // It starts at 0 and becomes 1.0, 2.0, 3.0 etc. as you move between slides
  const progressValue = useSharedValue(0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* ── Header: logo icon ── */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.headerIcon}
          resizeMode="contain"
        />
      </View>

      {/* ── Carousel ── */}
      <View style={{ flex: 1 }}>
        <Carousel
          loop
          width={width}
          height={width * 1.2}
          autoPlay={true}
          autoPlayInterval={3000}
          data={SLIDES}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setActiveIndex(index)}
          onProgressChange={(_, absoluteProgress) => {
            // absoluteProgress updates every frame as the user drags
            // This is what drives the dot animation in real time
            progressValue.value = absoluteProgress;
          }}
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
      </View>

      {/* ── Sliding dot indicators ── */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <SlidingDot
            key={i}
            index={i}
            progressValue={progressValue}
            total={SLIDES.length}
          />
        ))}
      </View>

      {/* ── Buttons ── */}
      <View style={styles.buttonArea}>
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  // Header
  header: {
    alignItems: "center",
    height: 160,
    justifyContent: "center",
  },
  headerIcon: {
    width: 160,
    height: 160,
  },

  // Carousel
  slide: {
    marginTop: 28,
    marginBottom: 28,
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  slideImage: {
    width: 240,
    height: 240,
  },
  caption: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 26,
    textTransform: "uppercase",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F5A623",
  },

  // Buttons
  buttonArea: {
    width: "100%",
    paddingHorizontal: 22,
    paddingBottom: 38,
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
