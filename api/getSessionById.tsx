import axiosInstance from "./axiosinstance";
const GetSessionById = async (token: string, sessionId: number) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.get(`/workout/session/${sessionId}`, {
            headers,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        return null;
    }
};
export default GetSessionById;