import {useEffect, useRef, useState} from "react";
import {useGeolocated} from "react-geolocated";
import {LatLngExpression, LatLngTuple} from "leaflet";
import toast from "react-hot-toast";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import {OptionValue} from "@/constants/constants.ts";

const useLiveLocation = () => {
    const setLiveLocationLatLng = useLocationQueryStore((s) => s.setLiveLocationLatLng);
    const setLiveLocationWkt = useLocationQueryStore((s) => s.setLiveLocationWkt);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFrom = useLocationQueryStore((s) => s.setFrom);
    const [geolocatedCoords, setGeolocatedCoords] = useState<LatLngExpression | null>(null);

    const isLiveLocationOnRef = useRef<boolean>(false);

    const {coords, isGeolocationAvailable, isGeolocationEnabled, positionError, getPosition} = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: Infinity,
        },
        watchLocationPermissionChange: true,
        suppressLocationOnMount: true,
        watchPosition: true,
        userDecisionTimeout: 9000,
        onError: () => {
            // toast.error(`Geolocation error ${positionError?.message}`);
        },
        onSuccess: (position) => {
            if (!isLiveLocationOnRef.current) {
                toast.success("Live location on! 🌍");
                isLiveLocationOnRef.current = true;
            }
            const {latitude, longitude} = position.coords;
            const latlng: LatLngExpression = [latitude, longitude];
            setGeolocatedCoords(latlng);
            const newLiveLocation = `POINT(${longitude} ${latitude})`;
            setLiveLocationLatLng(latlng);
            setLiveLocationWkt(newLiveLocation);
        },
    });

    useEffect(() => {
        if (!isGeolocationAvailable) {
            toast.error("Geolocation is not supported by this browser.");
        } else if (!isGeolocationEnabled && !isLiveLocationOnRef.current) {
            toast.error("Geolocation is not enabled.");
            setFromLocation('');
            setFrom({} as OptionValue);
            setLiveLocationLatLng([] as unknown as LatLngTuple);
            setLiveLocationWkt("");
            isLiveLocationOnRef.current = false; // Reset the live location flag
        } else if (coords && geolocatedCoords) {
            const latlng: LatLngExpression = geolocatedCoords;
            const newLiveLocation = `POINT(${geolocatedCoords[1]} ${geolocatedCoords[0]})`;
            setLiveLocationLatLng(latlng);
            setLiveLocationWkt(newLiveLocation);
            if (!userMarkerLocation) {
                setFromLocation(newLiveLocation);
            }

        }
    }, [isGeolocationAvailable, isGeolocationEnabled, setLiveLocationLatLng, setLiveLocationWkt]);

    // Re-trigger the geolocation request when location services are turned back on
    useEffect(() => {
        if (isGeolocationEnabled && !isLiveLocationOnRef.current) {
            // We only call getPosition when geolocation is re-enabled and it's not already being tracked
            getPosition();
        }
    }, [isGeolocationEnabled, getPosition]);

    return {coords, isGeolocationAvailable, isGeolocationEnabled, positionError, getPosition, geolocatedCoords}
};

export default useLiveLocation;
