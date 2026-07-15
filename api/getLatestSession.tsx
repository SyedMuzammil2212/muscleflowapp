import axiosInstance from "./axiosinstance";
const GetLatestSession = async (token: string) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.get("/workout/latestsession", {
            headers,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        return null;
    }
};
export default GetLatestSession;