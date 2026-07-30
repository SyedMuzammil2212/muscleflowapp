import { NativeModules, TurboModuleRegistry } from "react-native";
import Toast from "react-native-toast-message";

let GoogleSignin: typeof import("@react-native-google-signin/google-signin").GoogleSignin | null = null;
let isErrorWithCode: typeof import("@react-native-google-signin/google-signin").isErrorWithCode | null = null;
let statusCodes: typeof import("@react-native-google-signin/google-signin").statusCodes | null = null;
let isConfigured = false;

function initGoogleSignin(): boolean {
    if (isConfigured) return true;

    try {
        const hasNativeModule = !!(
            NativeModules.RNGoogleSignin ||
            (TurboModuleRegistry && TurboModuleRegistry.get("RNGoogleSignin"))
        );

        if (!hasNativeModule) {
            return false;
        }

        const googleSigninModule = require("@react-native-google-signin/google-signin");
        GoogleSignin = googleSigninModule.GoogleSignin;
        isErrorWithCode = googleSigninModule.isErrorWithCode;
        statusCodes = googleSigninModule.statusCodes;

        GoogleSignin?.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID!,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID!,
            offlineAccess: true,
            scopes: ["profile", "email"],
        });

        isConfigured = true;
        return true;
    } catch (e) {
        console.warn("Failed to initialize GoogleSignin module:", e);
        return false;
    }
}

export default function useGoogleAuth() {
    const signInWithGoogle = async (): Promise<string | null> => {
        const available = initGoogleSignin();
        if (!available || !GoogleSignin) {
            Toast.show({
                type: "error",
                text1: "Google Sign-In Unavailable",
                text2: "Expo Go does not support Google Sign-In. Use 'npx expo run:ios' for a development build.",
            });
            console.warn(
                "Google Sign-In is not supported in Expo Go. You must use a Development Build (npx expo run:ios or npx expo run:android)."
            );
            return null;
        }

        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();

            if (response.type === "success") {
                const idToken = response.data.idToken;
                console.log("Google ID Token:", idToken);
                return idToken;
            }

            console.log("Google Sign-In cancelled or failed:", response.type);
            return null;
        } catch (error) {
            if (isErrorWithCode && isErrorWithCode(error)) {
                if (statusCodes) {
                    switch (error.code) {
                        case statusCodes.SIGN_IN_CANCELLED:
                            console.log("User cancelled sign-in");
                            break;
                        case statusCodes.IN_PROGRESS:
                            console.log("Sign-in already in progress");
                            break;
                        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                            console.log("Play services not available");
                            break;
                        default:
                            console.log("Google Sign-In error:", error.code, (error as any).message);
                    }
                }
            } else {
                console.log("Unknown error during Google Sign-In:", error);
            }
            return null;
        }
    };

    return {
        signInWithGoogle,
    };
}