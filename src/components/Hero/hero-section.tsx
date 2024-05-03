import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts"; // Assuming the cn utility handles classname combinations

export const ImagesSlider = ({
                                 images,
                                 children,
                                 overlay = true,
                                 overlayClassName,
                                 className,
                                 autoplay = true,
                             }): React.JSX.Element => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);

    // Load images on mount
    useEffect(() => {
        const loadImages = () => {
            const loadPromises = images.map(image =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = image;
                    img.onload = () => resolve(image);
                    img.onerror = reject;
                })
            );

            Promise.all(loadPromises)
                .then(loaded => setLoadedImages(loaded as string[]))
                .catch(error => console.error("Failed to load images", error));
        };

        loadImages();
    }, [images]);

    // Handle key presses for navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                handleNext();
            } else if (event.key === "ArrowLeft") {
                handlePrevious();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Autoplay functionality
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (autoplay) {
            interval = setInterval(handleNext, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoplay ]);

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev - 1 < 0 ? images.length - 1 : prev - 1));
    };

    // Motion variants for fading in and out
    const fadeVariants = {
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className={cn("overflow-hidden h-full w-full relative flex items-center justify-center", className)}>
            {overlay && (
                <div className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)} />
            )}
            <AnimatePresence>
                {loadedImages.length > 0 && (
                    <motion.img
                        key={currentIndex}
                        src={loadedImages[currentIndex]}
                        variants={fadeVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        className="image h-full w-full absolute inset-0 object-cover object-center"
                    />
                )}
            </AnimatePresence>
            {children}
        </div>
    );
};

export default ImagesSlider;
