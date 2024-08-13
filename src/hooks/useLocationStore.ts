import {create} from 'zustand'
import {LatLngExpression} from "leaflet";
import {Option} from "@/constants/constants.ts";

export interface LocationQuery {
    from?: Option;
    from_location?: string;
    to?: Option;
}

export interface ILocation {
    name: string;
    geom: string;
    geom_geographic: string
}

export interface LocationQueryStore {
    locationQuery: LocationQuery;
    searchTextFrom?: string;
    searchTextTo?: string;
    location?: { name?: string, geom?: string, image_urls?: string[] }
    userMarkerLocation?: LatLngExpression | null;
    setFrom: (from: Option) => void;
    setFromLocation: (from_location: string) => void;
    setTo: (to: Option) => void;
    setSearchTextFrom: (searchText: string) => void;
    setSearchTextTo: (searchText: string) => void;
    setLocationName: (name?: string) => void;
    setLocationGeom: (geom?: string) => void;
    setLocationImgUrl: (image_urls?: string[]) => void;
    setUserMarkerLocation: (location: LatLngExpression | null) => void
}


const useLocationQueryStore = create<LocationQueryStore>((set) => ({
    locationQuery: {from: {} as Option, to: {} as Option, from_location: ''},
    searchTextFrom: '',
    searchTextTo: '',
    location: {name: '', geom: '', image_urls: []},
    userMarkerLocation: null,
    setFrom: (from: Option) => set((store) => ({locationQuery: {...store.locationQuery, from}})),
    setFromLocation: (from_location?: string) => set((store) => ({
        locationQuery: {
            ...store.locationQuery,
            from_location
        }
    })),
    setTo: (to: Option) => set((store) => ({locationQuery: {...store.locationQuery, to}})),
    setSearchTextFrom: (searchTextFrom: string) => set((store) => ({...store, searchTextFrom})),
    setSearchTextTo: (searchTextTo: string) => set((store) => ({...store, searchTextTo})),
    setLocationName: (name?: string) => set((store) => ({location: {...store.location, name}})),
    setLocationGeom: (geom?: string) => set((store) => ({location: {...store.location, geom}})),
    setLocationImgUrl: (image_urls?: string[]) => set((store) => ({location: {...store.location, image_urls}})),
    setUserMarkerLocation: (userMarkerLocation?: LatLngExpression | null) => set((store) => ({
        ...store,
        userMarkerLocation
    }))
}))

export default useLocationQueryStore;