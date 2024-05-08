import axios from "axios";
import {AxiosRequestConfig} from "axios";


export interface All {
    places: string[];
    buildings: string[];
}


const axiosInstance = axios.create({
    baseURL: 'http://a4571172d99e04f91b9443646f7937f0-1756610331.eu-west-1.elb.amazonaws.com/',
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

export default APIClient;