# RNCalendarApp

A React Native calendar app with Firebase authentication and Firestore event storage.

## Prerequisites

Before running the app, set up your development environment using the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

You will need:

- **Node.js** >= 22.11.0
- **npm** (or Yarn)
- **Xcode** and **CocoaPods** (for iOS, macOS only)
- **Android Studio** and an Android SDK (for Android)

Firebase config files are already included in the repo:

- `android/app/google-services.json`
- `ios/GoogleService-Info.plist`

## Install dependencies

From the project root:

```sh
npm install
```

## iOS setup (first time or after native dependency changes)

Install CocoaPods via Bundler:

```sh
bundle install
```

Install iOS pods:

```sh
cd ios && bundle exec pod install && cd ..
```

## Run the app

### Option 1: One command (recommended)

**iOS Simulator**

```sh
npm run ios
```

**Android Emulator**

```sh
npm run android
```

These commands start Metro and build/launch the app on the default simulator or emulator.

### Option 2: Separate Metro and native build

**Terminal 1 — start Metro**

```sh
npm start
```

**Terminal 2 — run the app**

```sh
npm run ios
# or
npm run android
```

You can also open `ios/RNCalendarApp.xcworkspace` in Xcode or the `android` folder in Android Studio and run from there.

## Other scripts

```sh
npm test      # Run unit tests
npm run lint  # Run ESLint
```

## Troubleshooting

- **Metro cache issues:** `npm start -- --reset-cache`
- **iOS build failures after dependency updates:** run `bundle exec pod install` again inside `ios/`
- **Android build failures:** try `cd android && ./gradlew clean && cd ..`
- See the [React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting) for more help
