
import axiosInstance from "./axiosinstance";

const VerifyOtp = async (email: string, otp: string) => {
    const requestdata = {
        email: email,
        otp: otp
    };

    try {
        const response = await axiosInstance.post("/user/verifyotp", requestdata);

        return response.data;
    } catch (error: any) {


        return { error: error.response?.data.error || "Invalid Credentials" };
    }
};

export default VerifyOtp;