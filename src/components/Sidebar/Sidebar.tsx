import {useState} from 'react';
import './Sidebar.css';  // Ensure your CSS is properly imported
import Form from '../Form/Form';
import {SiGoogleclassroom} from "react-icons/si";

const Sidebar = ({position = 'left', theme = 'light'}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the state of the sidebar
    const toggleSidebar = () => setIsOpen(!isOpen);

    // Construct class names based on state and props
    const sidebarClasses = `sidepanel z-[9000] sidepanel-${position} ${isOpen ? 'opened' : 'closed'} ${theme === 'dark' ? 'sidepanel-dark' : ''}`;

    return (
        <div className={sidebarClasses}>
            <div className="sidepanel-inner-wrapper">
                <div className="sidepanel-content-wrapper">
                    <div className="sidepanel-content">
                        {/* Your sidebar content here */}

                        <div className='flex flex-col items-center sm:my-0'>
                            <SiGoogleclassroom size={90} color='#093850'
                                               className=" hover:opacity-50 hover:scale-110 transition duration-300 ease-in-out"/>

                        </div>
                        <Form/>

                    </div>
                </div>
            </div>
            <div className="sidepanel-toggle-container">
                <button onClick={toggleSidebar} className="sidepanel-toggle-button">
                    {/* Replace with your SVG icons */}
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="feather feather-chevron-left">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="feather feather-chevron-right">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
