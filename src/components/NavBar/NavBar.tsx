import {useState} from 'react';
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai';
import {NavLink, useLocation} from 'react-router-dom';

const Navbar = () => {
    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);
    const currentLocation = useLocation().pathname.replace('/', '');


    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

    // Array containing navigation items
    const navItems = [
        {id: 1, text: 'Home'},
        {id: 2, text: 'Map'},
        {id: 3, text: 'Contact'},
        // {id: 2, text: 'About'},
    ];

    return (
        <nav
            className={`${currentLocation === 'map'? 'hidden': ''} ${currentLocation === 'contact'? '': ''}`}>
            <div
                className={ `z-[90000] ${currentLocation? 'bg-white': 'bg-transparent'}  flex justify-end md:justify-center  items-center  mx-auto h-20 px-4 absolute left-0 right-0 top-0 w-full` }>

                {/* Desktop Navigation */}
                <ul className='hidden md:flex'>
                    {navItems.map(item => (
                        <NavLink  key={item.id} to={item.text.toLowerCase() === 'home' ? '/' : `/${item.text.toLowerCase()}`}>
                            <li
                                key={item.id}
                                className={ `p-3 ${currentLocation === ''? 'text-white hover:bg-white hover:text-green-700': 'text-green-700 hover:bg-green-700 hover:text-white'}  hover:font-bold   rounded-xl m-2 cursor-pointer duration-500   sm:text-[0.5rem] md:text-[1.2rem] text-transparent` }
                            >
                                {item.text}
                            </li>
                        </NavLink>
                    ))}
                </ul>

                {/* Mobile Navigation Icon */}
                <div onClick={handleNav} className='block md:hidden'>
                    {nav ? <AiOutlineClose className='invert' size={20}/> :
                        <AiOutlineMenu className='invert' size={20}/>}
                </div>

                {/* Mobile Navigation Menu */}
                <ul
                    className={`z-[5000] ${
                        nav
                            ? ' fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900  ease-in-out duration-500 bg-green-300/15'
                            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                    }`
                    }
                >

                    {/* Mobile Navigation Items */}
                    {navItems.map(item => (
                        <NavLink key={item.id} to={item.text.toLowerCase() === 'home' ? '/' : `/${item.text.toLowerCase()}`}>
                        <li
                            key={item.id}
                            className='p-4 text-xl border-b rounded-xl cursor-pointer duration-300  hover:bg-white hover:text-green-700 hover:font-bold text-white   m-2     sm:text-[1rem] md:text-[1.2rem] text-transparent'
                        >
                            {item.text}
                        </li>
                        </NavLink>
                    ))}
                </ul>
            </div>

            {/*<div className="relative mt-20 flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">*/}
            {/*    <div*/}
            {/*        className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 "/>*/}
            {/*    <div*/}
            {/*        className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>*/}
            {/*</div>*/}

        </nav>
    );
};

export default Navbar;
