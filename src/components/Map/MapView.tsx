import {useState, useEffect} from "react";
import {Marker, Popup, useMapEvents, LayersControl, MapContainer, TileLayer} from "react-leaflet";
import {LatLngExpression, LatLngLiteral, LatLngTuple} from "leaflet";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import Sidebar from "../Sidebar/Sidebar.tsx";
import {BounceLoader} from "react-spinners";
import usePolyline from "@/hooks/usePolyline.tsx";
import RenderPolyline from "@/components/RenderPolyline.tsx";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import {markerIconGreen} from "@/constants/constants.ts";


const ClickMarker = ({firstCoordinate}: { firstCoordinate: LatLngLiteral | LatLngTuple | null; }) => {
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setFrom = useLocationQueryStore((s) => s.setFrom);

    useMapEvents({
        click(e) {
            const newLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
            setUserMarkerLocation(e.latlng);
            setFromLocation(newLocation);
            setFrom('My Location');
        },
    });

    useEffect(() => {
        console.log(locationQuery);
    }, [locationQuery]);

    useEffect(() => {
        if (firstCoordinate) {
            setUserMarkerLocation(firstCoordinate);
        }
    }, [firstCoordinate]);

    const handleMarkerDragEnd = (event) => {
        const latlng = event.target.getLatLng();
        const newLocation = `POINT(${latlng.lng} ${latlng.lat})`;
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

const MapView = () => {
    const {polylineCoordinates, isLoading, roundedDistance, firstCoordinate, lastCoordinate} = usePolyline();
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);


    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
        };

        const handleOnline = () => {
            setIsOffline(false);
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    useEffect(() => {
        if (isOffline)
            toast.error("It seems you're offline");
    }, [isOffline]);

    const {BaseLayer} = LayersControl;

    return (
        <div className="relative">
            <Sidebar position="left" theme="light"/>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-white bg-opacity-75">
                    <BounceLoader size={50} color={"#4F6F52"} loading={loading}/>
                </div>
            )}

            <MapContainer
                center={[6.673175, -1.565423]}
                zoom={15}
                style={{height: "100vh", width: "100%"}}
                whenReady={() => setLoading(false)}
            >
                <LayersControl>
                    <BaseLayer checked name="Satellite View">
                        <TileLayer
                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            maxZoom={20}
                            subdomains={["mt1", "mt2", "mt3"]}
                        />
                    </BaseLayer>

                    <BaseLayer name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </BaseLayer>

                    {polylineCoordinates.length > 0 && (
                        <RenderPolyline
                            polyline={polylineCoordinates}
                            firstCoordinate={firstCoordinate}
                            lastCoordinate={lastCoordinate}
                            estimatedDistance={roundedDistance}
                        />
                    )}

                    <ClickMarker firstCoordinate={firstCoordinate}/>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default MapView;
