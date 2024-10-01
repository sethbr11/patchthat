const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

const { settings } = require("./settings/settings");

const osUsed = process.platform;

// Add iOS configuration if the OS is macOS
const iosConfig =
  osUsed === "darwin"
    ? {
        osxSign: {
          identity: settings.apple.identity,
          "hardened-runtime": true,
          entitlements: "settings/entitlements/entitlements.mac.plist",
          "entitlements-inherit":
            "settings/entitlements/entitlements.mac.plist",
          "signature-flags": "library",
          info: "settings/entitlements/Info.mac.plist",
          "pre-embed-provisioning-profile": false,
        },
        // osxNotarize: {
        //   tool: "notarytool",
        //   appleId: settings.apple.appleId,
        //   appleIdPassword: settings.apple.appleIdPassword,
        //   teamId: settings.osx.teamId,
        // },
      }
    : {};

module.exports = {
  packagerConfig: {
    asar: true,
    ...iosConfig,
  },
  rebuildConfig: {},
  makers: [
    {
      // Windows
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      // macOS
      name: "@electron-forge/maker-dmg",
      config: {},
    },
    {
      // Linux (Debian-based like Ubuntu)
      name: "@electron-forge/maker-deb",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "sethbr11",
          name: "patchthat",
        },
        prerelease: true,
        draft: false,
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
