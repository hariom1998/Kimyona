const {
  withAndroidManifest,
  withDangerousMod,
  withPlugins,
} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

// Function to add showWhenLocked and turnScreenOn to MainActivity
function withShowWhenLockedAndTurnScreenOn(expoConfig) {
  return withAndroidManifest(expoConfig, async config => {
    const mainActivity =
      config.modResults.manifest.application[0].activity.find(
        e => e['$']['android:name'] === '.MainActivity'
      )

    if (mainActivity) {
      mainActivity['$']['android:showWhenLocked'] = 'true'
      mainActivity['$']['android:turnScreenOn'] = 'true'
    }

    return config
  })
}

// Function to create a custom activity file
function withCreateCustomActivity(expoConfig) {
  return withDangerousMod(expoConfig, [
    'android',
    async config => {
      const srcPath = path.resolve(
        config.modRequest.projectRoot,
        config.modRequest.platformProjectRoot,
        'app/src/main/java/com/trollboi'
      )

      const newFolderName = 'Kimyona'
      const newFolderPath = path.resolve(srcPath, newFolderName)
      if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath)
      }

      const newFileName = 'CustomActivity.java'
      const newFileContent = `package com.trollboi.Kimyona;

import com.facebook.react.ReactActivity;

public class CustomActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    return "custom";
  }
}`
      const newFilePath = path.resolve(newFolderPath, newFileName)
      if (!fs.existsSync(newFilePath)) {
        fs.writeFileSync(newFilePath, newFileContent)
      }

      return config
    },
  ])
}

// Function to add the CustomActivity to the AndroidManifest.xml
function withCustomActivity(expoConfig) {
  return withAndroidManifest(expoConfig, async config => {
    if (
      config.modResults &&
      config.modResults.manifest &&
      config.modResults.manifest.application
    ) {
      const mainApplication = config.modResults.manifest.application[0]

      if (mainApplication && mainApplication.activity) {
        mainApplication.activity.push({
          $: {
            'android:name': 'com.trollboi.Kimyona.CustomActivity',
            'android:launchMode': 'singleTop',
            'android:exported': 'true',
            'android:showWhenLocked': 'true',
            'android:turnScreenOn': 'true',
          },
        })
      }
    } else {
      throw new Error(
        'AndroidManifest.xml not found or has an unexpected structure.'
      )
    }

    return config
  })
}

// Combine all plugins using withPlugins
module.exports = function withFullScreenComponent(config) {
  return withPlugins(config, [
    withShowWhenLockedAndTurnScreenOn,
    withCreateCustomActivity,
    withCustomActivity,
  ])
}
