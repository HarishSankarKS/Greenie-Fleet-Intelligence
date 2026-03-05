import { TrendingUp, Zap } from 'lucide-react';

const AIFleetEfficiencyWidget = () => {
    return (
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col justify-between h-32 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-colors"></div>

            <div className="flex justify-between items-start z-10 w-full mb-2">
                <h3 className="text-slate-400 font-semibold tracking-wide text-xs uppercase flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500 fill-amber-500" />
                    AI Fleet Efficiency
                </h3>
                <div className="bg-amber-500/10 text-amber-500 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <TrendingUp size={12} />
                    +18%
                </div>
            </div>

            <div className="flex items-end justify-between z-10">
                <div>
                    <p className="text-3xl font-bold text-white mb-0.5">2.4k L</p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide border-t border-slate-800 pt-1 mt-1">FUEL SAVED TODAY</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-emerald-400">92%</p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide border-t border-slate-800 pt-1 mt-1">OPTIMAL ROUTES</p>
                </div>
            </div>
        </div>
    );
};

export default AIFleetEfficiencyWidget;
