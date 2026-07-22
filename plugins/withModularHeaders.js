const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Expo config plugin that adds `use_modular_headers!` to the iOS Podfile.
 * Required for @react-native-google-signin/google-signin because the Swift pod
 * `AppCheckCore` depends on `GoogleUtilities` and `RecaptchaInterop`, which need
 * modular headers to be imported from Swift when built as static libraries.
 */
function withModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );

      let podfileContent = fs.readFileSync(podfilePath, "utf8");

      // Add use_modular_headers! after prepare_react_native_project! if not already present
      if (!podfileContent.includes("use_modular_headers!")) {
        podfileContent = podfileContent.replace(
          "prepare_react_native_project!",
          "prepare_react_native_project!\n\nuse_modular_headers!"
        );
        fs.writeFileSync(podfilePath, podfileContent);
      }

      return config;
    },
  ]);
}

module.exports = withModularHeaders;
