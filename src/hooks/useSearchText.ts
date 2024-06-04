import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import ms from 'ms';


const apiClient = new APIClient<Option[]>("/all/search");

export interface Option {
    id: string;
    name: string;
}

const UseSearchText = () => {
    const searchTextFrom = useLocationQueryStore(s => s.searchTextFrom);


    return useQuery<Option[]>(
        {
            queryKey: ['searchFrom', searchTextFrom],
            queryFn: () => apiClient.getAll({
                params: {
                    text: searchTextFrom && searchTextFrom.length > 3 ? searchTextFrom : undefined
                }
            }),
            staleTime: ms('60d'),
            retry: 5
        })
};

export default UseSearchText;