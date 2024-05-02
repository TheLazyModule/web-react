import Footer from "@/components/Footer/Footer.tsx";
import NavBar from "@/components/NavBar/NavBar.tsx";
import {Outlet, useLocation} from "react-router-dom";

const Layout = () => {
    const currentLocation = useLocation().pathname.replace('/', '');

    return (
        <div className={`${currentLocation === 'contact' ? 'bg-[#F5EFE6]' : ''}`}>
            <NavBar />
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Layout;