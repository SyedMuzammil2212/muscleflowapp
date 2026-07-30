import axiosInstance from "./axiosinstance";

const CreateExercise = async (token: string, name: string, muscle_group_id: number) => {
    const headers = { authorization: `Bearer ${token}` };
    try {
        const response = await axiosInstance.post(
            "/exercises/createexercise",
            { name, muscle_group_id },
            { headers }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default CreateExercise;
