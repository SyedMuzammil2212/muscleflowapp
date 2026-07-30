import axiosInstance from "./axiosinstance";

const GetSessionsByMonth = async (token: string, year: number, month: number) => {
    const headers = { authorization: `Bearer ${token}` };
    try {
        const response = await axiosInstance.get(
            `/workout/sessions/month?year=${year}&month=${month}`,
            { headers }
        );
        return response.data?.sessions ?? [];
    } catch (error) {
        console.log(error);
        return [];
    }
};

export default GetSessionsByMonth;
