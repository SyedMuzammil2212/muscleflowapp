import axiosInstance from "./axiosinstance";

const getUser = async (token: string) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.get("/user/getuser", {
            headers,
        });

        return response.data.user;
    } catch (error: any) {
        console.log("getUser error:", error?.response?.status, error?.message);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            return { isUnauthorized: true };
        }
        return { isNetworkError: true };
    }
};

export default getUser;