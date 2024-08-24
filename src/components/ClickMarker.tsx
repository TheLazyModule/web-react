import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import useLocationStore from "@/hooks/useLocationStore.ts";
import L, { LatLngTuple } from 'leaflet';
import { Marker, Popup, useMapEvents } from "react-leaflet";
// import { getDeviceType } from "@/utils/utils.ts";
import {markerIconRedToon} from "@/constants/constants.ts";

const ClickMarker = () => {
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setLocationGeom = useLocationQueryStore((s) => s.setSingleLocationGeom);
    const liveLocation = useLocationStore(s => s.liveLocationLatLng);
    const setFrom = useLocationQueryStore((s) => s.setFrom);
    const locationQueryFrom = useLocationQueryStore((s) => s.locationQuery.from);
    // const setLiveLocationWkt = useLocationQueryStore(s => s.setLiveLocationWkt);
    // const setLiveLocationLatLng = useLocationStore(s => s.setLiveLocationLatLng);

    // Handle map clicks to set user marker location
    useMapEvents({
        click(e) {
            // if (getDeviceType() === 'Mobile') return;
            const target = e.originalEvent.target as HTMLElement;
            if (target.tagName === 'path') {
                return;
            }
            const newLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
            setLocationGeom('');
            setUserMarkerLocation(e.latlng);
            setFromLocation(newLocation);
            setFrom({
                ...locationQueryFrom,
                category_id: 0,
                geom: "",
                id: "",
                name: "My Location"
            });
            // setLiveLocationLatLng([] as unknown as LatLngTuple);
            // setLiveLocationWkt('');
        },
    });

    // Handle marker drag end for the red marker
    const handleMarkerDragEnd = (event: any) => {
        const latlng = event.target.getLatLng();
        const newLocation = `POINT(${latlng?.lng} ${latlng?.lat})`;
        setUserMarkerLocation(latlng);
        setFromLocation(newLocation);
        setFrom({
            ...locationQueryFrom,
            category_id: 0,
            geom: "",
            id: "",
            name: "My Location"
        });
        // setLiveLocationLatLng([] as unknown as LatLngTuple);
        // setLiveLocationWkt('');
    };

    // Custom icon for the blue live location marker
    const liveLocationIcon = L.divIcon({
        html: `<div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
                      <!-- Outer Circle -->
                      <circle cx="30" cy="30" r="10" fill="white" />
                      <!-- Inner Circle -->
                      <circle cx="30" cy="30" r="8" fill="#4285F4" />
                    </svg>
               </div>`,
        iconSize: [60, 60],
        className: 'custom-icon',
    });

    // Custom icon for the red clicked location marker
    // const clickedLocationIcon = L.divIcon({
    //     html: `<div>
    //                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
    //                   <!-- Outer Circle -->
    //                   <circle cx="30" cy="30" r="10" fill="white" />
    //                   <!-- Inner Circle -->
    //                   <circle cx="30" cy="30" r="8" fill="#FF0000" />
    //                 </svg>
    //            </div>`,
    //     iconSize: [60, 60],
    //     className: 'custom-icon',
    // });

    return (
        <>
            {/* Live Location Marker (Blue) */}
            {liveLocation && (liveLocation as LatLngTuple).length > 0 && (
                <Marker
                    icon={liveLocationIcon}
                    position={liveLocation as LatLngTuple}
                >
                    <Popup>
                        <div className='border-[0.1rem] border-primary rounded-xl px-3'>
                            <p className='font-medium sm:text-sm md:text-lg'>
                                This is your live location!
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* User Clicked Marker (Red) */}
            {userMarkerLocation && (
                <Marker
                    icon={markerIconRedToon}
                    draggable
                    position={userMarkerLocation as LatLngTuple}
                    eventHandlers={{
                        dragend: handleMarkerDragEnd,
                    }}
                >
                    <Popup>
                        <div className='border-[0.1rem] border-primary rounded-xl px-3'>
                            <p className='font-medium sm:text-sm md:text-lg'>
                                You clicked here!
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}
        </>
    );
};

export default ClickMarker;
