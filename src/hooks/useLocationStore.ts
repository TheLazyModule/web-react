import {create} from 'zustand'

export interface LocationQuery {
    from?: string;
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
    setTo: (to: string) => void;
    setSearchTextFrom: (searchText: string) => void;
    setSearchTextTo: (searchText: string) => void;
    setLocation: (location?: string) => void;
}


const useLocationQueryStore = create<LocationQueryStore>((set) => ({
    locationQuery: {from: '', to: ''},
    searchTextFrom: '',
    searchTextTo: '',
    locationName: '',
    setFrom: (from: string) => set((store) => ({locationQuery: {...store.locationQuery, from}})),
    setTo: (to: string) => set((store) => ({locationQuery: {...store.locationQuery, to}})),
    setSearchTextFrom: (searchTextFrom: string) => set((store) => ({...store, searchTextFrom})),
    setSearchTextTo: (searchTextTo: string) => set((store) => ({...store, searchTextTo})),
    setLocation: (locationName?: string) => set((store) => ({...store, locationName}))
}))

export default useLocationQueryStore;