import { ConfigContext, ExpoConfig } from "@expo/config"

export default ({config}:ConfigContext):ExpoConfig=>({
  ...config,
  name: "Kimyona",
  slug: "Kimyona",
  owner: "trollboi",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  extra: {
    eas:{
      projectId:"2b96e393-5dbf-446e-8511-4ae13dc4646a"
    }
  },
  ios: {
    userInterfaceStyle:'automatic',
    supportsTablet: true
  },
android: {
  userInterfaceStyle:'automatic',
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.trollboi.Kimyona",
    permissions:['USE_FULL_SCREEN_INTENT']
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins:[
    ["expo-build-properties", {
    android: {
      "extraMavenRepos": [
        "../../node_modules/@notifee/react-native/android/libs"
        ]
    },
    ios: {  }
  }],
"./plugins/withFullScreenComponent/index.js",
[
  "expo-notifications",
  {
    "sounds": ["./assets/sounds/adiojori.mp3"]
  }
]
]
})