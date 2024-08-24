import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
// import {allLocationsData} from "@/constants/allLocationsData.ts";


export interface AllLocations {
    buildings: {
        name: string;
        longitude: number;
        latitude: number;
        image_urls: null | string[];
        category_id: number;
    }[];
    places: {
        name: string;
        longitude: number;
        latitude: number;
        category_id: number;
    }[]
}

const apiClient = new APIClient<AllLocations>("/all");

const UseAllLocations = () => {

    return useQuery<AllLocations>({
        queryKey: ['all'],
        queryFn: apiClient.getAll,
       staleTime: 60 * 60,
        retry: 3,
        // initialData: allLocationsData
    })
};


export default UseAllLocations;