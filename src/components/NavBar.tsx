import {useState} from 'react';
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai';
import {NavLink} from 'react-router-dom';
// import logo from '../assets/logos/logo-new.png';

const Navbar = () => {
    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

    // Array containing navigation items
    const navItems = [
        {id: 1, text: 'Home'},
        {id: 2, text: 'About'},
        {id: 3, text: 'Map'},
        {id: 3, text: 'Contact'},
    ];

    return (
        <nav
            className=''>
            <div
                className='z-[90000]  flex justify-center  items-center  mx-auto h-24 px-4 absolute left-0 right-0 top-0 w-full'>

                {/* Desktop Navigation */}
                <ul className='hidden md:flex'>
                    {navItems.map(item => (
                        <NavLink to={item.text.toLowerCase() === 'home' ? '/' : `/${item.text.toLowerCase()}`}>
                            <li
                                key={item.id}
                                className='p-3 hover:bg-white hover:text-cyan-500 hover:font-bold text-white  rounded-xl m-2 cursor-pointer duration-500   sm:text-[0.5rem] md:text-[1.2rem] text-transparent'
                            >
                                {item.text}
                            </li>
                        </NavLink>
                    ))}
                </ul>

                {/* Mobile Navigation Icon */}
                <div onClick={handleNav} className='block items-end md:hidden'>
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
                    {/* Mobile Logo */}
                    <div className='w-full text-3xl font-bold  m-4'><img src="/logo-new.png" alt=""/></div>

                    {/* Mobile Navigation Items */}
                    {navItems.map(item => (
                        <li
                            key={item.id}
                            className='p-4 border-b rounded-xl cursor-pointer duration-300  bg-clip-text sm:text-[0.5rem] md:text-[1.2rem] text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 border-gray-400'
                        >
                            {item.text}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative mt-24 flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
                <div
                    className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 "/>
                <div
                    className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]"/>

                <div
                    className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
                <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
                <div
                    className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>

                <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
            </div>

        </nav>
    );
};

export default Navbar;
