import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import {LatLngExpression, LatLngLiteral, LatLngTuple} from "leaflet";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {markerIconGreen} from "@/constants/constants.ts";
import {useEffect, useState} from "react";

const ClickMarker = ({firstCoordinate}: { firstCoordinate: LatLngLiteral | LatLngTuple | null; }) => {
    const [polylineFirstCoordinate, setPolylinefirstCoordinate] = useState<LatLngLiteral | LatLngTuple | null>(null);
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setLocationGeom = useLocationQueryStore((s) => s.setLocationGeom);
    const setFrom = useLocationQueryStore((s) => s.setFrom);

    useMapEvents({
        click(e) {
            const newLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
            setLocationGeom('')
            setUserMarkerLocation(e.latlng);
            setFromLocation(newLocation);
            setFrom('My Location');
        },
    });

    useEffect(() => {
        console.log(locationQuery);
        console.log(polylineFirstCoordinate);
    }, [locationQuery]);

    useEffect(() => {
        if (firstCoordinate) {
            setUserMarkerLocation(firstCoordinate);
            console.log(userMarkerLocation);
            setPolylinefirstCoordinate(firstCoordinate);
        }
    }, [userMarkerLocation]);

    const handleMarkerDragEnd = (event) => {
        const latlng = event.target.getLatLng();
        const newLocation = `POINT(${latlng?.lng} ${latlng?.lat})`;
        setUserMarkerLocation(latlng);
        setFromLocation(newLocation);
        setFrom('My Location');
    };

    return userMarkerLocation ? (
        <Marker
            icon={markerIconGreen}
            draggable
            position={userMarkerLocation as LatLngExpression}
            eventHandlers={{dragend: handleMarkerDragEnd}}
        >
            <Popup>I'm here!</Popup>
        </Marker>
    ) : null;
};

export default ClickMarker;