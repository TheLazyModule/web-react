import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import useLocationStore from "@/hooks/useLocationStore.ts";
import {LatLngTuple} from "leaflet";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {markerIconGreen} from "@/constants/constants.ts";

const ClickMarker = () => {
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setLocationGeom = useLocationQueryStore((s) => s.setSingleLocationGeom);
    const liveLocation = useLocationStore(s => s.liveLocationLatLng)
    const setFrom = useLocationQueryStore((s) => s.setFrom);
    const locationQueryFrom = useLocationQueryStore((s) => s.locationQuery.from);
    const setLiveLocationWkt = useLocationQueryStore(s => s.setLiveLocationWkt);
    const setLiveLocationLatLng = useLocationQueryStore(s => s.setLiveLocationLatLng);

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


    // useEffect(() => {
    //     if (firstCoordinate) {
    //         setUserMarkerLocation(firstCoordinate);
    //     }
    // }, [userMarkerLocation]);

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


    return ((liveLocation && (liveLocation as LatLngTuple).length > 0)) || userMarkerLocation ? (
        <Marker
            icon={markerIconGreen}
            draggable
            position={liveLocation || userMarkerLocation}
            eventHandlers={{dragend: handleMarkerDragEnd,
                mouseover: (e) => {
                    e.target.openPopup();
                },
                mouseout: (e) => {
                    e.target.closePopup();
                }
        }}
        >
            <Popup>
                <div className='border-[0.1rem] border-primary rounded-xl px-3'>
                    <p className='font-medium text-lg'>
                        I'm here!
                    </p>
                </div>
            </Popup>
        </Marker>
    ) : null;
};

export default ClickMarker;
