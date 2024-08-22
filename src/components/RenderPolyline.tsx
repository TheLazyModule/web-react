import {useEffect, useState} from 'react';
import {Marker, Polyline, Popup, useMap} from 'react-leaflet';
import {BsPersonWalking} from "react-icons/bs";
import L, {LatLngExpression, LatLngLiteral, LatLngTuple} from 'leaflet';
import 'leaflet.smooth_marker_bouncing';
import {markerIconRed} from "@/constants/constants.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import parsePoint, {estimateWalkingTime} from "@/utils/utils.ts";
import {IoAccessibility} from "react-icons/io5";
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {ImageLayoutGrid} from "@/components/LayoutGrid.tsx";

interface RenderPolylineProps {
    polyline: LatLngExpression[];
    lastCoordinate: LatLngLiteral | LatLngTuple | null;
    firstCoordinate: LatLngLiteral | LatLngTuple | null;
    estimatedDistance: number | null;
}

const polylineOptions = {color: "url(#polylineGradient)", weight: 14};
const clickedPolylineOptions = {color: "url(#polylineHighlightGradient)", weight: 14};
const dottedPolylineOptions = {color: "url(#polylineGradient)", weight: 8, dashArray: '5, 10'};

const RenderPolyline = ({polyline, firstCoordinate, lastCoordinate, estimatedDistance}: RenderPolylineProps) => {
    const [snap, setSnap] = useState<number | string | null>("148px");
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const [selected, setSelected] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState<LatLngLiteral | null>(null);
    const map = useMap();

    // Ensure polyline is not undefined or empty before proceeding
    useEffect(() => {
        if (polyline && polyline.length > 0) {
            const bounds = L.latLngBounds(polyline);
            map.fitBounds(bounds, {padding: [50, 50]});
            setDrawerOpen(true); // Open Drawer when polyline is rendered
        } else {
            console.error("Polyline data is invalid:", polyline);
        }
    }, [polyline, map]);

    useEffect(() => {
        if (lastCoordinate) {
            map.eachLayer(async (layer) => {
                if (layer instanceof L.Marker) {
                    if (layer.getLatLng().equals(lastCoordinate)) {
                        await new Promise((r) => setTimeout(r, 1600));
                        // @ts-ignore
                        if (layer.bounce) {
                            // @ts-ignore
                            layer.bounce();
                            setTimeout(() => {
                                // @ts-ignore
                                if (layer.stopBouncing) {
                                    // @ts-ignore
                                    layer.stopBouncing();
                                }
                            }, 3000);
                        }
                    }
                }
            });
        }
    }, [lastCoordinate, map]);

    useEffect(() => {
        if (polyline && polyline.length > 0) {
            const midpointIndex = Math.floor(polyline.length / 2);
            setPopupPosition(polyline[midpointIndex] as LatLngLiteral);
        }
    }, [polyline]);

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
        setSelected(!selected);
        setDrawerOpen(true); // Open Drawer when polyline is clicked
        if (!selected) {
            setPopupPosition(e.latlng);
        } else {
            setPopupPosition(null);
        }
    };

    const getDottedPolylineStart = () => {
        const fromGeom = parsePoint(locationQuery.from?.geom);
        const liveLocation = useLocationQueryStore((s) => s.liveLocationLatLng);
        const userMarkerLocation = useLocationQueryStore((s) => s.userMarkerLocation);
        if (firstCoordinate && fromGeom) {
            return [firstCoordinate, fromGeom];
        } else if (firstCoordinate && userMarkerLocation) {
            return [firstCoordinate, userMarkerLocation];
        } else if (firstCoordinate && liveLocation) {
            return [firstCoordinate, liveLocation];
        }
        return null;
    };


    const getDottedPolylineEnd = () => {
        const toGeom = parsePoint(locationQuery.to?.geom);
        if (lastCoordinate && toGeom) {
            return [lastCoordinate, toGeom];
        }
        return null;
    };

    return (
        <>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} snapPoints={["300px", "355px", 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
            >
                <DrawerContent
                    className="pb-20 z-[10000000] top-[50px] max-h-[50%]"> {/* Adjust the `top` and `max-height` */}
                    <DrawerHeader>
                        <DrawerTitle>Route Information</DrawerTitle>
                        <DrawerDescription>
                            {estimatedDistance && `Estimated distance: ${estimatedDistance} meters`}
                        </DrawerDescription>
                    </DrawerHeader>

                    {/* Render destination images using ImageLayoutGrid if available */}
                    {locationQuery?.to?.name && locationQuery?.to?.image_urls && locationQuery.to.image_urls.length > 0 && (
                        <div className="mt-4">
                            <p className='font-medium sm:text-sm md:text-lg text-center'>Destination: {locationQuery.to.name}</p>
                            <ImageLayoutGrid images={locationQuery.to.image_urls}/>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>

            {lastCoordinate && estimatedDistance !== null && (
                <Marker icon={markerIconRed} interactive position={lastCoordinate}>
                    <Popup>
                        <div className='border-[0.1rem] border-primary rounded-xl p-3 text-sm md:text-base'>
                            <p className='font-medium text-sm md:text-lg'>
                                Here is your Destination <IoAccessibility size={25} className='inline' color='green'/>
                                <p className='font-bold'>{locationQuery?.to?.name}</p>
                            </p>
                            <p className='font-medium text-sm md:text-lg'>
                                Should take
                                about {estimateWalkingTime(estimatedDistance) === 0 ? "less than a minute" : `${estimateWalkingTime(estimatedDistance)} ${estimateWalkingTime(estimatedDistance) === 1 ? "minute" : "minutes"}`}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}

            {polyline && polyline.length > 0 && (
                <>
                    <Polyline
                        positions={polyline}
                        pathOptions={{
                            color: selected ? clickedPolylineOptions.color : polylineOptions.color,
                            weight: polylineOptions.weight,
                            interactive: true,
                        }}
                        eventHandlers={{
                            click: handlePolylineClick,
                        }}
                    />

                    <Polyline
                        positions={polyline}
                        pathOptions={{
                            color: 'transparent',
                            weight: polylineOptions.weight + 20,
                            interactive: true,
                        }}
                        eventHandlers={{
                            click: handlePolylineClick,
                        }}
                    />
                </>
            )}

            {popupPosition && selected && (
                <Popup position={popupPosition}>
                    <div
                        className='flex md:flex-row justify-between items-center rounded-xl text-nowrap text-sm md:text-base '>
                        <BsPersonWalking color='green' className='mr-1 sm:mr-3 ' size={25}/>
                        <p className='font-medium text-sm md:text-lg'>
                            {estimateWalkingTime(estimatedDistance) === 0 ? "less than a minute" : `${estimateWalkingTime(estimatedDistance)} ${estimateWalkingTime(estimatedDistance) === 1 ? "minute" : "minutes"}`}
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
