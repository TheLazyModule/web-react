import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";


const apiClient = new APIClient<Option[]>("/all/search");

export interface Option {
    id: string;
    name: string;
}

const UseSearchText = () => {
    const searchText = useLocationQueryStore(s => s.searchTextFrom);

    return useQuery<Option[]>(
        {
            queryKey: ['search', searchText],
            queryFn: () => apiClient.getAll({
                params: {
                    text: searchText
                }
            }),
            staleTime: 0,
            retry: 5
        })
};

export default UseSearchText;