// import {FaRoute} from "react-icons/fa6";
// import {NavLink, useLocation} from "react-router-dom";

import {Link} from "react-router-dom";

const Footer = () => {
    // const currentLocation = useLocation().pathname.replace('/', '');
    const currentYear = new Date().getFullYear();
    return (
        <>
            <div className=" bg-[#F5EFE6]">
                <div className="max-w-2xl mx-auto text-white py-10">
                    <div className="text-center">
                        <h3 className="text-4xl mb-3 text-gray-600"> Download now </h3>
                        <p className='text-gray-500'>Quickest way to navigate around campus</p>
                        <div className="flex justify-center my-10 ">
                            <Link to='#'>
                                <div
                                    className="flex items-center hover:bg-[#4F6F52]   text-gray-900 hover:text-gray-200 border-2 border-green  w-auto rounded-xl px-4 py-2 w-52 mx-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                                         className="w-7 md:w-8" alt=''/>
                                    <div className="text-left fl-3 ">
                                        <p className='text-xs '>Download on </p>
                                        <p className="text-sm md:text-base"> Google Play Store </p>
                                    </div>
                                </div>
                            </Link>
                            <Link to='#'>
                                <div
                                    className="flex items-center hover:text-white  text-gray-900 hover:bg-[#4F6F52] border-green border-2 w-auto rounded-xl px-4 py-2 w-44 mx-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                                         className="w-7 md:w-8"
                                         alt=''/>
                                    <div className="text-left ml-3 ">
                                        <p className='text-xs'>Download on </p>
                                        <p className="text-sm md:text-base "> Apple Store </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div
                        className="mt-28 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
                        <p className="order-2 md:order-1 mt-8 md:mt-0"> &copy; The lazy Module, {currentYear} </p>
                        <div className="order-1 md:order-2">
                            <Link to='/about'>
                                <span className="px-2">About us</span>
                            </Link>
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