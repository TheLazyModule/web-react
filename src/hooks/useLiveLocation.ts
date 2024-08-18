import {useEffect, useRef} from "react";
import {useGeolocated} from "react-geolocated";
import {LatLngExpression, LatLngTuple} from "leaflet";
import toast from "react-hot-toast";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import {OptionValue} from "@/constants/constants.ts";

const useLiveLocation = () => {
    const setLiveLocationLatLng = useLocationQueryStore((s) => s.setLiveLocationLatLng);
    const setLiveLocationWkt = useLocationQueryStore((s) => s.setLiveLocationWkt);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setFrom = useLocationQueryStore((s) => s.setFrom);

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
            const newLiveLocation = `POINT(${longitude} ${latitude})`;
            setLiveLocationLatLng(latlng);
            setLiveLocationWkt(newLiveLocation);
        },
    });

    useEffect(() => {
        if (!isGeolocationAvailable) {
            toast.error("Geolocation is not supported by this browser.");
        } else if (!isGeolocationEnabled) {
            toast.error("Geolocation is not enabled.");
            setFromLocation('');
            setFrom({} as OptionValue);
            setLiveLocationLatLng([] as unknown as LatLngTuple);
            setLiveLocationWkt("");
            isLiveLocationOnRef.current = false; // Reset the live location flag
        } else if (coords) {
            const {latitude, longitude} = coords;
            const latlng: LatLngExpression = [latitude, longitude];
            const newLiveLocation = `POINT(${longitude} ${latitude})`;
            setLiveLocationLatLng(latlng);
            setLiveLocationWkt(newLiveLocation);
        }
    }, [coords, isGeolocationAvailable, isGeolocationEnabled, setLiveLocationLatLng, setLiveLocationWkt]);

    // Re-trigger the geolocation request when location services are turned back on
    useEffect(() => {
        if (isGeolocationEnabled && !isLiveLocationOnRef.current) {
            // We only call getPosition when geolocation is re-enabled and it's not already being tracked
            getPosition();
        }
    }, [isGeolocationEnabled, getPosition]);
    return {coords, isGeolocationAvailable, isGeolocationEnabled, positionError, getPosition}
};

export default useLiveLocation;
