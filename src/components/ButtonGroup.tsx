import {Button} from "@/components/ui/button.tsx";
import p1 from "@/assets/p1.svg";
import c1 from "@/assets/c1.svg";
import b1 from "@/assets/b2.svg";
import {useState} from "react";
import useLocationQueryStore from "@/hooks/useLocationStore.ts";

const data = [
    {id: 0, name: "All"},
    {id: 1, name: "Building", img: b1},
    {id: 3, name: "Classroom", img: c1},
    {id: 2, name: "Places", img: p1},
];

const ButtonGroup = () => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const setSelectedCategoryStore = useLocationQueryStore((s) => s.setSelectedCategoryId);

    const handleSelectCategory = (id: number) => {
        setSelectedCategoryId(id);
        setSelectedCategoryStore(id);
    };

    return (
        <div
            className="mb-8 inline-flex -space-x-0 divide-x  divide-gray-300 overflow-hidden rounded-2xl border border-gray-300 shadow-sm">
            {data.map((s) => (
                <Button
                    onClick={() => handleSelectCategory(s.id)}
                    key={s.id}
                    type="button"
                    className={`${
                        selectedCategoryId === s.id ? 'bg-secondary' : 'bg-background'
                    } inline-flex  items-center px-4 py-2.5 text-center text-sm font-medium text-secondary-700 shadow-sm hover:bg-secondary`}
                >
                    <span className="mr-2">
                        {s.img && <img src={s.img} className="h-8" alt={s.name}/>}
                    </span>
                    {!s.img && s.name}
                </Button>
            ))}
        </div>
    );
};

export default ButtonGroup;
