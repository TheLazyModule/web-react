import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";


const apiClient = new APIClient<Option[]>("/all/search");

export interface Option {
    id: string;
    text: string;
}

const UseSearchText = () => {
    const locationQuery = useLocationQueryStore(s => s.locationQuery);

    return useQuery<Option[]>(
        {
            queryKey: ['search'],
            queryFn: () => apiClient.getAll({
                params: {
                    text: locationQuery.searchText
                }
            }),
            staleTime: 0
        })
};

export default UseSearchText;