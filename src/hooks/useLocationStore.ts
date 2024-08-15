import {create} from 'zustand'
import {LatLngExpression} from "leaflet";
import {OptionValue} from "@/constants/constants.ts";

export interface LocationQuery {
    from?: OptionValue;
    from_location?: string;
    to?: OptionValue;
}

export interface ILocation {
    name: string;
    geom: string;
    geom_geographic: string
}

export interface LocationQueryStore {
    liveLocation: string,
    selectedCategoryId: number;
    locationQuery: LocationQuery;
    searchTextFrom?: string;
    searchTextTo?: string;
    singleLocation?: { name?: string, geom?: string, image_urls?: string[] }
    userMarkerLocation?: LatLngExpression | null;
    setLiveLocation: (liveLocation: string) => void,
    setSelectedCategoryId: (selectedCategoryId: number) => void;
    setFrom: (from: OptionValue) => void;
    setFromLocation: (from_location: string) => void;
    setTo: (to: OptionValue) => void;
    setSearchTextFrom: (searchText: string) => void;
    setSearchTextTo: (searchText: string) => void;
    setLocationName: (name?: string) => void;
    setSingleLocationGeom: (geom?: string) => void;
    setLocationImgUrl: (image_urls?: string[]) => void;
    setUserMarkerLocation: (location: LatLngExpression | null) => void
}


const useLocationQueryStore = create<LocationQueryStore>((set) => ({
    liveLocation: "",
    selectedCategoryId: 0,
    locationQuery: {from: {} as OptionValue, to: {} as OptionValue, from_location: ''},
    searchTextFrom: '',
    searchTextTo: '',
    singleLocation: {name: '', geom: '', image_urls: []},
    userMarkerLocation: null,
    setLiveLocation: (liveLocation: string) => set((store) => ({...store, liveLocation})),
    setSelectedCategoryId: (selectedCategoryId: number) => set((store) => ({
        ...store,
        selectedCategoryId: selectedCategoryId
    })),
    setFrom: (from: OptionValue) => set((store) => ({locationQuery: {...store.locationQuery, from}})),
    setFromLocation: (from_location?: string) => set((store) => ({
        locationQuery: {
            ...store.locationQuery,
            from_location
        }
    })),
    setTo: (to: OptionValue) => set((store) => ({locationQuery: {...store.locationQuery, to}})),
    setSearchTextFrom: (searchTextFrom: string) => set((store) => ({...store, searchTextFrom})),
    setSearchTextTo: (searchTextTo: string) => set((store) => ({...store, searchTextTo})),
    setLocationName: (name?: string) => set((store) => ({singleLocation: {...store.singleLocation, name}})),
    setSingleLocationGeom: (geom?: string) => set((store) => ({singleLocation: {...store.singleLocation, geom}})),
    setLocationImgUrl: (image_urls?: string[]) => set((store) => ({
        singleLocation: {
            ...store.singleLocation,
            image_urls
        }
    })),
    setUserMarkerLocation: (userMarkerLocation?: LatLngExpression | null) => set((store) => ({
        ...store,
        userMarkerLocation
    }))
}))


export default useLocationQueryStore;