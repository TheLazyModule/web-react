import {useQuery} from "@tanstack/react-query";
import APIClient, {All} from "@/services/apiClient.ts";

const apiClient = new APIClient<All>("/all/route")

const useAll = () =>
    useQuery<All>({
        queryKey: ['all'],
        queryFn: () => apiClient.getAll({
            params: {
                from: "from",
                to: "to"
            }
        })
    })

export default useAll;