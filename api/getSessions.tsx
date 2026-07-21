import axiosInstance from "./axiosinstance";
const GetSessions = async (token: string, limit: number = 10, cursor?: number | null) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const url = cursor ? `/workout/sessions?limit=${limit}&cursor=${cursor}` : `/workout/sessions?limit=${limit}`;
        const response = await axiosInstance.get(url, {
            headers,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        return null;
    }
};
export default GetSessions;