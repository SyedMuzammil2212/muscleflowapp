import * as Google from "expo-auth-session/providers/google";

export default function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "1068967662543-576l8t4i8es99vr8vn43livb5bm1f87h.apps.googleusercontent.com",
        iosClientId: "1068967662543-1hbblo4s2h1m5q7amr9kv9hng867j2ur.apps.googleusercontent.com",
        webClientId: "1068967662543-p1onaptmgh42jnlevbce5ojuhh2kp2be.apps.googleusercontent.com",
    });

    return {
        request,
        response,
        signInWithGoogle: () => promptAsync(),
    };
}