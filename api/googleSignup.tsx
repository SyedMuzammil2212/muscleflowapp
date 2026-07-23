import * as SecureStore from "expo-secure-store";
import axiosInstance from "./axiosinstance";

const GoogleSignUp = async (idToken: string) => {
    const requestdata = {
        idToken: idToken
    };

    try {
        const response = await axiosInstance.post("/user/auth/google/signup", requestdata);

        await SecureStore.setItemAsync("token", response.data.token);

        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || error.response?.data?.error || "Invalid Credentials" };
    }
};

export default GoogleSignUp;