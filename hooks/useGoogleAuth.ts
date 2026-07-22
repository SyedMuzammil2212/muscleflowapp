import {
    GoogleSignin,
    isErrorWithCode,
    statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID!,
});

export default function useGoogleAuth() {
    const signInWithGoogle = async (): Promise<string | null> => {
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
            if (isErrorWithCode(error)) {
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
                        console.log("Google Sign-In error:", error.code, error.message);
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