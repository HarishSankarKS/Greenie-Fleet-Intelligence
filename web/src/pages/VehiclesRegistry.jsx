import { CheckCircle2, ShieldAlert, Cpu, AlertTriangle, BatteryWarning, Settings } from 'lucide-react';
import clsx from 'clsx';

const VehiclesRegistry = () => {
    const tableData = [
        { id: 'V-001', plate: 'TN-01-AB-1234', model: 'BharatBenz 1617R', operator: 'Autonomous', battery: 84, aiStatus: 'online', status: 'Active', serviceAlert: false, healthScore: 98 },
        { id: 'V-014', plate: 'TN-07-XY-9081', model: 'Tata 407', operator: 'Human Assisted', battery: 92, aiStatus: 'offline', status: 'Active', serviceAlert: false, healthScore: 85 },
        { id: 'V-023', plate: 'TN-10-QW-5544', model: 'Ashok Leyland Dost', operator: 'Manual', battery: null, aiStatus: 'n/a', status: 'Idle', serviceAlert: false, healthScore: 72 },
        { id: 'V-042', plate: 'KA-05-MM-1122', model: 'Mahindra Furio (EV)', operator: 'Autonomous', battery: 18, aiStatus: 'online', status: 'Charging', serviceAlert: true, healthScore: 61 },
        { id: 'V-088', plate: 'TN-22-KJ-7766', model: 'BharatBenz 1617R', operator: 'Remote Override', battery: 52, aiStatus: 'error', status: 'Maintenance', serviceAlert: true, healthScore: 40 },
    ];

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 px-2.5 py-1 rounded-full text-xs font-bold">Active</span>;
            case 'idle': return <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold">Idle</span>;
            case 'charging': return <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-2.5 py-1 rounded-full text-xs font-bold">Charging</span>;
            case 'maintenance': return <span className="bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-500 px-2.5 py-1 rounded-full text-xs font-bold">Maintenance</span>;
            default: return <span>{status}</span>;
        }
    };

    const getOperatorBadge = (op) => {
        if (op === 'Autonomous') return <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><Cpu size={14} /> {op}</span>;
        if (op === 'Remote Override') return <span className="text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1"><ShieldAlert size={14} /> {op}</span>;
        return <span className="text-slate-600 dark:text-slate-400 font-medium">{op}</span>;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col overflow-hidden">

                {/* Table Header Action Bar */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">Fleet Registry & Telemetry</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total 124 units registered</p>
                    </div>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-amber-500/20 transition-colors flex items-center gap-2">
                        <span className="hidden sm:inline">Add Vehicle</span>
                        <CheckCircle2 size={18} />
                    </button>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-700/50">
                                <th className="p-4 pl-6">Unit ID</th>
                                <th className="p-4">Model & Plate</th>
                                <th className="p-4">Operator / Mode</th>
                                <th className="p-4">Asset Status</th>
                                <th className="p-4">AI Sensors / EV</th>
                                <th className="p-4 pr-6 text-right">Predictive Maintenance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {tableData.map((row) => (
                                <tr
                                    key={row.id}
                                    className={clsx(
                                        "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer",
                                        row.serviceAlert ? "bg-rose-50/30 dark:bg-rose-900/10" : "bg-white dark:bg-slate-800"
                                    )}
                                >
                                    <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">{row.id}</td>
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-700 dark:text-slate-300">{row.model}</div>
                                        <div className="text-xs text-slate-400 dark:text-slate-500 tracking-widest uppercase">{row.plate}</div>
                                    </td>
                                    <td className="p-4">{getOperatorBadge(row.operator)}</td>
                                    <td className="p-4">{getStatusBadge(row.status)}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {row.aiStatus === 'online' && <span className="flex items-center gap-1 text-xs font-bold text-emerald-500"><CheckCircle2 size={12} /> LiDAR / Vision OK</span>}
                                            {row.aiStatus === 'error' && <span className="flex items-center gap-1 text-xs font-bold text-rose-500"><AlertTriangle size={12} /> Sensor Fault</span>}
                                            {row.aiStatus === 'offline' && <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">Standard GPS Only</span>}

                                            {row.battery !== null && (
                                                <span className={clsx("flex items-center gap-1 text-xs font-bold", row.battery < 20 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400')}>
                                                    <BatteryWarning size={12} /> {row.battery}% EV
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        {row.serviceAlert ? (
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-rose-600 dark:text-rose-400 font-bold text-sm flex items-center gap-1">
                                                    <Settings size={14} className="animate-spin-slow" /> Service Imminent
                                                </span>
                                                <span className="text-xs text-slate-500">AI Health: {row.healthScore}/100</span>
                                                {row.operator === 'Autonomous' && (
                                                    <button className="mt-1 bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase hover:bg-rose-200 transition-colors">Emergency Halt</button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end justify-center h-full">
                                                <span className="text-slate-600 dark:text-slate-300 font-bold">14 Days</span>
                                                <span className="text-xs text-slate-400">AI Health: {row.healthScore}/100</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination mock */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/30 text-xs text-slate-400 font-medium text-center">
                    Showing 1-5 of 124 Fleet Units
                </div>
            </div>
        </div>
    );
};

export default VehiclesRegistry;
