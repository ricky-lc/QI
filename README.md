# ⚡ QI — Intelligence Measurement App

A fully functional **Expo** app that measures multiple forms of intelligence through adaptive short tests, rendered with a modern **pastel glassmorphism** (liquid-glass) aesthetic. Runs entirely client-side with no backend.

---

## ✨ Features

### 🧠 Intelligence Tests
| Category | Description |
|---|---|
| **Logical Reasoning** | Syllogisms, deductive & inductive reasoning |
| **Spatial Intelligence** | 3×3 logic-matrix puzzles generated as inline SVG at runtime |
| **Working Memory** | Sequence retention, recall challenges |
| **Pattern Recognition** | Number series, shape sequences, analogies |
| **Verbal Intelligence** | Antonyms, analogies, vocabulary |
| **Numerical Reasoning** | Arithmetic, series completion, word problems |
| **Full IQ Assessment** | All categories combined (~40 min) |

### 🎯 Adaptive Question Engine
Questions dynamically adjust difficulty based on your performance:
- Correct answers consecutively → difficulty increases
- Wrong answer → difficulty decreases
- Ensures the test always challenges you appropriately

### 🔷 3×3 Matrix Puzzles (SVG)
Logic-matrix puzzles are **generated locally at runtime** using pure TypeScript + SVG:
- Shape-sequence rules
- Fill-progression rules
- Size-progression rules
- Rotation-sequence rules
- Mixed rules for higher difficulty
- Rendered as inline SVG via `react-native-svg` — works on all platforms

### 🏋️ Practice Mode
- Full explanations after every answer
- Three drill types: Speed, Accuracy, Endurance
- No scoring pressure — learn at your own pace

### 📤 Export & Share Results
- Results rendered in a shareable card UI
- **Capture as PNG** via `react-native-view-shot`
- Share via native share sheet (iOS/Android) or download (Web)
- **No account required**

### 🤖 Bot Detection
Lightweight client-side signals:
- Response time too fast (< 500 ms average)
- Zero variance in timing across questions
- Perfect timing (all responses within 50 ms of each other)
- Suspicious accuracy + speed combination

### 📊 Local History & Profile
- Results saved via `@react-native-async-storage/async-storage`
- IQ score history chart per category
- Per-type averages and personal best
- Clear all data button

---

## 🎨 Design System

- **Background**: Deep indigo-purple gradients (`#0f0c29` → `#302b63` → `#24243e`)
- **Surfaces**: Glassmorphism with `expo-blur` + semi-transparent borders
- **Accents**: Pastel color palette (pink, blue, purple, green, yellow, coral)
- **Animations**: `react-native-reanimated` + native `Animated` API
- **Typography**: System fonts with heavy weights (800–900) for key figures

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install

```bash
git clone https://github.com/ricky-lc/QI.git
cd QI
npm install
```

### Run

```bash
# Web (recommended for development)
npm run web

# iOS simulator
npm run ios

# Android emulator
npm run android
```

---

## 🌐 Deploy to Vercel

This app is configured for **zero-cost Vercel deployment** using Expo Web (static export).

### Steps

1. Fork/clone this repo
2. Import into [Vercel](https://vercel.com/new)
3. Vercel auto-detects `vercel.json` — no additional configuration needed
4. Deploy!

The `vercel.json` configuration:
```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🏗️ Project Structure

```
QI/
├── App.tsx                    # Entry point
├── app.json                   # Expo configuration
├── vercel.json                # Vercel deployment config
├── src/
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types
│   ├── constants/
│   │   ├── colors.ts          # Design system (colors, gradients)
│   │   └── tests.ts           # Test configurations & IQ scale
│   ├── utils/
│   │   ├── adaptiveEngine.ts  # Adaptive question selection
│   │   ├── botDetection.ts    # Bot detection signals
│   │   ├── matrixGenerator.ts # SVG 3×3 matrix puzzle generator
│   │   ├── scoreCalculator.ts # IQ score & percentile calculation
│   │   └── storage.ts         # AsyncStorage helpers
│   ├── components/
│   │   ├── GlassCard.tsx      # Glassmorphism card surface
│   │   ├── GlassButton.tsx    # Gradient + ghost buttons
│   │   ├── ProgressBar.tsx    # Animated progress bar
│   │   ├── MatrixPuzzle.tsx   # SVG matrix + options
│   │   ├── TestTimer.tsx      # Animated countdown timer
│   │   └── ResultsChart.tsx   # Bar chart for score history
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Dashboard with score & test grid
│   │   ├── TestSelectionScreen.tsx  # Pre-test info & start
│   │   ├── TestScreen.tsx     # Active test UI
│   │   ├── ResultsScreen.tsx  # Score card + share
│   │   ├── TrainingScreen.tsx # Practice mode UI
│   │   └── ProfileScreen.tsx  # History & stats
│   └── navigation/
│       └── AppNavigator.tsx   # React Navigation stack
├── assets/                    # Icons, splash screen
└── package.json
```

---

## 🔬 IQ Score Algorithm

Scores are calculated using:
1. **Accuracy ratio** — base score in 70–140 range
2. **Time factor** — faster responses slightly boost score
3. **Difficulty adjustment** — harder questions increase the ceiling

Final scores are clamped to **40–160** and mapped to percentiles using a logistic approximation of the normal distribution (mean=100, SD=15).

| IQ Range | Classification |
|---|---|
| 145+ | 🌟 Genius |
| 130–144 | ✨ Very Superior |
| 120–129 | 💎 Superior |
| 110–119 | 🚀 High Average |
| 90–109 | ⭐ Average |
| 80–89 | 🌱 Low Average |
| 70–79 | 💡 Borderline |
| <70 | 📈 Below Average |

> **Disclaimer**: This is a recreational tool, not a certified psychometric assessment. Scores are not equivalent to professionally administered IQ tests.

---

## 🛠️ Tech Stack

| Library | Purpose |
|---|---|
| Expo SDK 55 | App framework |
| React Native 0.83 | UI framework |
| TypeScript 5.9 | Type safety |
| React Navigation 6 | Routing |
| react-native-svg | SVG matrix rendering |
| expo-blur | Glassmorphism backgrounds |
| expo-linear-gradient | Gradient UI elements |
| expo-haptics | Tactile feedback |
| react-native-reanimated | Smooth animations |
| react-native-view-shot | Screenshot capture |
| expo-sharing | Native share sheet |
| @react-native-async-storage | Local data persistence |

---

## 📄 License

See [LICENSE](./LICENSE) — Proprietary. All rights reserved.

---

*Built with ❤️ using Expo + React Native + TypeScript*
