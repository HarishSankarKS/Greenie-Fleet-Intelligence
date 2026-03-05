import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastManager from './ToastManager';
import { useStore } from '../../store/useStore';

const AppLayout = () => {
    const { isDarkMode } = useStore();
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Operations Dashboard';
            case '/sites': return 'Collection Sites';
            case '/monitoring': return 'Monitoring / Map';
            case '/vehicles': return 'Vehicles Registry';
            case '/analytics': return 'Analytics & Reports';
            default: return 'GREENIE Autonomous';
        }
    };

    return (
        <div className={`min-h-screen flex text-slate-900 transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-[#F8FAFC]'}`}>
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen relative">
                <Header title={getPageTitle()} />

                {/* Page Content injected here by React Router */}
                <div className="max-w-7xl mx-auto pb-12">
                    <Outlet />
                </div>
            </main>

            <ToastManager />
        </div>
    );
};

export default AppLayout;
