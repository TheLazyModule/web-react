import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import ms from 'ms';


const apiClient = new APIClient<Option[]>("/all/search");

export interface Option {
    id: string;
    name: string;
}

const UseSearchTextTo = () => {
    const searchTextTo = useLocationQueryStore(s => s.searchTextTo);

    return useQuery<Option[]>(
        {
            queryKey: ['searchTo', searchTextTo],
            queryFn: () => apiClient.getAll({
                params: {
                    text: searchTextTo && searchTextTo.length > 3 ? searchTextTo : undefined
                }
            }),
            staleTime: ms('60d'),
            retry: 5
        })
};

export default UseSearchTextTo;
