import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


const ErrorPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Refresh the page
        window.location.reload();
        // Immediately navigate to the map page
        navigate("/map"); // Replace "/map" with the correct route for your map page
    }, [navigate]);


    // No need to render anything, as the user will be redirected immediately
    return null;
};

export default ErrorPage;