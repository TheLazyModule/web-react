"use client";
import {LayoutGrid} from "@/components/ui/layout-grid";

export function ImageLayoutGrid({images}) {
    const generateCards = (images) => {
        return images.map((image, index) => ({
            id: index + 1,
            content: null, // No text content, just the image
            className: index % 2 === 0 ? "md:col-span-2" : "col-span-1", // Alternate sizes for variety
            thumbnail: image,
        }));
    };

    const cards = generateCards(images);

    return (
        <div className="h-screen w-full">
            <LayoutGrid cards={cards}/>
        </div>
    );
}
