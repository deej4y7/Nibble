import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
  PanResponder,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withSpring,
  withDelay,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// ---------------------------------------------------------------------------
// Animated SVG components
// ---------------------------------------------------------------------------
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ---------------------------------------------------------------------------
// STEP 1 — Sign Up Form
// ---------------------------------------------------------------------------
type FormErrors = {
  email?: string;
  phone?: string;
  nickname?: string;
  password?: string;
  confirmPassword?: string;
};

function SignUpForm({ onNext }: { onNext: (nickname: string) => void }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [focused, setFocused] = useState<string | null>(null);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid Email";
    if (!phone || phone.length < 7) newErrors.phone = "Invalid Phone Number";
    if (!nickname || nickname.length < 3)
      newErrors.nickname = "Invalid Nickname";
    if (!password || password.length < 6)
      newErrors.password = "Invalid Password";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Password Does not Match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validate()) onNext(nickname);
  };

  const inputStyle = (field: string, hasError?: string) => [
    styles.input,
    focused === field && styles.inputFocused,
    hasError && styles.inputError,
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.formRoot}>
          <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

          {/* Email */}
          <TextInput
            style={inputStyle("email", errors.email)}
            placeholder="Email"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors((e) => ({ ...e, email: undefined }));
            }}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Phone with +63 prefix */}
          <View
            style={[
              styles.phoneRow,
              focused === "phone" && styles.inputFocused,
              errors.phone && styles.inputError,
              { marginBottom: errors.phone ? 0 : 15 },
            ]}
          >
            <TouchableOpacity style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+63 ▾</Text>
            </TouchableOpacity>
            <View style={styles.phoneDivider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#AAAAAA"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setErrors((e) => ({ ...e, phone: undefined }));
              }}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused(null)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          {/* Nickname */}
          <TextInput
            style={inputStyle("nickname", errors.nickname)}
            placeholder="Nickname"
            placeholderTextColor="#AAAAAA"
            value={nickname}
            onChangeText={(t) => {
              setNickname(t);
              setErrors((e) => ({ ...e, nickname: undefined }));
            }}
            onFocus={() => setFocused("nickname")}
            onBlur={() => setFocused(null)}
          />
          {errors.nickname && (
            <Text style={styles.errorText}>{errors.nickname}</Text>
          )}

          {/* Password */}
          <TextInput
            style={inputStyle("password", errors.password)}
            placeholder="Password"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setErrors((e) => ({ ...e, password: undefined }));
            }}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {/* Confirm Password */}
          <TextInput
            style={inputStyle("confirm", errors.confirmPassword)}
            placeholder="Confirm Password"
            placeholderTextColor="#AAAAAA"
            value={confirmPassword}
            onChangeText={(t) => {
              setConfirm(t);
              setErrors((e) => ({ ...e, confirmPassword: undefined }));
            }}
            onFocus={() => setFocused("confirm")}
            onBlur={() => setFocused(null)}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          {/* SIGNUP button */}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleSignup}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>SIGNUP</Text>
          </TouchableOpacity>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.btnSocial, { flex: 1 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>CONTINUE WITH{"\n"}GOOGLE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSocial, { flex: 1 }]}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>CONTINUE WITH{"\n"}APPLE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// STEP 2 — Preferences (Budget Slider + Cravings)
// ---------------------------------------------------------------------------

// ── Budget Slider ────────────────────────────────────────────────────────────
// The SLIDER_PADDING must match the horizontal padding of the screen (32 * 2)
// so the track width calculation is accurate.
const SCREEN_PADDING = 64;
const LABEL_WIDTH = 36; // width reserved for "50" and "500+" labels
const TRACK_WIDTH = width - SCREEN_PADDING - LABEL_WIDTH * 2 - 16; // 16 = gap

const MIN_BUDGET = 50;
const MAX_BUDGET = 500;

function BudgetSlider() {
  // thumbX is the pixel position of the thumb along the track (0 to TRACK_WIDTH)
  const [thumbX, setThumbX] = useState(0);
  // budget is the computed ₱ value from thumbX
  const [budget, setBudget] = useState(MIN_BUDGET);
  // isDragging controls visibility of the budget bubble above the thumb
  const [isDragging, setIsDragging] = useState(false);

  // trackX stores the measured left edge of the track on screen
  // so we can convert absolute touch positions to track-relative positions
  const trackRef = useRef<View>(null);
  const trackLeft = useRef(0);

  // Measure the track's position on screen when it mounts
  const measureTrack = () => {
    trackRef.current?.measure((_x, _y, _w, _h, pageX) => {
      trackLeft.current = pageX;
    });
  };

  // Convert a raw touch pageX to a clamped thumb position and budget value
  const updateFromTouch = (pageX: number) => {
    const relative = pageX - trackLeft.current;
    const clamped = Math.max(0, Math.min(relative, TRACK_WIDTH));
    const value = Math.round(
      MIN_BUDGET + (clamped / TRACK_WIDTH) * (MAX_BUDGET - MIN_BUDGET),
    );
    setThumbX(clamped);
    setBudget(value);
  };

  // PanResponder handles drag gestures on the thumb
  // 👶 Think of PanResponder like an event listener for drag movements.
  //    onPanResponderGrant = finger touched down
  //    onPanResponderMove  = finger is moving
  //    onPanResponderRelease = finger lifted
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        updateFromTouch(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => {
        updateFromTouch(evt.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    }),
  ).current;

  // Percentage 0–100 used for the fill width
  const fillPercent = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{MIN_BUDGET}</Text>

      {/* Track — measure its position on mount/layout */}
      <View ref={trackRef} style={styles.sliderTrack} onLayout={measureTrack}>
        {/* Orange filled portion */}
        <View style={[styles.sliderFill, { width: `${fillPercent}%` }]} />

        {/* Draggable thumb + floating bubble below it */}
        <View
          style={[styles.thumbContainer, { left: thumbX - 9 }]}
          {...panResponder.panHandlers}
        >
          {/* The actual dot thumb */}
          <View style={styles.sliderThumb} />

          {/* Budget bubble — only visible while dragging */}
          {isDragging && (
            <View style={styles.budgetBubble}>
              <Text style={styles.budgetValue}>₱{budget}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.sliderLabel}>500+</Text>
    </View>
  );
}

