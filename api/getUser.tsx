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
    } catch (error) {
        console.log(error);

        return null;
    }
};
export default getUser;