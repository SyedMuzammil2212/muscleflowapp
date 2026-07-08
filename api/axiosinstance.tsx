import axios from "axios";
import { baseUrl } from "./variables";

const instance = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});
export default instance;