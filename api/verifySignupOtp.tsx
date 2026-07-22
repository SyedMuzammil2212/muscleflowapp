
import axiosInstance from "./axiosinstance";

const VerifySignupOtp = async (email: string, otp: string, password: string) => {
    const requestdata = {
        email: email,
        otp: otp,
        password: password
    };

    try {
        const response = await axiosInstance.post("/user/verifyuser", requestdata);

        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || "Verification failed" };
    }
};

export default VerifySignupOtp;
