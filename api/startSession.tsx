import axiosInstance from "./axiosinstance";

const StartSession = async (token: string) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.post("/workout/session/start", {}, { headers });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default StartSession;
