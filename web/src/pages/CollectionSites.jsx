import { MapPin, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

const CollectionSites = () => {
    const sites = [
        { id: 'CS-001', name: 'Chennai Central Hub', current: 45, max: 50, status: 'warning', trend: '+5%' },
        { id: 'CS-002', name: 'Coimbatore North Depot', current: 32, max: 80, status: 'good', trend: '-2%' },
        { id: 'CS-003', name: 'Madurai East Transfer', current: 60, max: 60, status: 'critical', trend: '+12%' },
        { id: 'CS-004', name: 'Trichy West Station', current: 15, max: 40, status: 'good', trend: '-1%' },
        { id: 'CS-005', name: 'Salem South Hub', current: 75, max: 100, status: 'warning', trend: '+8%' },
        { id: 'CS-006', name: 'Tirunelveli Central', current: 28, max: 50, status: 'good', trend: '-3%' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'good': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
            case 'warning': return 'text-amber-500 bg-amber-50 border-amber-200';
            case 'critical': return 'text-rose-500 bg-rose-50 border-rose-200';
            default: return 'text-slate-500 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'good': return <CheckCircle2 size={20} className="text-emerald-500" />;
            case 'warning': return <AlertCircle size={20} className="text-amber-500" />;
            case 'critical': return <AlertCircle size={20} className="text-rose-500 fill-rose-100" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Active Transfer Hubs</h2>
                    <p className="text-sm text-slate-500">Real-time capacity and utilization across 6 regional nodes</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-4 border-r border-slate-200 dark:border-slate-700">
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">255 <span className="text-sm font-normal text-slate-400">/ 380t</span></p>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Network Load</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-2xl font-bold text-emerald-500">67%</p>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Utilization</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map(site => {
                    const percentage = Math.round((site.current / site.max) * 100);
                    return (
                        <div key={site.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 hover:shadow-md transition-shadow group flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-xl flex items-center justify-center border ${getStatusColor(site.status)} transition-colors`}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{site.name}</h3>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{site.id}</p>
                                    </div>
                                </div>
                                <div title={`Status: ${site.status}`}>
                                    {getStatusIcon(site.status)}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between items-end mb-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{site.current}</span>
                                        <span className="text-slate-500 font-medium">/ {site.max} tons</span>
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-bold ${site.trend.startsWith('+') ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        <TrendingUp size={14} className={site.trend.startsWith('-') ? 'rotate-180' : ''} />
                                        {site.trend}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-1 overflow-hidden">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${percentage >= 90 ? 'bg-rose-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                                    <span>0%</span>
                                    <span>{percentage}% Full</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CollectionSites;
