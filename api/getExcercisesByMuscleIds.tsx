import axiosInstance from "./axiosinstance";

const GetExercisesByMuscleIds = async (token: string, requestdata: { musclegroupids: Array<number> }) => {
    const headers = {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const response = await axiosInstance.post(
            `/exercises/getexercises/muscles`,
            requestdata,
            {
                headers,
            },
        );
        return response.data;
    } catch (error: any) {
        console.log(
            "error adding employees",
            error.response?.data || error.message,
        );
        return { error: error.response?.data?.error || "Unexpected error occured" };
    }
};

export default GetExercisesByMuscleIds;