import getUser from "@/api/getUser";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState<String>("");


    const getUserData = async () => {
        const token1 = await SecureStore.getItemAsync("token");
        setToken(token1 as string)
        const user = await getUser(token1 as string);
        setUser(user);
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext)