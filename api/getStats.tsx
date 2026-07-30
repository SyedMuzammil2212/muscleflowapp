import axiosInstance from "./axiosinstance";

const GetStats = async (token: string) => {
    const headers = { authorization: `Bearer ${token}` };
    try {
        const response = await axiosInstance.get(`/workout/stats`, { headers });
        return response.data ?? null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default GetStats;
