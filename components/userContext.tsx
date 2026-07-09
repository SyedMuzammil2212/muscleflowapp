import getUser from "@/api/getUser";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {

    const [user, setUser] = useState(null);

    const getUserData = async () => {
        const token = await SecureStore.getItemAsync("token");
        const user = await getUser(token as string);
        setUser(user);
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext)