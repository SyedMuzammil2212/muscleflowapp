import axiosInstance from "./axiosinstance";

const changePassword = async (token: string, currentPassword: string, newPassword: string) => {
    const headers = { authorization: `Bearer ${token}` };
    try {
        const response = await axiosInstance.post("/user/changepassword", { currentPassword, newPassword }, { headers });
        return response.data;
    } catch (error: any) {
        console.log(error);
        return { error: error.response?.data?.message || "Failed to change password" };
    }
};

export default changePassword;
