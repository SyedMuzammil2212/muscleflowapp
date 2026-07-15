import axiosInstance from "./axiosinstance";

const CreateUser = async (email: string, username: string) => {
    const requestdata = {
        username: username,
        email: email,
    };

    try {
        const response = await axiosInstance.post("/user/createuser", requestdata);

        return response.data;
    } catch (error: any) {
        console.log(error.response?.data.message)
        return { message: error.response?.data.message || "Invalid Credentials" };
    }
};

export default CreateUser;