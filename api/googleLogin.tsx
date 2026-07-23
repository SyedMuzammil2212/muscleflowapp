import * as SecureStore from "expo-secure-store";
import axiosInstance from "./axiosinstance";

const GoogleLogin = async (idToken: string) => {
    const requestdata = {
        idToken: idToken
    };

    try {
        const response = await axiosInstance.post("/user/auth/google/login", requestdata);

        await SecureStore.setItemAsync("token", response.data.token);

        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || error.response?.data?.error || "Invalid Credentials" };
    }
};

export default GoogleLogin;