"use client";
import { LayoutGrid } from "@/components/ui/layout-grid";

export function ImageLayoutGrid({ images }) {
    // Debug: Log images to see what is being passed
    console.log("Images prop:", images);

    // Check if images is undefined or empty, and show skeletons if so
    if (!images || images.length === 0) {
        console.log("No images to display");
        return null;
    }

    const generateCards = (images) => {
        return images.map((image, index) => ({
            id: index + 1,
            content: null, // No text content, just the image
            className: index % 2 === 0 ? "md:col-span-2" : "col-span-1", // Alternate sizes for variety
            thumbnail: image,
        }));
    };

    const cards = generateCards(images);

    // Debug: Log the cards to verify they are generated correctly
    console.log("Generated cards:", cards);

    return (
        <div className="h-screen w-full">
            <LayoutGrid cards={cards} />
        </div>
    );
}
