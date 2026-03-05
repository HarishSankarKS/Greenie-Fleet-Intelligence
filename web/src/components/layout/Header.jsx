import { Bell, Moon, Sun, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Header = ({ title }) => {
    const { isDarkMode, toggleDarkMode } = useStore();

    return (
        <header className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
            <div className="flex items-center gap-6">

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        title="Notifications"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-slate-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                    <div className="h-10 w-10 bg-slate-800 text-amber-500 rounded-full flex items-center justify-center font-bold">
                        AD
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-semibold text-slate-700 leading-none">Admin Dispatch</p>
                        <span className="text-xs text-slate-500">System Operator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
