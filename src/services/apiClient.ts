import axios from "axios";
import {AxiosRequestConfig} from "axios";


export interface All {
    places: string[];
    buildings: string[];
}


const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_BASE_URL,
    baseURL: 'https://routing-server-leaflet.onrender.com/',
    // baseURL: 'http://localhost:8080/',
})

class APIClient<T> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll = async (config: AxiosRequestConfig) => {
        return axiosInstance
            .get<T>(this.endpoint, config)
            .then(res => res.data)
    }
}

console.log(import.meta.env.VITE_BASE_URL)
export default APIClient;
