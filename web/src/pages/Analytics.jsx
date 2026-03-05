import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { IndianRupee, Layers, Camera, Maximize2 } from 'lucide-react';

const chartColors = {
    Concrete: '#94a3b8',   // slate-400
    Timber: '#d97706',     // amber-600
    Metals: '#3b82f6',     // blue-500
    Plastics: '#10b981',   // emerald-500
    Aggregate: '#64748b'   // slate-500
};

const initialWasteData = [
    { name: 'Concrete', value: 1250 },
    { name: 'Timber', value: 430 },
    { name: 'Metals', value: 890 },
    { name: 'Plastics', value: 310 },
    { name: 'Aggregate', value: 2100 }
];

const Analytics = () => {
    const [wasteData, setWasteData] = useState(initialWasteData);
    const [revenue, setRevenue] = useState(659040);
    const [scannedItem, setScannedItem] = useState(null);

    // Simulate real-time automated AI Auditing hook
    useEffect(() => {
        const interval = setInterval(() => {
            const types = ['Concrete', 'Timber', 'Metals', 'Plastics', 'Aggregate'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const addedVolume = Math.floor(Math.random() * 5) + 1;
            const addedRevenue = addedVolume * 120; // Simulated price per unit

            setScannedItem({ type: randomType, conf: (Math.random() * 15 + 84).toFixed(1) });

            setWasteData(prev => prev.map(item =>
                item.name === randomType ? { ...item, value: item.value + addedVolume } : item
            ));

            setRevenue(prev => prev + addedRevenue);

            setTimeout(() => setScannedItem(null), 1500);
        }, 3000); // New item added every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

            {/* Top Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-8 flex items-center justify-between group">
                    <div>
                        <h3 className="text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase text-sm tracking-wider">Total Revenue Generated</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                                <IndianRupee size={32} strokeWidth={2.5} />
                                {(revenue / 1000).toFixed(1)}K
                            </span>
                            <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded ml-2 animate-pulse">Syncing...</span>
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-500 group-hover:scale-110 transition-transform">
                        <Layers size={32} />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-8 flex items-center justify-between group">
                    <div>
                        <h3 className="text-slate-500 dark:text-slate-400 font-semibold mb-1 uppercase text-sm tracking-wider">Avg Collections Per Site</h3>
                        <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">14.2</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-full text-amber-500 group-hover:scale-110 transition-transform">
                        <IndianRupee size={32} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Live AI Segregation Feed */}
                <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 relative overflow-hidden flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-4 z-10">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <Camera size={20} className="text-amber-500" />
                            Live Transfer Station Feed
                        </h3>
                        <button className="text-slate-400 hover:text-white transition-colors"><Maximize2 size={18} /></button>
                    </div>

                    <div className="flex-1 rounded-xl bg-black border border-slate-700 relative overflow-hidden flex items-center justify-center">
                        {/* Mock Conveyor Belt Background */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat animate-conveyor-belt"></div>

                        {/* Live Scanner Head */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"></div>

                        {scannedItem ? (
                            <div className="absolute p-4 border-2 border-emerald-400 bg-emerald-900/40 backdrop-blur-sm rounded z-30 animate-in zoom-in-50 duration-200">
                                <div className="text-emerald-400 font-bold text-sm bg-black/60 px-2 py-1 absolute -top-3 -left-2 rounded">
                                    {scannedItem.type} {scannedItem.conf}%
                                </div>
                            </div>
                        ) : (
                            <span className="text-slate-600 font-mono text-sm z-30 tracking-widest mt-24">AWAITING OBJECT...</span>
                        )}

                        {/* Feed Overlay status */}
                        <div className="absolute bottom-4 left-4 bg-black/80 px-2 py-1 rounded border border-slate-800 text-[10px] text-slate-300 font-mono tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            CS-001 MAIN BELT | YOLOv8 ACTIVE | 14.8 FPS
                        </div>
                    </div>
                </div>

                {/* Auditing Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col min-h-[400px]">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Waste by Type (Tons)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Automated volumetric auditing via computer vision.</p>
                    </div>
                    <div className="flex-1 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={wasteData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', opacity: 0.1 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {wasteData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[entry.name]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Live update indicator */}
                        <div className="absolute top-0 right-0 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            Live Sync
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
