import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import ms from 'ms';

const apiClient = new APIClient<Option[]>("/all/search");

export interface Option {
    id: string;
    name: string;
}

const UseSearchTextFrom = () => {
    const searchTextFrom = useLocationQueryStore(s => s.searchTextFrom);

    return useQuery<Option[]>({
        queryKey: ['searchFrom', searchTextFrom],
        queryFn: () => {
            if (searchTextFrom && searchTextFrom.length >= 2) {
                return apiClient.getAll({
                    params: {
                        text: searchTextFrom
                    }
                });
            }
            return Promise.resolve([]); // Return an empty array if condition not met
        },
        staleTime: ms('10m'),
        retry: 5,
        enabled: !!searchTextFrom && searchTextFrom.length >= 2 // Ensure this is a boolean
    });
};

export default UseSearchTextFrom;
