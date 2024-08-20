import {useEffect, useState} from 'react';
import './Sidebar.css';
import Form from '../Form/Form';
import {SiGoogleclassroom} from "react-icons/si";
import {LatLngExpression} from "leaflet";

interface SidebarProps {
    position: 'left' | 'right';
    theme: 'light' | 'dark';
    polyline: LatLngExpression[];
}

const Sidebar = ({position = 'left', theme = 'light', polyline}: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (polyline && polyline.length > 0) {
            setIsOpen(false)
        }
    }, [polyline, setIsOpen]);
    // Toggle the state of the sidebar
    const toggleSidebar = () => setIsOpen(!isOpen);

    // Construct class names based on state and props
    const sidebarClasses = ` sidepanel z-[100000000000]  sidepanel-${position} ${isOpen ? 'opened' : 'closed'} ${theme === 'dark' ? 'sidepanel-dark' : ''}`;

    return (
        <div className={sidebarClasses}>
            <div className="sidepanel-inner-wrapper ">
                <div className="sidepanel-content-wrapper  ">
                    <div className="sidepanel-content sm:mt-2 mt-12 ">
                        {/* Your sidebar content here */}

                        <div className='flex flex-col items-center sm:my-0'>
                            <SiGoogleclassroom size={90} color='#4F6F52'
                                               className="hover:opacity-50 hover:scale-110 transition duration-300 ease-in-out"/>

                        </div>
                        <Form/>

                    </div>
                </div>
            </div>
            <div className="sidepanel-toggle-container">
                <button onClick={toggleSidebar} className="sidepanel-toggle-button">
                </button>
            </div>
        </div>
    );
};

export default Sidebar;