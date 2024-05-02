import Footer from "@/components/Footer/Footer.tsx";
import NavBar from "@/components/NavBar/NavBar.tsx";
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