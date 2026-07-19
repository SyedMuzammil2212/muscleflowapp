import axiosInstance from "./axiosinstance";

type LogSetPayload = {
    log_session_id: number;
    exercise_id: number;
    muscle_group_id: number;
    set_number: number;
    weight: number;
    reps: number;
};

const LogSet = async (token: string, data: LogSetPayload) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.post("/workout/set", data, { headers });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default LogSet;