// ── Craving Item ─────────────────────────────────────────────────────────────

// Each craving has two image sources:
//   - imageDefault: orange icon on transparent background (unselected state)
//   - imageActive:  white icon on transparent background (selected state, circle turns orange)
//
// 👇 REPLACE the require() paths below with your actual image assets
const CRAVINGS = [
  {
    id: "homemade",
    label: "Homemade",
    // Default state image: orange icon outline
    imageDefault: require("../../assets/images/signup_assets/homemade_default.png"),
    // Active state image: white icon outline (shown when circle is orange)
    imageActive: require("../../assets/images/signup_assets/homemade_active.png"),
  },
  {
    id: "restaurant",
    label: "Restaurant",
    imageDefault: require("../../assets/images/signup_assets/restaurant_default.png"),
    imageActive: require("../../assets/images/signup_assets/restaurant_active.png"),
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    imageDefault: require("../../assets/images/signup_assets/vegetarian_default.png"),
    imageActive: require("../../assets/images/signup_assets/vegetarian_active.png"),
  },
  {
    id: "healthy",
    label: "Healthy Diet",
    imageDefault: require("../../assets/images/signup_assets/healthy_diet_default.png"),
    imageActive: require("../../assets/images/signup_assets/healthy_diet_active.png"),
  },
  {
    id: "comfort",
    label: "Comfort",
    imageDefault: require("../../assets/images/signup_assets/comfort_default.png"),
    imageActive: require("../../assets/images/signup_assets/comfort_active.png"),
  },
  {
    id: "fastfood",
    label: "Fast Food",
    imageDefault: require("../../assets/images/signup_assets/fast_food_default.png"),
    imageActive: require("../../assets/images/signup_assets/fast_food_active.png"),
  },
];

