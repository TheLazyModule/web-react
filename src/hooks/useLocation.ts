import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import ms from 'ms';

const apiClient = new APIClient<Option[]>("/all/search");

export interface Option {
    id: string;
    name: string;
}

const useLocation = () => {
    const locationName = useLocationQueryStore(s => s.locationName);

    return useQuery<Option[]>({
        queryKey: ['location', locationName],
        queryFn: () => {
            if (locationName && locationName.length >= 2) {
                return apiClient.getAll({
                    params: {
                        text: locationName
                    }
                });
            }
            return Promise.resolve([]); // Return an empty array if condition not met
        },
        staleTime: ms('60d'),
        retry: 3,
        enabled: !!locationName && locationName.length >= 2 // Ensure this is a boolean
    });
};

export default useLocation;
