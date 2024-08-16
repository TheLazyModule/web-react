import {useEffect, useState} from "react";
import {LayersControl, MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import Sidebar from "../Sidebar/Sidebar.tsx";
import {BounceLoader} from "react-spinners";
import usePolyline from "@/hooks/usePolyline.tsx";
import RenderPolyline from "@/components/RenderPolyline.tsx";
import "leaflet/dist/leaflet.css";
import ClickMarker from "@/components/ClickMarker.tsx";
import Searchbar from "@/components/Searchbar.tsx";
import {markerIconGreen} from "@/constants/constants.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import parsePoint from "@/utils/utils.ts";
import useOffline from "@/hooks/useOffline.ts";
// import {
//     Drawer,
//     DrawerContent,
//     DrawerDescription,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
// } from "@/components/ui/drawer";
// import {Button} from "@/components/ui/button.tsx";
// import {ImageLayoutGrid} from "@/components/LayoutGrid.tsx";

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
    const location = useLocationQueryStore((s) => s.singleLocation);
    const locationQuery = useLocationQueryStore((s) => s.locationQuery);
    const {polylineCoordinates, isLoading, roundedDistance, firstCoordinate, lastCoordinate} = usePolyline();
    const [loading, setLoading] = useState(true);
    // const [/*isPolyLineSet*/_, setIsPolyLineSet] = useState(false);
    // const [shouldOpenDrawer, setShouldOpenDrawer] = useState(false);
    // const [drawerClosedByUser, setDrawerClosedByUser] = useState(false); // New state variable to track manual close
    // const [snap, setSnap] = useState<number | string | null>("148px");
    useOffline();

    // useEffect(() => {
    //     if (polylineCoordinates && polylineCoordinates.length > 0) {
    //         setIsPolyLineSet(true);
    //         if (!drawerClosedByUser) {
    //             setShouldOpenDrawer(true);  // Open drawer when polyline is ready if not manually closed
    //         }
    //     } else {
    //         setIsPolyLineSet(false);
    //         setShouldOpenDrawer(false);  // Close drawer when there is no polyline
    //     }
    // }, [polylineCoordinates, drawerClosedByUser]);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const {BaseLayer} = LayersControl;

    const parsedLocation = location ? parsePoint(location.geom) : null;

    // const handleCloseDrawer = () => {
    //     setShouldOpenDrawer(false);
    //     setDrawerClosedByUser(true);  // Indicate that the drawer was manually closed
    // };

    return (
        <div className="relative">
            <Searchbar/>
            <Sidebar position="left" theme="light"/>

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
                    backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px"
                }}
                whenReady={() => setLoading(false)}
            >
                <LayersControl>
                    <BaseLayer checked name="knust_tms">
                        <TileLayer
                            tms
                            url="https://knust-tms.intdeltas.com/tms/{z}/{x}/{y}.png"
                            maxZoom={22}
                            minZoom={2}
                        />
                    </BaseLayer>
                    {parsedLocation && !locationQuery.from?.name && !locationQuery.to?.name && (
                        <>
                            <FlyToLocation location={parsedLocation}/>
                            <Marker icon={markerIconGreen} draggable position={parsedLocation}>
                                <Popup minWidth={200} maxWidth={500}>
                                    <div className="flex flex-col h-full w-full">
                                        <p className='text-lg font-bold'>{location?.name}</p>
                                        {location?.image_urls && location?.image_urls[0] && (
                                            <div className="flex-1">
                                                <img
                                                    src={location.image_urls[0]}
                                                    alt={location.name}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        </>
                    )}

                    {polylineCoordinates.length > 0 && (
                        <>
                            <RenderPolyline
                                polyline={polylineCoordinates}
                                firstCoordinate={firstCoordinate}
                                lastCoordinate={lastCoordinate}
                                estimatedDistance={roundedDistance}
                            />
                            {/*<Drawer open={shouldOpenDrawer} onOpenChange={setShouldOpenDrawer} fadeFromIndex={2}*/}
                            {/*        activeSnapPoint={snap}*/}
                            {/*        setActiveSnapPoint={setSnap}*/}
                            {/*        snapPoints={["148px", "355px", 1]}>*/}
                            {/*    <DrawerContent*/}
                            {/*        className="z-[100000000000] "> /!* Ensure it's positioned at the bottom *!/*/}
                            {/*        <DrawerHeader className='flex flex-row justify-between'>*/}
                            {/*            <div>*/}
                            {/*                <DrawerTitle className='text-2xl'>Route Information</DrawerTitle>*/}
                            {/*                <DrawerDescription>*/}
                            {/*                    Shortest path*/}
                            {/*                    from <strong>{locationQuery.from?.name}</strong> to <strong> {locationQuery.to?.name}</strong>*/}
                            {/*                </DrawerDescription>*/}
                            {/*            </div>*/}

                            {/*            <div className='flex flex-row justify-between p-5 text-foreground'>*/}
                            {/*                <Button variant='default' onClick={handleCloseDrawer}>Close</Button>*/}
                            {/*            </div>*/}
                            {/*        </DrawerHeader>*/}
                            {/*        <div className='h-[1px] w-full bg-input'></div>*/}
                            {/*        <div className="flex flex-col overflow-auto max-h-[65vh] p-4 pb-0 text-foreground">*/}
                            {/*            {locationQuery.to?.image_urls && locationQuery.to.image_urls.length > 0 ? (*/}
                            {/*                <ImageLayoutGrid images={locationQuery.to.image_urls}/>*/}
                            {/*            ) : (*/}
                            {/*                <p className="text-center text-sm text-muted-foreground">*/}
                            {/*                    No images available.*/}
                            {/*                </p>*/}
                            {/*            )}*/}
                            {/*        </div>*/}
                            {/*        <DrawerFooter></DrawerFooter>*/}
                            {/*    </DrawerContent>*/}
                            {/*</Drawer>*/}
                        </>
                    )}

                    <ClickMarker firstCoordinate={firstCoordinate}/>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default MapView;
