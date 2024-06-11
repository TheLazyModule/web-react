import { useState, useEffect } from "react";
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import marker from '@/assets/location.svg';
import useLocationQueryStore from '@/hooks/useLocationStore.ts';
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../Sidebar/Sidebar.tsx";
import { BounceLoader } from "react-spinners";
import usePolyline from "@/hooks/usePolyline.tsx";
import RenderPolyline from "@/components/RenderPolyline.tsx";
import Alert from "@/components/Alert"; // Import the Alert component

const MapView = () => {
    const { polylineCoordinates, isLoading, roundedDistance, lastCoordinate } = usePolyline();
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

    const { BaseLayer } = LayersControl;

    return (
        <div className="relative">
            <Sidebar position="left" theme="light" />

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-white bg-opacity-75">
                    <BounceLoader size={50} color={"#4F6F52"} loading={loading} />
                </div>
            )}

            {isOffline && <Alert />} {/* Display the Alert component if offline */}

            <MapContainer
                center={[6.673175, -1.565423]}
                zoom={15}
                style={{ height: "100vh", width: "100%" }}
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
                            lastCoordinate={lastCoordinate}
                            estimatedDistance={roundedDistance}
                        />
                    )}

                    <ClickMarker /> {/* Add the ClickMarker component */}
                </LayersControl>
            </MapContainer>
        </div>
    );
};


const markerIcon = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
});

const ClickMarker = () => {
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setFrom = useLocationQueryStore((s) => s.setFrom);
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);

    useMapEvents({
        click(e) {
            const newLocation = `POINT(${e.latlng.lng} ${e.latlng.lat})`;
            setMarkerPosition(e.latlng);
            setFromLocation(newLocation);
            setFrom('My Location');
        },
    });

    useEffect(() => {
        console.log(locationQuery);
    }, [locationQuery]);

    const handleMarkerDragEnd = (event) => {
        const latlng = event.target.getLatLng();
        const newLocation = `POINT(${latlng.lng} ${latlng.lat})`;
        setMarkerPosition(latlng);
        setFromLocation(newLocation);
        setFrom('My Location');
    };

    return markerPosition ? (
        <Marker
            icon={markerIcon}
            draggable
            position={markerPosition}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
        >
            <Popup>I'm here!</Popup>
        </Marker>
    ) : null;
};

export default MapView;
