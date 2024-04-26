import {useLocation} from "react-router-dom";

const Footer = () => {
    const currentLocation = useLocation().pathname.replace('/', '');
    return (
        <div className={`${currentLocation === 'map'? 'hidden': ''}`}>
            <h1>Footer</h1>
        </div>
    );
};

export default Footer;