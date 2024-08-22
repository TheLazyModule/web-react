import {useEffect, useState} from "react";
import {LayersControl, MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'; // Import the MarkerClusterGroup
import Sidebar from "../Sidebar/Sidebar.tsx";
import {BounceLoader} from "react-spinners";
import usePolyline from "@/hooks/usePolyline.tsx";
import RenderPolyline from "@/components/RenderPolyline.tsx";
import "leaflet/dist/leaflet.css";
import ClickMarker from "@/components/ClickMarker.tsx";
import Searchbar from "@/components/Searchbar.tsx";
import {buildingIcon, placeIcon} from "@/constants/constants.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import parsePoint, {getDeviceType} from "@/utils/utils.ts";
import useOffline from "@/hooks/useOffline.ts";
import useAllLocations from "@/hooks/useAllLocations.ts";

const FlyToLocation = ({location}) => {
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo(location, 20);
        }
    }, [location, map]);

    return null;
};

const MapView = () => {
    const {data: allLocations} = useAllLocations();
    const location = useLocationQueryStore((s) => s.singleLocation);
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const {polylineCoordinates, isLoading, roundedDistance, firstCoordinate, lastCoordinate} = usePolyline();
    const [loading, setLoading] = useState(true);
    useOffline();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const {BaseLayer} = LayersControl;
    const parsedLocation = location ? parsePoint(location.geom) : null;

    return (
        <div className="relative">
            <Searchbar/>
            <Sidebar position="left" theme="light" polyline={polylineCoordinates}/>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-white bg-opacity-75">
                    <BounceLoader size={50} color={"#4F6F52"} loading={loading}/>
                </div>
            )}

            <MapContainer
                className="w-full h-full bg-black"
                center={[6.673175, -1.565423]}
                zoom={16}
                style={{
                    height: "100vh",
                    width: "100%",
                    backgroundColor: "#e5e5f7",
                    backgroundImage: `
                        linear-gradient(#80e38d 2px, transparent 2px),
                        linear-gradient(90deg, #80e38d 2px, transparent 2px),
                        linear-gradient(#80e38d 1px, transparent 1px),
                        linear-gradient(90deg, #80e38d 1px, #e5e5f7 1px)
                    `,
                    backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
                    backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px",
                }}
                whenReady={() => setLoading(false)}
            >
                <LayersControl position='bottomright'>
                    <BaseLayer checked name="knust_tms">
                        <TileLayer
                            tms
                            url="https://knust-tms.intdeltas.com/tms/{z}/{x}/{y}.png"
                            maxZoom={22}
                            minZoom={2}
                        />
                    </BaseLayer>

                    {parsedLocation && !locationQuery.from?.name && !locationQuery.to?.name && (
                        <FlyToLocation location={parsedLocation}/>
                    )}

                    <MarkerClusterGroup chunkedLoading maxClusterRadius={70} spiderfyOnMaxZoom
                                        polygonOptions={{
                                            fillColor: 'rgba(255,255,255,0.38)',
                                            color: 'rgba(240,128,0,0.67)',
                                            weight: 2,
                                            opacity: 1,
                                            fillOpacity: 0.8,
                                        }}
                    >
                        {allLocations?.buildings.map((building, index) =>
                            building.latitude && building.longitude ? (
                                <Marker
                                    key={index}
                                    position={[building.latitude, building.longitude]}
                                    icon={buildingIcon}
                                    riseOnHover
                                    eventHandlers={{
                                        mouseover: (e) => {
                                            e.target.openPopup();
                                        },
                                        mouseout: (e) => {
                                            e.target.closePopup();
                                        }
                                    }}
                                >
                                    <Popup closeOnEscapeKey>
                                        <div className='border-[0.1rem] border-primary rounded-xl px-3'>
                                            <p className='font-medium text-lg '>{building.name}</p>
                                            {building.image_urls && building.image_urls[0] && (
                                                <img src={building.image_urls[0]} alt={building.name}/>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ) : null
                        )}

                        {allLocations?.places.map((place, index) => (
                            <Marker
                                riseOnHover
                                key={index}
                                position={[place.latitude, place.longitude]}
                                icon={placeIcon}
                                eventHandlers={{
                                    mouseover: (e) => {
                                        if (getDeviceType() === 'Mobile') return;
                                        e.target.openPopup();
                                    },
                                    mouseout: (e) => {
                                        if (getDeviceType() === 'Mobile') return;
                                        e.target.closePopup();
                                    }
                                }}
                            >
                                <Popup minWidth={200} maxWidth={500} closeOnEscapeKey>
                                    <div
                                        className="flex flex-col h-full w-full justify-center items-center border-[0.1rem] border-primary rounded-xl px-3">
                                        <p className="text-lg font-medium">{place.name}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>

                    {polylineCoordinates.length > 0 && (
                        <RenderPolyline
                            polyline={polylineCoordinates}
                            firstCoordinate={firstCoordinate}
                            lastCoordinate={lastCoordinate}
                            estimatedDistance={roundedDistance}
                        />
                    )}

                    <ClickMarker/>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default MapView;
