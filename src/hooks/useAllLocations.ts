import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import ms from 'ms';


export interface AllLocations {
    places: {
        name: string;
        longitude: number;
        latitude: number;
        category_id: number;
    }[];
    buildings: {
        name: string;
        longitude: number;
        latitude: number;
        image_urls: string[];
        category_id: number;
    }[]
}

const apiClient = new APIClient<AllLocations>("/all");

const UseAllLocations = () => {

    return useQuery<AllLocations>({
        queryKey: ['all'],
        queryFn: apiClient.getAll,
        staleTime: ms('60d'),
        retry: 3
    })
};


export default UseAllLocations;