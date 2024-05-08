import {create} from 'zustand'

export interface LocationQuery {
    from: string;
    to: string;
    searchText?: string;
    location?: string;
}

export interface LocationQueryStore {
    locationQuery: LocationQuery;
    setFrom: (from: string) => void;
    setTo: (to: string) => void;
    setSearchText: (searchText?: string) => void;
    setLocation: (location?: string) => void;
}


const useLocationQueryStore = create<LocationQueryStore>((set) => ({
    locationQuery: {},
    setFrom: (from: string) => set((store) => ({locationQuery: {...store.locationQuery, from}})),
    setTo: (to: string) => set((store) => ({locationQuery: {...store.locationQuery, to}})),
    setSearchText: (searchText?: string) => set((store) => ({locationQuery: {...store.locationQuery, searchText}})),
    setLocation: (location?: string) => set((store) => ({locationQuery: {...store.locationQuery, location}}))
}))

export default useLocationQueryStore;