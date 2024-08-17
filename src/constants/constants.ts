import L from "leaflet";
import marker from "@/assets/location.svg";
import markerGreen from "@/assets/location_green.png";
import buildingIconImg from '@/assets/b1.svg'; // Replace with actual path
import placeIconImg from '@/assets/p1.svg'; // Replace with actual path
import b1 from "@/assets/b2.svg";
import p1 from "@/assets/p1.svg";
import c1 from "@/assets/c1.svg";

export const UserLocation = "My Location";


export const markerIconRed = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
});

export const markerIconGreen = new L.Icon({
    iconUrl: markerGreen,
    iconRetinaUrl: markerGreen,
    popupAnchor: [-0, -0],
    iconSize: [32, 32],

});

export interface OptionValue {
    id: string;
    name: string;
    category_id: number;
    geom: string;
    image_urls?: string[];
}
export const categoriesData = [
    {id: 0, name: "All"},
    {id: 1, name: "Building", img: b1},
    {id: 2, name: "Places", img: p1},
    {id: 3, name: "Classroom", img: c1},
];


export const buildingIcon = new L.Icon({
    iconUrl: buildingIconImg,
    iconSize: [40, 40],
    iconAnchor: [14, 27],
    popupAnchor: [0, -25],
});

export const placeIcon = new L.Icon({
    iconUrl: placeIconImg,
    iconSize: [40, 40],
    iconAnchor: [14, 27],
    popupAnchor: [0, -25],
});
// iconCreateFunction={createClusterCustomIcon}
// maxClusterRadius={150}
// spiderfyOnMaxZoom={true}
// polygonOptions={{
//     fillColor: '#ffffff',
//         color: '#f00800',
//         weight: 5,
//         opacity: 1,
//         fillOpacity: 0.8,
// }}
// showCoverageOnHover={true}
