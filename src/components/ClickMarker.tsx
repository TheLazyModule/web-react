import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import useLocationStore from "@/hooks/useLocationStore.ts";
import {LatLngLiteral, LatLngTuple} from "leaflet";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {markerIconGreen} from "@/constants/constants.ts";
import {useEffect} from "react";

const ClickMarker = ({firstCoordinate}: { firstCoordinate: LatLngLiteral | LatLngTuple | null; }) => {
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setLocationGeom = useLocationQueryStore((s) => s.setSingleLocationGeom);
    const liveLocation = useLocationStore(s => s.liveLocationLatLng)
    const setFrom = useLocationQueryStore((s) => s.setFrom);
    const locationQueryFrom = useLocationQueryStore((s) => s.locationQuery.from);

    useMapEvents({
        click(e) {
            const target = e.originalEvent.target as HTMLElement;
            if (target.tagName === 'path') {
                // Click was on an SVG element, which could be a polyline, so ignore
                return;
            }

            const newLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
            setLocationGeom('');
            setUserMarkerLocation(e.latlng);
            setFromLocation(newLocation);
            setFrom({category_id: 0, geom: "", id: "", ...locationQueryFrom, name: "My Location"});
        },
    });

    useEffect(() => {
        if (liveLocation)
            console.log("live location", liveLocation)
    }, [liveLocation]);

    useEffect(() => {
        if (firstCoordinate) {
            setUserMarkerLocation(firstCoordinate);
        }
    }, [userMarkerLocation]);

    const handleMarkerDragEnd = (event) => {
        const latlng = event.target.getLatLng();
        const newLocation = `POINT(${latlng?.lng} ${latlng?.lat})`;
        setUserMarkerLocation(latlng);
        setFromLocation(newLocation);
        setFrom({category_id: 0, geom: "", id: "", ...locationQueryFrom, name: "My Location"});
    };


    return userMarkerLocation || (liveLocation as LatLngTuple).length > 0 ? (
        <Marker
            icon={markerIconGreen}
            draggable
            position={userMarkerLocation || liveLocation}
            eventHandlers={{dragend: handleMarkerDragEnd}}
        >
            <Popup>I'm here!</Popup>
        </Marker>
    ) : null;
};

export default ClickMarker;
