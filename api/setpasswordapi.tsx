
import axiosInstance from "./axiosinstance";

const SetPasswordCall = async (email: string, password: string) => {
    const requestdata = {
        email: email,
        password: password
    };

    try {
        const response = await axiosInstance.post("/user/resetpassword", requestdata);

        return response.data;
    } catch (error: any) {


        return { error: error.response?.data.error || "Invalid Credentials" };
    }
};

export default SetPasswordCall;