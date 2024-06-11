import {create} from 'zustand'

export interface LocationQuery {
    from?: string;
    from_location?: string;
    to?: string;
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
    locationName?: string;
    setFrom: (from: string) => void;
    setFromLocation: (from_location: string) => void;
    setTo: (to: string) => void;
    setSearchTextFrom: (searchText: string) => void;
    setSearchTextTo: (searchText: string) => void;
    setLocation: (location?: string) => void;
}


const useLocationQueryStore = create<LocationQueryStore>((set) => ({
    locationQuery: {from: '', to: '', from_location: ''},
    searchTextFrom: '',
    searchTextTo: '',
    locationName: '',
    setFrom: (from: string) => set((store) => ({locationQuery: {...store.locationQuery, from}})),
    setFromLocation: (from_location?: string) => set((store) => ({
        locationQuery: {
            ...store.locationQuery,
            from_location
        }
    })),
    setTo: (to: string) => set((store) => ({locationQuery: {...store.locationQuery, to}})),
    setSearchTextFrom: (searchTextFrom: string) => set((store) => ({...store, searchTextFrom})),
    setSearchTextTo: (searchTextTo: string) => set((store) => ({...store, searchTextTo})),
    setLocation: (locationName?: string) => set((store) => ({...store, locationName}))
}))

export default useLocationQueryStore;