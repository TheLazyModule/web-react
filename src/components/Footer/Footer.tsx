import location from "@/assets/maps.png"
import {useLocation, Link} from "react-router-dom";

const Footer = () => {
    const currentLocation = useLocation().pathname.replace('/', '');
    const currentYear = new Date().getFullYear();
    return (
        <>
            <div className={`${currentLocation === 'map' ? 'hidden' : ''} bg-[#F5EFE6]`}>
                <div className="max-w-2xl mx-auto text-white py-10">
                    <div className="flex flex-col justify-center items-center text-center">
                        <h3 className="text-4xl mb-3 text-gray-600">Find Your Way. From Anywhere on Campus</h3>
                        <img src={location} className='h-36 w-36 my-2 hover:opacity-50 hover:scale-110 transition duration-300 ease-in-out' alt=""/>
                        <p className='text-gray-500'>Quickest way to navigate around campus</p>
                    </div>
                    <div
                        className="mt-28 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
                        <p className="order-2 md:order-1 mt-8 md:mt-0"> &copy; The lazy Module, {currentYear} </p>
                        <div className="order-1 md:order-2">
                            <Link to='/contact'>
                                <span className="px-2 border-l">Contact us</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;