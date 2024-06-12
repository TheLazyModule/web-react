// usePolyline.tsx
import useRoute from "@/hooks/useRoute.ts";
import {LatLngExpression} from "leaflet";
import parse from "wellknown";
import {useEffect} from "react";
import toast from "react-hot-toast";

const UsePolyline = () => {

    const {data, isLoading, error } = useRoute();

    let polylineCoordinates: LatLngExpression[] = [];
    let lastCoordinate: LatLngExpression | null = null;
    let firstCoordinate: LatLngExpression | null = null;
    let roundedDistance: number | null = null;

    useEffect(() => {
        if (error)
            toast.error("Route not found! Please try again")
    }, [ error]);


    if (data && data.paths) {
        // Extract all points and convert to LatLngExpression
        polylineCoordinates = data.paths.map((point) => {
            const parsed = parse(point.geom_geographic);

            if (parsed && parsed.type === "Point" && parsed.coordinates.length === 2) {
                // Swap from [longitude, latitude] to [latitude, longitude]
                const [longitude, latitude] = parsed.coordinates;
                return [latitude, longitude] as LatLngExpression;
            }

            return null;
        }).filter(Boolean) as LatLngExpression[];

        // Set the last coordinate and round the distance
        lastCoordinate = polylineCoordinates.length > 0 ? polylineCoordinates[polylineCoordinates.length - 1] : null;
        firstCoordinate = polylineCoordinates.length > 0 ? polylineCoordinates[0] : null;

        roundedDistance = data.distance ? Math.round(data.distance) : null;

    }
    return {polylineCoordinates, isLoading, roundedDistance, firstCoordinate,lastCoordinate}

};

export default UsePolyline;