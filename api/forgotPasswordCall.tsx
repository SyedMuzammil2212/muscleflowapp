
import axiosInstance from "./axiosinstance";

const ForgotPassCall = async (email: string) => {
    const requestdata = {
        email: email,
    };

    try {
        const response = await axiosInstance.post("/user/forgotpassword", requestdata);

        return response.data;
    } catch (error: any) {


        return { error: error.response?.data.error || "Invalid Credentials" };
    }
};

export default ForgotPassCall;