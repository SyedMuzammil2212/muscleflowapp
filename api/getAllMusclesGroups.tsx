import axiosInstance from "./axiosinstance";
const GetAllMuscleGroups = async (token: string) => {
    const headers = {
        authorization: `Bearer ${token}`,
    };
    try {
        const response = await axiosInstance.get("/muscle/getmuscles", {
            headers,
        });

        return response.data;
    } catch (error) {
        console.log(error);

        return null;
    }
};
export default GetAllMuscleGroups;