import SummaryWidget from '../components/dashboard/SummaryWidget';
import FleetStatusChart from '../components/dashboard/FleetStatusChart';
import AIFleetEfficiencyWidget from '../components/dashboard/AIFleetEfficiencyWidget';
import ChargingStatusRing from '../components/dashboard/ChargingStatusRing';

const Dashboard = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Total Units with Human vs Auto breakdown */}
                <SummaryWidget
                    title="Total Fleet Units"
                    value="124"
                >
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between text-xs font-medium">
                        <div className="flex flex-col">
                            <span className="text-slate-400">Human-Driven</span>
                            <span className="text-slate-700 dark:text-slate-300 text-sm">96</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-amber-500">Auto Bots</span>
                            <span className="text-amber-600 dark:text-amber-400 text-sm">28</span>
                        </div>
                    </div>
                </SummaryWidget>

                <SummaryWidget
                    title="Active Units"
                    value="84"
                    subtext="/ 124"
                    highlightColorClass="text-emerald-600"
                    backgroundHighlightClass="bg-emerald-500/10"
                />

                <SummaryWidget
                    title="Pending Collections"
                    value="23"
                    subtext="Awaiting Dispatch"
                    highlightColorClass="text-rose-500"
                    backgroundHighlightClass="bg-rose-500/10"
                />

                {/* AI Efficiency Widget matches the height (h-32) but has custom styling in its own component */}
                <div className="h-full">
                    <AIFleetEfficiencyWidget />
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Map Placeholder for now since that's a whole module in itself */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 min-h-[400px] flex flex-col relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4 z-10">
                            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Live Routing Overview</h3>
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">AI Active</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 z-10 transition-colors group-hover:bg-slate-100 dark:group-hover:bg-slate-900">
                            <div className="text-center">
                                <p className="text-slate-400 dark:text-slate-500 font-medium mb-2">Dynamic AI Routing Map Area</p>
                                <p className="text-xs text-slate-400 dark:text-slate-600">Mapbox / Leaflet integration pending</p>
                            </div>
                        </div>

                        {/* Background Glow */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>

                {/* Right Sidebar Charts */}
                <div className="flex flex-col gap-6">
                    <FleetStatusChart />
                    <ChargingStatusRing />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
