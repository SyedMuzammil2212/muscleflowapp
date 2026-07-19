import axiosInstance from "./axiosinstance";

const EndSession = async (token: string, sessionId: number) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.patch(`/workout/session/${sessionId}/end`, {}, { headers });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default EndSession;
