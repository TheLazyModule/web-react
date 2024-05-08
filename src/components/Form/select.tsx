// SelectWithSearch.tsx
"use client";
import * as React from "react";
import debounce from "lodash.debounce";
import APIClient from "@/services/apiClient.ts";

interface Option {
    id: string;
    text: string;
}

interface SelectWithSearchProps extends React.HTMLAttributes<HTMLDivElement> {
    placeholder?: string;
    name?: string;
    className?: string;
}

const apiClient = new APIClient<Option[]>("/all/search");

const SelectWithSearch = React.forwardRef<HTMLDivElement, SelectWithSearchProps>(
    ({ placeholder = "Search...", name, className, ...props }, ref) => {
        // Ensure query is always a non-null string
        const [query, setQuery] = React.useState<string>("");
        const [options, setOptions] = React.useState<Option[]>([]);
        const [_selected, setSelected] = React.useState<Option | null>(null);
        const [loading, setLoading] = React.useState(false);
        const [showDropdown, setShowDropdown] = React.useState(false);

        // Debounced search function
        const debouncedSearch = React.useMemo(
            () => debounce((input: string) => fetchOptions(input), 300),
            []
        );

        // Fetch suggestions from backend
        async function fetchOptions(input: string) {
            if (input.length < 2) return; // Avoid querying for very short input
            setLoading(true);
            try {
                const response = await apiClient.getAll({ params: { text: input } });
                setOptions(response || []);
            } catch (error) {
                console.error("Error fetching options:", error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }

        // Handle input changes
        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const input = event.target.value;
            setQuery(input);
            debouncedSearch(input);
            setShowDropdown(true);
        };

        // Handle option selection
        const handleOptionSelect = (option: Option) => {
            setSelected(option);
            setQuery(option.text || ""); // Ensure query is not null
            setShowDropdown(false);
        };

        // Clear selection if needed
        const handleInputClear = () => {
            setQuery(""); // Reset to an empty string, not null or undefined
            setSelected(null);
            setShowDropdown(false);
        };

        return (
            <div ref={ref} className={`relative ${className}`} {...props}>
                <input
                    type="text"
                    name={name}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleInputClear} className="absolute right-2 top-2">
                    ✖
                </button>
                {showDropdown && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md">
                        {loading ? (
                            <li className="p-2 text-center text-gray-500">Loading...</li>
                        ) : (
                            options.map((option) => (
                                <li
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option)}
                                    className="p-3 z-[5000] cursor-pointer hover:bg-blue-500 text-black hover:text-white"
                                >
                                    {option.text}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        );
    }
);
SelectWithSearch.displayName = "SelectWithSearch";

export default SelectWithSearch;
