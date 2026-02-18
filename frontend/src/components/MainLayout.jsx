import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Banner from './Banner';
import WhatsAppButton from './WhatsAppButton';

const MainLayout = () => {
    return (
        <div className="app">
            <Banner />
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default MainLayout;
