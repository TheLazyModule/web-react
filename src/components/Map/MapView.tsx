import {LayersControl, MapContainer, Polyline, TileLayer, Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../Sidebar/Sidebar.tsx";
import useRoute from "@/hooks/useRoute.ts";
import parse from "wellknown";
import {LatLngExpression} from "leaflet";

const polylineOptions = {color: "#077bd1db", weight: 6};

const MapView = () => {
    const {data} = useRoute();

    let polylineCoordinates: LatLngExpression[] = [];
    let lastCoordinate: LatLngExpression | null = null;
    let roundedDistance: number | null = null;

    if (data && data.paths) {
        // Extract all points and convert to LatLngExpression
        polylineCoordinates = data.paths.map((point) => {
            const parsed = parse(point.geom_geographic);

            if (parsed && parsed.type === "Point" && parsed.coordinates.length === 2) {
                // Swap from [longitude, latitude] to [latitude, longitude]
                const [longitude, latitude] = parsed.coordinates;
                return [latitude, longitude] as LatLngExpression;
            }

            return null;
        }).filter(Boolean) as LatLngExpression[];

        // Set the last coordinate and round the distance
        lastCoordinate = polylineCoordinates.length > 0 ? polylineCoordinates[polylineCoordinates.length - 1] : null;
        roundedDistance = data.distance ? Math.round(data.distance) : null;

        console.log("Polyline Coordinates:", polylineCoordinates);
        console.log(`Approximately, ${roundedDistance}m walk`);
    }

    const {BaseLayer} = LayersControl;

    return (
        <div className="relative">
            <Sidebar position="left" theme="light"/>

            <MapContainer
                center={[6.673175, -1.565423]}
                zoom={15}
                style={{height: "100vh", width: "100%"}}
            >
                <LayersControl>
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            maxZoom={20}
                            subdomains={["mt1", "mt2", "mt3"]}
                        />
                    </BaseLayer>

                    <BaseLayer name="Satellite View">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </BaseLayer>

                    {polylineCoordinates.length > 0 && (
                        <Polyline
                            positions={polylineCoordinates}
                            pathOptions={polylineOptions}
                        />
                    )}

                    {lastCoordinate && roundedDistance !== null && (
                        <Marker position={lastCoordinate}>
                            <Popup>
                                Destination <br/>
                                Distance: {roundedDistance} meters.
                            </Popup>
                        </Marker>
                    )}
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default MapView;
