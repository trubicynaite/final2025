import { Outlet } from "react-router";

import Header from "../UI/organisms/Header";
import Footer from "../UI/organisms/Footer";

const MainOutlet = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default MainOutlet;