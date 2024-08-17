import {useEffect, useState} from 'react';
import {Marker, Polyline, Popup, useMap} from 'react-leaflet';
import L, {LatLngExpression, LatLngLiteral, LatLngTuple} from 'leaflet';
import 'leaflet.smooth_marker_bouncing';
import {markerIconRed} from "@/constants/constants.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import {estimateWalkingTime} from "@/utils/utils.ts";

interface RenderPolylineProps {
    polyline: LatLngExpression[];
    lastCoordinate: LatLngLiteral | LatLngTuple | null;
    firstCoordinate: LatLngLiteral | LatLngTuple | null;
    estimatedDistance: number | null;
}

const polylineOptions = {color: "url(#polylineGradient)", weight: 18}; // Default to gradient
const clickedPolylineOptions = {color: "url(#polylineHighlightGradient)", weight: 18}; // Highlighted gradient when clicked
const dottedPolylineOptions = {color: "#077bd1db", weight: 10, dashArray: '5, 10'};

const RenderPolyline = ({polyline, firstCoordinate, lastCoordinate, estimatedDistance}: RenderPolylineProps) => {
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const map = useMap();
    const flyToDuration = 1.5;

    const [selected, setSelected] = useState(false);
    const [popupPosition, setPopupPosition] = useState<LatLngLiteral | null>(null);

    useEffect(() => {
        if (polyline.length > 0 && lastCoordinate) {
            setUserMarkerLocation(firstCoordinate);
            map.flyTo([lastCoordinate[0], lastCoordinate[1]], 20);
        }
    }, [lastCoordinate, firstCoordinate, map, polyline]);

    useEffect(() => {
        if (lastCoordinate) {
            map.eachLayer(async (layer) => {
                if (layer instanceof L.Marker) {
                    if (layer.getLatLng().equals(lastCoordinate)) {
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
        }
    }, [lastCoordinate, map]);

    const getDottedPolyline = () => {
        if (firstCoordinate && userMarkerLocation) {
            return [firstCoordinate, userMarkerLocation];
        }
        return null;
    };

    useEffect(() => {
        const svg = document.querySelector('.leaflet-overlay-pane > svg');
        if (svg) {
            // Default gradient
            if (!document.getElementById('polylineGradient')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                linearGradient.setAttribute('id', 'polylineGradient');
                linearGradient.setAttribute('x1', '0%');
                linearGradient.setAttribute('y1', '0%');
                linearGradient.setAttribute('x2', '100%');
                linearGradient.setAttribute('y2', '0%');

                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('style', 'stop-color:#ff5733;stop-opacity:1');

                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('style', 'stop-color:#ffc107;stop-opacity:1');

                linearGradient.appendChild(stop1);
                linearGradient.appendChild(stop2);
                defs.appendChild(linearGradient);
                svg.appendChild(defs);
            }

            // Highlighted gradient
            if (!document.getElementById('polylineHighlightGradient')) {
                const defs = svg.querySelector('defs');
                const highlightGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                highlightGradient.setAttribute('id', 'polylineHighlightGradient');
                highlightGradient.setAttribute('x1', '0%');
                highlightGradient.setAttribute('y1', '0%');
                highlightGradient.setAttribute('x2', '100%');
                highlightGradient.setAttribute('y2', '0%');

                const highlightStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                highlightStop1.setAttribute('offset', '0%');
                highlightStop1.setAttribute('style', 'stop-color:#ffa94d;stop-opacity:1'); // Brighter orange

                const highlightStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                highlightStop2.setAttribute('offset', '100%');
                highlightStop2.setAttribute('style', 'stop-color:#ffd700;stop-opacity:1'); // Brighter yellow

                highlightGradient.appendChild(highlightStop1);
                highlightGradient.appendChild(highlightStop2);
                defs?.appendChild(highlightGradient);
            }
        }
    }, []);

    const handlePolylineClick = (e: L.LeafletMouseEvent) => {
        if (!selected) {
            setPopupPosition(e.latlng); // Show the popup only when highlighting
        } else {
            setPopupPosition(null); // Hide the popup when unhighlighting
        }
        setSelected(!selected);
    };

    return (
        <>
            {lastCoordinate && estimatedDistance !== null && (
                <Marker icon={markerIconRed} draggable position={lastCoordinate}>
                    <Popup>
                        Destination: {locationQuery?.to?.name} <br/>
                        Distance: {estimatedDistance} meters.
                    </Popup>
                </Marker>
            )}

            <Polyline
                positions={polyline}
                pathOptions={{
                    color: selected ? clickedPolylineOptions.color : polylineOptions.color,
                    weight: polylineOptions.weight,
                }}
                eventHandlers={{
                    click: handlePolylineClick,
                }}
            />

            {popupPosition && selected && ( // Show the popup only if selected and the position is set
                <Popup position={popupPosition}>
                    <div><p className='font-bold'>Should take
                        about {estimateWalkingTime(estimatedDistance) === 0 ? "less than a minute" : `${estimateWalkingTime(estimatedDistance)}m`}</p>
                    </div>
                </Popup>
            )}

            {getDottedPolyline() && (
                <Polyline positions={getDottedPolyline() as LatLngExpression[]} pathOptions={dottedPolylineOptions}/>
            )}
        </>
    );
};

export default RenderPolyline;
