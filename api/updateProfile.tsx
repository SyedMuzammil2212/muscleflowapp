import axiosInstance from "./axiosinstance";

const updateProfile = async (token: string, username: string) => {
    const headers = { authorization: `Bearer ${token}` };
    try {
        const response = await axiosInstance.patch("/user/updateprofile", { username }, { headers });
        return response.data;
    } catch (error: any) {
        console.log(error);
        return { error: error.response?.data?.message || "Failed to update profile" };
    }
};

export default updateProfile;