function Preferences({ onShowSocialSync }: { onShowSocialSync: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCraving = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.formRoot}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      {/* Budget section */}
      <Text style={styles.prefTitle}>Set Budget</Text>
      <BudgetSlider />

      {/* Cravings section */}
      <Text style={[styles.prefTitle, { marginTop: 65 }]}>Cravings?</Text>
      <View style={styles.cravingsGrid}>
        {CRAVINGS.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.cravingItem}
              onPress={() => toggleCraving(item.id)}
              activeOpacity={0.8}
            >
              {/*
               * Circle turns orange when selected.
               * Image swaps between default (orange icon) and active (white icon).
               * The image fills the circle — make sure your PNG has a
               * transparent background and the icon is centered.
               */}
              <View
                style={[
                  styles.cravingCircle,
                  isSelected && styles.cravingCircleActive,
                ]}
              >
                <Image
                  source={isSelected ? item.imageActive : item.imageDefault}
                  style={styles.cravingIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.cravingLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LEZGO button */}
      <TouchableOpacity
        style={styles.btnLezgo}
        onPress={onShowSocialSync}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>LEZGO</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Social Sync Modal
// ---------------------------------------------------------------------------
function SocialSyncModal({
  visible,
  onSkip,
}: {
  visible: boolean;
  onSkip: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Sync from{"\n"}other socials</Text>

          <View style={styles.socialIconsRow}>
            {/*
             * REPLACE each Image source below with your actual social icons.
             * Recommended: use PNG icons with transparent backgrounds.
             * Suggested filenames:
             *   assets/images/icon-facebook.png
             *   assets/images/icon-instagram.png
             *   assets/images/icon-tiktok.png
             */}

            {/* Facebook */}
            <TouchableOpacity style={styles.socialIconBtn} activeOpacity={0.8}>
              <Image
                source={require("../../assets/images/signup_assets/facebook.png")}
                style={styles.socialIconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Instagram */}
            <TouchableOpacity style={styles.socialIconBtn} activeOpacity={0.8}>
              <Image
                source={require("../../assets/images/signup_assets/instagram.png")}
                style={styles.socialIconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* TikTok */}
            <TouchableOpacity style={styles.socialIconBtn} activeOpacity={0.8}>
              <Image
                source={require("../../assets/images/signup_assets/tiktok.png")}
                style={styles.socialIconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btnSkip}
            onPress={onSkip}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>SKIP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// STEP 3 — Success Screen with traced SVG checkmark
// ---------------------------------------------------------------------------
function SuccessScreen({ nickname }: { nickname: string }) {
  const CIRCLE_LENGTH = 283;
  const CHECK_LENGTH = 150;

  const circleDash = useSharedValue(CIRCLE_LENGTH);
  const checkDash = useSharedValue(CHECK_LENGTH);
  const scale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Draw circle stroke
    circleDash.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    // 2. Trace checkmark after circle is drawn
    checkDash.value = withDelay(
      500,
      withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );
    // 3. Scale bounce
    scale.value = withDelay(
      1100,
      withSpring(1, { damping: 8, stiffness: 100 }),
    );
    // 4. Fade in text
    textOpacity.value = withDelay(1300, withTiming(1, { duration: 400 }));
  }, []);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circleDash.value,
  }));
  const animatedCheckProps = useAnimatedProps(() => ({
    strokeDashoffset: checkDash.value,
  }));
  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const animatedText = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.successRoot}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <Animated.View style={[styles.checkWrapper, animatedScale]}>
        <Svg width={160} height={160} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="45" fill="#F5A623" />
          <AnimatedCircle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#F5A623"
            strokeWidth={4}
            strokeDasharray={CIRCLE_LENGTH}
            animatedProps={animatedCircleProps}
            transform="rotate(-90 50 50)"
          />
          <AnimatedPath
            d="M 25 50 L 42 67 L 75 33"
            fill="none"
            stroke="white"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={CHECK_LENGTH}
            animatedProps={animatedCheckProps}
          />
        </Svg>
      </Animated.View>

      <Animated.Text style={[styles.successText, animatedText]}>
        SUCCESSFUL SIGN UP!{"\n"}
        {nickname.toUpperCase()}
      </Animated.Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Signup Screen
// ---------------------------------------------------------------------------
export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [showSocialSync, setShowSocialSync] = useState(false);

  useEffect(() => {
    if (step !== 3) return;
    const timer = setTimeout(() => router.replace("/home"), 3000);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      {step === 1 && (
        <SignUpForm
          onNext={(name) => {
            setNickname(name);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <>
          <Preferences onShowSocialSync={() => setShowSocialSync(true)} />
          <SocialSyncModal
            visible={showSocialSync}
            onSkip={() => {
              setShowSocialSync(false);
              setStep(3);
            }}
          />
        </>
      )}

      {step === 3 && <SuccessScreen nickname={nickname} />}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  // ── Step 1: Form ──
  formRoot: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 48,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#F5A623",
    backgroundColor: "#FFF",
  },
  inputError: {
    borderColor: "#E53935",
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "#E53935",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 12,
  },
  phoneRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 50,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  countryCodeText: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#CCCCCC",
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#1A1A1A",
  },
  btnPrimary: {
    width: "60%",
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  btnSocial: {
    backgroundColor: "#F5A623",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.8,
    textAlign: "center",
  },

  // ── Step 2: Preferences ──

  prefRoot: {
    flexGrow: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 48,
  },
  prefTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    textAlign: "center",
  },

  // Slider
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#888",
    width: LABEL_WIDTH,
    textAlign: "center",
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    // overflow hidden would clip the thumb, so we leave it visible
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 6,
    backgroundColor: "#F5A623",
    borderRadius: 3,
  },
  // thumbContainer is positioned absolutely on the track
  // It holds both the bubble and the dot so they move together
  thumbContainer: {
    position: "absolute",
    top: -6,
    flex:1,
    alignItems: "center"
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F5A623",
  },
  // Budget bubble appears above the thumb only while dragging
  budgetBubble: {
    backgroundColor: "#1A1A1A",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
    marginTop: 7,
  },
  budgetValue: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  // Cravings
  cravingsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginBottom: 32,
    width: "100%",
  },
  cravingItem: {
    alignItems: "center",
    width: "40%",
  },
  cravingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0", // gray when unselected
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cravingCircleActive: {
    backgroundColor: "#F5A623", // orange when selected
  },
  cravingIcon: {
    width: 44,
    height: 44,
  },
  cravingLabel: {
    fontSize: 13,
    color: "#1A1A1A",
    fontWeight: "500",
    textAlign: "center",
  },
  btnLezgo: {
    width: "55%",
    backgroundColor: "#F5A623",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },

  // ── Social Sync Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "75%",
    gap: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 26,
  },
  socialIconsRow: {
    flexDirection: "row",
    gap: 16,
  },
  socialIconBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIconImage: {
    width: 30,
    height: 30,
  },
  btnSkip: {
    width: "80%",
    backgroundColor: "#F5A623",
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
  },

  // ── Step 3: Success ──
  successRoot: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  checkWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 28,
  },
});
