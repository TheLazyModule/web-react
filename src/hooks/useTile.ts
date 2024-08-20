import {useQuery} from "@tanstack/react-query";

const fetchTile = async ({x, y, z}: { x: number; y: number; z: number }) => {
    const response = await fetch(`https://knust-tms.intdeltas.com/tms/${z}/${x}/${y}.png`);
    if (!response.ok) {
        throw new Error('Failed to fetch tile');
    }
    return URL.createObjectURL(await response.blob());
};

const useTile = ({x, y, z}: { x: number; y: number; z: number }) => {
    return useQuery<string>(
        {
            queryKey: ['tile', {x, y, z}],
            initialData: undefined,
            queryFn: () => fetchTile({x, y, z}), // Pass the fetch function as the second argument
            staleTime: 0, // Cache tiles indefinitely
            retry: 2, // Retry fetching the tile 2 times on failure
            enabled: !!x && !!y && !!z // Ensure the query only runs when x, y, z are provided
        }
    );
};

export default useTile;
