import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPinned, Map, Truck, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Collection Sites', path: '/sites', icon: <MapPinned size={20} /> },
        { name: 'Monitoring / Map', path: '/monitoring', icon: <Map size={20} /> },
        { name: 'Vehicles', path: '/vehicles', icon: <Truck size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 shadow-xl flex flex-col flex-shrink-0 transition-colors duration-200">
            <div className="font-bold text-2xl mb-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 shadow-md shadow-amber-500/20"></div>
                <span className="tracking-widest">GREENIE</span>
            </div>
            <nav className="flex-1 w-full space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                                ? 'bg-slate-800 text-amber-500 shadow-inner'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 w-full text-left">
                    <Settings size={20} />
                    Settings
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
