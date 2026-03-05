import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ChargingStatusRing = () => {
    const data = [
        { name: 'Critically Low (<20%)', count: 12, fill: '#ef4444' }, // red-500
        { name: 'Charging', count: 34, fill: '#f59e0b' }, // amber-500
        { name: 'Healthy (>80%)', count: 78, fill: '#10b981' }, // emerald-500
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-full flex justify-between items-center mb-2">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Live EV Battery Status</h3>
                <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
            </div>
            <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={16}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <RadialBar
                            minAngle={15}
                            background={{ fill: '#f1f5f9' }}
                            clockWise
                            dataKey="count"
                            cornerRadius={10}
                        />
                        <Tooltip
                            formatter={(value) => [value, 'Vehicles']}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChargingStatusRing;
