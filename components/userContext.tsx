import getUser from "@/api/getUser";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState<String>("");
    const [unit, setUnitState] = useState<"kg" | "lb">("kg");

    const getUserData = async () => {
        const token1 = await SecureStore.getItemAsync("token");
        if (!token1) {
            router.push("/login")
            return;
        }
        setToken(token1 as string)
        const user = await getUser(token1 as string);
        setUser(user);
    }

    const loadUnit = async () => {
        const saved = await SecureStore.getItemAsync("unit_preference");
        if (saved === "lb") {
            setUnitState("lb");
        } else {
            setUnitState("kg"); // default
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
        <AuthContext.Provider value={{ user, setUser, token, unit, setUnit, refreshUser: getUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext)