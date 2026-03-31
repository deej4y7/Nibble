# 🍔 Nibble — Fast Food Social App

> *"Make food discovery fast, fun, and social — like sharing with your friends about your cravings."*

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Built With](https://img.shields.io/badge/built%20with-Expo%20%7C%20React%20Native-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 About the Project

**Nibble** is a minimalist, humor-infused mobile app designed for Gen Z users that combines fast food discovery, quick ordering, and social sharing into one seamless experience.

This project is currently in active development as a personal and school portfolio project. It is being built screen-by-screen from a Figma design using Expo and React Native.

---

## 🎯 Target Audience

- Young adults and students, primarily **Gen Z (ages 16–29)**
- Urban dwellers seeking fast, affordable meals
- Social users who enjoy sharing food experiences online
- Users frustrated by complex or impersonal food delivery apps

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔍 **Fast Food Finder** | Discover nearby fast food spots based on mood, price, and friend activity |
| ⚡ **Quick Order & Checkout** | Minimalist one-tap ordering with Apple Pay & Google Pay integration |
| 📱 **SnackStream** | A social feed showing friends' recent orders, reviews, and food posts |
| 📤 **Food Sharing** | Share food posts to Instagram, TikTok, Facebook with auto-generated captions |
| ⭐ **Reviews & Badges** | Emoji-based rating system with user badges to encourage engagement |
| 🏆 **Most Recommended** | Dynamic trending list of eateries based on community social data |
| 👤 **Foodie Profile** | Personalized profile with favorite foods, review history, and earned badges |

---

## 🗂️ App Screens

| Screen | Status |
|--------|--------|
| Splash Screen 1 (Logo + Wordmark) | ✅ Done |
| Splash Screen 2 (Icon only) | ✅ Done |
| Onboarding / Carousel | 🔄 In Progress |
| Login | 🔜 Upcoming |
| Sign Up | 🔜 Upcoming |
| Home | 🔜 Upcoming |
| Fast Food Finder | 🔜 Upcoming |
| SnackStream Feed | 🔜 Upcoming |
| Food Detail | 🔜 Upcoming |
| Order & Checkout | 🔜 Upcoming |
| Reviews & Badges | 🔜 Upcoming |
| Foodie Profile | 🔜 Upcoming |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev/) (React Native) |
| Language | TypeScript |
| Navigation | [Expo Router](https://expo.github.io/router/) (file-based routing) |
| Styling | [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native) |
| Fonts | [Expo Google Fonts](https://github.com/expo/google-fonts) — Caveat |
| Icons/SVG | [react-native-svg](https://github.com/software-mansion/react-native-svg) |
| Backend *(planned)* | [Supabase](https://supabase.com/) — Auth, Database, Storage, Realtime |

---

## 🎨 Design

- **Tool:** Figma
- **Tone:** Casual, witty, Gen Z-friendly with humor and relatable copy
- **Palette:** Off-white background (`#FAFAFA`) with warm orange accents (`#F5A623`)
- **Typography:** Caveat (handwritten wordmark), System font (UI)
- **UI Style:** Minimalist with rounded elements, generous whitespace, and large food photography

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go](https://expo.dev/client) app on your phone
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nibble.git

# 2. Navigate into the project
cd nibble

# 3. Install dependencies
npm install

# 4. Install Expo-specific packages
npx expo install react-native-svg
npx expo install expo-font @expo-google-fonts/caveat

# 5. Start the development server
npx expo start
```

### Running on your device
1. Install **Expo Go** from the App Store or Google Play
2. Scan the QR code shown in the terminal
3. The app will load on your phone instantly

---

## 📁 Project Structure

```
nibble/
├── src/
│   └── app/                    # Expo Router screens (each file = a route)
│       ├── index.tsx           # Splash Screen 1
│       ├── splash-two.tsx      # Splash Screen 2
│       ├── onboarding.tsx      # Onboarding Carousel
│       ├── login.tsx           # Login Screen (upcoming)
│       ├── signup.tsx          # Sign Up Screen (upcoming)
│       └── home.tsx            # Home Screen (upcoming)
├── assets/
│   └── images/                 # App images and illustrations
│       ├── logo.png            # Nibble logo icon
│       ├── burger.png          # Onboarding illustration 1
│       ├── fries.png           # Onboarding illustration 2
│       └── menu.png            # Onboarding illustration 3
├── components/                 # Reusable components (upcoming)
├── constants/                  # Colors, fonts, config (upcoming)
├── app.json                    # Expo configuration
├── tailwind.config.js          # NativeWind/Tailwind config
└── package.json
```

---

## 🗺️ Roadmap

- [x] Project setup (Expo + Expo Router + NativeWind)
- [x] Splash screens
- [ ] Onboarding carousel
- [ ] Authentication screens (Login, Sign Up)
- [ ] Home screen
- [ ] Supabase backend integration
- [ ] Social feed (SnackStream)
- [ ] Ordering flow
- [ ] User profile
- [ ] EAS build for APK distribution
- [ ] App Store / Google Play submission

---

## 👨‍💻 Developer

**Donnel Jan C. Alca**
BS Information Technology — Centro Escolar University

- GitHub: [@your-github-username](https://github.com/your-github-username)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

> 🍟 *Currently being built one screen at a time. Stay tuned.*