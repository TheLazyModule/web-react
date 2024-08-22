import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import useLocationStore from "@/hooks/useLocationStore.ts";
import {LatLngTuple} from "leaflet";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {markerIconRedToon } from "@/constants/constants.ts";
import {getDeviceType} from "@/utils/utils.ts";

const ClickMarker = () => {
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setLocationGeom = useLocationQueryStore((s) => s.setSingleLocationGeom);
    const liveLocation = useLocationStore(s => s.liveLocationLatLng);
    const setFrom = useLocationQueryStore((s) => s.setFrom);
    const locationQueryFrom = useLocationQueryStore((s) => s.locationQuery.from);
    const setLiveLocationWkt = useLocationQueryStore(s => s.setLiveLocationWkt);
    const setLiveLocationLatLng = useLocationQueryStore(s => s.setLiveLocationLatLng);

    useMapEvents({
        click(e) {
            if (getDeviceType() === 'Mobile') return;
            const target = e.originalEvent.target as HTMLElement;
            if (target.tagName === 'path') {
                // Click was on an SVG element, which could be a polyline, so ignore
                return;
            }
            const newLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
            setLocationGeom('');
            setUserMarkerLocation(e.latlng);
            setFromLocation(newLocation);
            setFrom({
                ...locationQueryFrom, // Spread the rest of the properties first
                category_id: 0,
                geom: "", // Then explicitly set geom to an empty string, ensuring it overrides any existing value
                id: "",
                name: "My Location"
            });
            setLiveLocationLatLng([] as unknown as LatLngTuple);
            setLiveLocationWkt('');
        },
    });

    const handleMarkerDragEnd = (event) => {
        const latlng = event.target.getLatLng();
        const newLocation = `POINT(${latlng?.lng} ${latlng?.lat})`;
        setUserMarkerLocation(latlng);
        setFromLocation(newLocation);
        setFrom({
            ...locationQueryFrom, // Spread the rest of the properties first
            category_id: 0,
            geom: "", // Then explicitly set geom to an empty string, ensuring it overrides any existing value
            id: "",
            name: "My Location"
        });
        setLiveLocationLatLng([] as unknown as LatLngTuple);
        setLiveLocationWkt('');
    };

    // Check if liveLocation or userMarkerLocation is null or undefined
    const markerPosition = liveLocation && (liveLocation as LatLngTuple).length > 0 ? liveLocation : userMarkerLocation;

    if (!markerPosition) {
        return null; // Don't render the Marker if there's no valid position
    }

    return (
        <Marker
            icon={markerIconRedToon}
            draggable
            position={markerPosition}
            eventHandlers={{
                dragend: handleMarkerDragEnd,
            }}
        >
            <Popup>
                <div className='border-[0.1rem] border-primary rounded-xl px-3'>
                    <p className='font-medium sm:text-sm md:text-lg'>
                        I'm here!
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};

export default ClickMarker;
