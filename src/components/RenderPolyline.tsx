import {useEffect, useState} from 'react';
import {Marker, Polyline, Popup, useMap} from 'react-leaflet';
import {BsPersonWalking} from "react-icons/bs"
import L, {LatLngExpression, LatLngLiteral, LatLngTuple} from 'leaflet';
import 'leaflet.smooth_marker_bouncing';
import {markerIconRed} from "@/constants/constants.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import parsePoint, {estimateWalkingTime} from "@/utils/utils.ts";
import {IoAccessibility} from "react-icons/io5";

interface RenderPolylineProps {
    polyline: LatLngExpression[];
    lastCoordinate: LatLngLiteral | LatLngTuple | null;
    firstCoordinate: LatLngLiteral | LatLngTuple | null;
    estimatedDistance: number | null;
}

const polylineOptions = {color: "url(#polylineGradient)", weight: 14}; // Default to gradient
const clickedPolylineOptions = {color: "url(#polylineHighlightGradient)", weight: 100}; // Highlighted gradient when clicked
const dottedPolylineOptions = {color: "url(#polylineGradient)", weight: 8, dashArray: '5, 10'};


// Handle all three cases
// 1. user selected location
// 2. user clicked location
// 3. user geolocated location
const RenderPolyline = ({polyline, firstCoordinate, lastCoordinate, estimatedDistance}: RenderPolylineProps) => {
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const liveLocation = useLocationQueryStore((s) => s.liveLocationLatLng);
    const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
    const fromGeom = parsePoint(useLocationQueryStore((s) => s.locationQuery.from?.geom));
    const toGeom = parsePoint(useLocationQueryStore((s) => s.locationQuery.to?.geom));
    const estimatedWalkingTime = estimateWalkingTime(estimatedDistance);
    const map = useMap();
    const flyToDuration = 1.5;

    const [selected, setSelected] = useState(false);
    const [popupPosition, setPopupPosition] = useState<LatLngLiteral | null>(null);

    useEffect(() => {
        if (polyline.length > 0) {
            const bounds = L.latLngBounds(polyline); // Create bounds from the polyline
            map.fitBounds(bounds, {padding: [50, 50]}); // Fit the map to the bounds with padding
        }
    }, [firstCoordinate, map, polyline]);

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

    const getDottedPolylineStart = () => {
        if (firstCoordinate && fromGeom) {
            return [firstCoordinate, fromGeom];
        } else if (firstCoordinate && userMarkerLocation) {
            console.log("first", firstCoordinate, "usermarker", userMarkerLocation)
            return [firstCoordinate, userMarkerLocation];
        } else if (firstCoordinate && liveLocation) {
            console.log("live location", liveLocation)
            return [firstCoordinate, liveLocation];
        }
        return null;
    };

    const getDottedPolylineEnd = () => {
        if (lastCoordinate && toGeom) {
            return [lastCoordinate, toGeom];
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
                <Marker icon={markerIconRed} interactive position={lastCoordinate}>
                    <Popup>
                        <div className='border-[0.1rem] border-primary rounded-xl px-3'>
                            <p className='font-medium text-lg '>Here is your Destination <IoAccessibility size={25}
                                                                                                          className='inline'
                                                                                                          color='green'/>
                                <p className='font-bold'>{locationQuery?.to?.name}</p></p>
                            <p className='font-medium text-lg text '>
                                Should take
                                about {estimatedWalkingTime === 0 ? "less than a minute" : `${estimatedWalkingTime} ${estimatedWalkingTime === 0 ? "minute" : "minutes"}`}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}

            <Polyline
                positions={polyline}
                pathOptions={{
                    color: selected ? clickedPolylineOptions.color : polylineOptions.color,
                    weight: polylineOptions.weight,
                    interactive: true, // Ensure the polyline is interactive
                }}
                eventHandlers={{
                    click: handlePolylineClick,
                }}
            />

            {/* Invisible wider polyline for increasing hit area */}
            <Polyline
                positions={polyline}
                pathOptions={{
                    color: 'transparent', // Invisible stroke
                    weight: polylineOptions.weight + 20, // Increase this value to enlarge the hit area
                    interactive: true, // Ensure the invisible polyline is interactive
                }}
                eventHandlers={{
                    click: handlePolylineClick,
                }}
            />

            {popupPosition && selected && ( // Show the popup only if selected and the position is set
                <Popup position={popupPosition} className=''>
                    <div
                        className='flex flex-row justify-between items-center border-[0.1rem] border-primary rounded-xl px-3'>
                        <BsPersonWalking color='green' className='mr-3' size={30}/>
                        <p className='font-medium text-lg text '>
                            Should take
                            about {estimatedWalkingTime === 0 ? "less than a minute" : `${estimatedWalkingTime} ${estimatedWalkingTime === 0 ? "minute" : "minutes"}`}
                        </p>
                    </div>
                </Popup>
            )}

            {getDottedPolylineStart() && (
                <Polyline positions={getDottedPolylineStart() as LatLngExpression[]}
                          pathOptions={dottedPolylineOptions}
                          eventHandlers={{
                              click: handlePolylineClick,
                          }}
                />

            )}
            {getDottedPolylineEnd() && (
                <Polyline positions={getDottedPolylineEnd() as LatLngExpression[]}
                          pathOptions={dottedPolylineOptions}
                          eventHandlers={{
                              click: handlePolylineClick,
                          }}
                />
            )}

        </>
    );
};

export default RenderPolyline;
