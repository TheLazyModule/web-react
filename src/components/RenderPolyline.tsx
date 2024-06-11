import {useEffect} from 'react';
import {Marker, Polyline, Popup, useMap} from 'react-leaflet';
import L, {LatLngExpression, LatLngLiteral, LatLngTuple} from 'leaflet';
import 'leaflet.smooth_marker_bouncing';
import {markerIconGreen, markerIconRed} from "@/constants/constants.ts";

interface RenderPolylineProps {
    polyline: LatLngExpression[];
    firstCoordinate: LatLngLiteral | LatLngTuple | null;
    lastCoordinate: LatLngLiteral | LatLngTuple | null;
    estimatedDistance: number | null;
}

const polylineOptions = {color: "#077bd1db", weight: 6};


const RenderPolyline = ({polyline, firstCoordinate, lastCoordinate, estimatedDistance}: RenderPolylineProps) => {
    const map = useMap();
    const flyToDuration = 1.5;

    const flyTo = (location: LatLngTuple) => {
        map.flyTo([...location], 14)
    };

    useEffect(() => {
        if (polyline.length > 0) {
            const bounds = L.latLngBounds(polyline);
            map.flyToBounds(bounds, {animate: true, duration: flyToDuration});
        }
    }, [polyline, map]);

    useEffect(() => {
        if (lastCoordinate) {
            flyTo(lastCoordinate as LatLngTuple);
        }
    }, [lastCoordinate]);

    useEffect(() => {
        map.eachLayer(async (layer) => {
            if (layer instanceof L.Marker) {
                if (layer.getLatLng().equals(lastCoordinate as LatLngLiteral)) {
                    await new Promise((r) => setTimeout(r, flyToDuration * 1000 + 100));
                    // @ts-ignore
                    layer.bounce();
                    // @ts-ignore
                    setTimeout(() => layer.stopBouncing(), 3000);
                } else {
                    // @ts-ignore
                    layer.stopBouncing();
                }
            }
        });
    }, [lastCoordinate, map]);

    return (
        <>
            {lastCoordinate && estimatedDistance !== null && (
                <Marker icon={markerIconRed} draggable position={lastCoordinate}>
                    <Popup>
                        Destination <br/>
                        Distance: {estimatedDistance} meters.
                    </Popup>
                </Marker>
            )}

            {firstCoordinate && estimatedDistance !== null && (
                <Marker icon={markerIconGreen} draggable position={firstCoordinate}>
                    <Popup>
                        I am here!
                    </Popup>
                </Marker>
            )}
            <Polyline positions={polyline} pathOptions={polylineOptions}/>
        </>
    );
};

export default RenderPolyline;
