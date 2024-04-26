import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar.tsx";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </>
    );
};

export default Layout;