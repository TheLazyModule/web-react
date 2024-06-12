import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";

export interface SearchLocation {
    name: string;
}

const apiClient = new APIClient<SearchLocation>("/all/location/search");

const useLocation = () => {
    const locationName = useLocationQueryStore(s => s.locationName);

    const enabled = !!locationName && locationName.length >= 2;

    return useQuery<SearchLocation>(
        {
            queryKey: ['location', locationName],
            queryFn: () => {
                if (locationName && locationName.length >= 2) {
                    return apiClient.getAll({
                        params: {
                            name: locationName
                        }
                    });
                }
                return Promise.resolve({name: ""}); // Return an empty Route object if condition not met
            },
            staleTime: 0,
            retry: 3,
            enabled: enabled
        }
    );
};
export default useLocation;
