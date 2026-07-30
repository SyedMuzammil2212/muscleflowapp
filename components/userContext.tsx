import getUser from "@/api/getUser";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState<string>("");
    const [unit, setUnitState] = useState<"kg" | "lb">("kg");
    const [authLoading, setAuthLoading] = useState<boolean>(true);

    const getUserData = async () => {
        try {
            const storedToken = await SecureStore.getItemAsync("token");
            if (!storedToken) {
                setToken("");
                setUser(null);
                setAuthLoading(false);
                return null;
            }
            setToken(storedToken);
            const userData = await getUser(storedToken);

            if (userData?.isUnauthorized) {
                // Token explicitly rejected by backend (401/403)
                await SecureStore.deleteItemAsync("token");
                setToken("");
                setUser(null);
            } else if (userData && !userData.isNetworkError) {
                setUser(userData);
            }
            setAuthLoading(false);
            return storedToken;
        } catch (e) {
            console.log("Error loading user auth state:", e);
            setAuthLoading(false);
            return null;
        }
    };

    const loadUnit = async () => {
        try {
            const saved = await SecureStore.getItemAsync("unit_preference");
            if (saved === "lb") {
                setUnitState("lb");
            } else {
                setUnitState("kg");
            }
        } catch (e) {
            setUnitState("kg");
        }
    };

    const setUnit = async (value: "kg" | "lb") => {
        setUnitState(value);
        await SecureStore.setItemAsync("unit_preference", value);
    };

    useEffect(() => {
        getUserData();
        loadUnit();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                unit,
                setUnit,
                authLoading,
                refreshUser: getUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext);