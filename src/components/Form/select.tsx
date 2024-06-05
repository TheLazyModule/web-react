import {useState, useEffect, useRef} from "react";
import useSearchText from "@/hooks/useSearchText.ts";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";
import ModalComponent from "@/components/ui/modal.tsx";
import useSearchTextTo from "@/hooks/useSearchTextTo.ts";

const ComboBox = ({type, onSelect}) => {
    const searchText =
        type === "from" ? useLocationQueryStore((s) => s.searchTextFrom) : useLocationQueryStore((s) => s.searchTextTo);
    const setSearchText =
        type === "from" ? useLocationQueryStore((s) => s.setSearchTextFrom) : useLocationQueryStore((s) => s.setSearchTextTo);
    const {data, error, isLoading, isFetched} = type === "from" ? useSearchText() : useSearchTextTo();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);


    const handleOptionSelect = (value) => {
        setSearchText(value);
        setDropdownVisible(false);
        onSelect(value); // Notify the parent form about the selection
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setDropdownVisible(true);
    };


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {error && <ModalComponent message={error.message}/>}
            <div className="border rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
                <div className="max-w-sm" ref={dropdownRef}>
                    {/* Search Box */}
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                            <svg
                                className="flex-shrink-0 size-4 text-gray-400 dark:text-white/60"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                        </div>
                        <input
                            className="py-3 ps-10 pe-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            type="text"
                            placeholder="Type your location"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {dropdownVisible && isFetched && searchText && searchText.length >= 2 && (
                        <div
                            className="absolute z-50 w-full bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-800">
                            <div className="max-h-[300px] p-2 rounded-b-xl overflow-y-auto">
                                {data && data?.map((r) => (
                                    <div
                                        key={r.id}
                                        onClick={() => handleOptionSelect(r.name)}
                                        className="cursor-pointer p-2 space-y-0.5 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200"
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <div>{r.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchText && isLoading && (
                        <div
                            className="absolute z-50 w-full bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-800">
                            <div className="max-h-[300px] p-2 rounded-b-xl overflow-y-auto">
                                <div
                                    className="cursor-pointer p-2 space-y-0.5 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200">
                                    <div className="flex justify-between items-center w-full">
                                        <div>Loading...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {searchText && data && data?.length === 0 && (
                        <div
                            className="absolute z-50 w-full bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-800">
                            <div className="max-h-[300px] p-2 rounded-b-xl overflow-y-auto">
                                <div
                                    className="cursor-pointer p-2 space-y-0.5 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200">
                                    <div className="flex justify-between items-center w-full">
                                        <div>No results</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ComboBox;
