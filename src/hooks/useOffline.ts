import {useEffect, useState} from 'react';
import toast from "react-hot-toast";

const UseOffline = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
        };

        const handleOnline = () => {
            setIsOffline(false);
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    useEffect(() => {
        if (isOffline) {
            toast.error("It seems you're offline");
        }
    }, [isOffline]);
};

export default UseOffline;