import {useQuery} from "@tanstack/react-query";
import APIClient from "@/services/apiClient.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";

interface Route {
    distance: number;
    path: { name: string, geom: string, geom_geographic: string }[];
}

const apiClient = new APIClient<Route>("/all/route");


const useRoute = () => {
    const locationQuery = useLocationQueryStore(s => s.locationQuery);

    return useQuery<Route>(
        {
            queryKey: ['route', locationQuery],
            queryFn: () => apiClient.getAll({
                params: {
                    from: locationQuery.from,
                    to: locationQuery.to,
                }
            }),
            staleTime: 0,
            retry: 2
        })
};

export default useRoute;
