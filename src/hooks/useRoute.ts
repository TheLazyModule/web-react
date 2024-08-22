import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";

interface Route {
    distance: number;
    paths: { name: string, geom: string, geom_geographic: string }[];
}

const apiClient = new APIClient<Route>("/all/route");

const useRoute = () => {
    const locationQuery = useLocationQueryStore(s => s.locationQuery);


    const enabled = !!locationQuery.from?.name && !!locationQuery.to?.name && (locationQuery.from.name !== locationQuery.to.name);

    return useQuery<Route>(
        {
            queryKey: ['route', locationQuery],
            queryFn: () => {
                if (locationQuery.from && locationQuery.to) {
                    return apiClient.getAll({
                        params: {
                            from: locationQuery.from.name,
                            from_location: locationQuery.from_location,
                            to: locationQuery.to.name
                        }
                    });
                }
                return Promise.resolve({distance: 0, paths: []}); // Return an empty Route object if condition not met
            },
            staleTime: 0,
            retry: 2,
            enabled: enabled
        }
    );
};

export default useRoute;
