import * as SecureStore from "expo-secure-store";
import axiosInstance from "./axiosinstance";

const Userlogin = async (email: string, password: string) => {
    const requestdata = {
        email: email,
        password: password,
    };

    try {
        const response = await axiosInstance.post("/user/login", requestdata);

        await SecureStore.setItemAsync("token", response.data.token);

        return response.data;
    } catch (error: any) {


        return { error: error.response?.data.error || "Invalid Credentials" };
    }
};

export default Userlogin;