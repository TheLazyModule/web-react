import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import {ILocation} from "@/hooks/useLocationStore.ts";

const apiClient = new APIClient<ILocation[]>("/places");


const useBuildings = () => {
    return useQuery<ILocation[]>(
        {
            queryKey: ['places'],
            queryFn: apiClient.getAll,
            staleTime: 0,
            retry: 2
        })
};

export default useBuildings;
