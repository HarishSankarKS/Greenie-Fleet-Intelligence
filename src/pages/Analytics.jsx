import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import { Download, TrendingUp, Calendar } from 'lucide-react'

const monthly = [
    { month: 'Sep', collections: 310, waste: 42, revenue: 84200 },
    { month: 'Oct', collections: 380, waste: 55, revenue: 102000 },
    { month: 'Nov', collections: 420, waste: 61, revenue: 113500 },
    { month: 'Dec', collections: 395, waste: 58, revenue: 107000 },
    { month: 'Jan', collections: 450, waste: 67, revenue: 121000 },
    { month: 'Feb', collections: 488, waste: 72, revenue: 131500 },
]

const wasteByType = [
    { type: 'Concrete', tons: 280 },
    { type: 'Rubble', tons: 195 },
    { type: 'Mixed C&D', tons: 320 },
    { type: 'Metals', tons: 110 },
    { type: 'Wood', tons: 85 },
    { type: 'Other', tons: 65 },
]

const sitePerf = [
    { site: 'Chennai Central Hub', efficiency: 94, collections: 78 },
    { site: 'Coimbatore North Depot', efficiency: 87, collections: 92 },
    { site: 'Salem Industrial Hub', efficiency: 91, collections: 105 },
    { site: 'Trichy West Base', efficiency: 76, collections: 54 },
    { site: 'Tirunelveli Gateway', efficiency: 89, collections: 68 },
]

export default function Analytics() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Analytics & Reports</div>
                    <div className="page-subtitle">Performance metrics · Waste data · Operational insights</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline"><Calendar size={14} /> Date Range</button>
                    <button className="btn btn-primary"><Download size={14} /> Export Report</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Total Collections', value: '2,443', change: '+18%', color: 'teal' },
                    { label: 'Total Waste Collected', value: '355 T', change: '+12%', color: 'green' },
                    { label: 'Avg. per Site/Day', value: '14.2', change: '+5%', color: 'blue' },
                    { label: 'Revenue Generated', value: '₹659K', change: '+22%', color: 'amber' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                        <div className="kpi-footer">
                            <span className="kpi-change up"><TrendingUp size={12} /> {k.change}</span>
                            <span className="kpi-sub">vs last 6 months</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <div className="card-header"><span className="card-title">Monthly Collections Trend</span></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={monthly}>
                                <defs>
                                    <linearGradient id="colG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="collections" stroke="#0f766e" strokeWidth={2.5} fill="url(#colG)" name="Collections" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span className="card-title">Waste by Type (Tons)</span></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={wasteByType} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="tons" fill="#0f766e" radius={[0, 4, 4, 0]} name="Tons" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Site Performance Comparison</span>
                    <button className="btn btn-outline btn-sm"><Download size={13} /> Export CSV</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Site Name</th>
                                <th>Total Collections</th>
                                <th>Efficiency Score</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sitePerf.map(row => (
                                <tr key={row.site}>
                                    <td style={{ fontWeight: 500 }}>{row.site}</td>
                                    <td>{row.collections}</td>
                                    <td>{row.efficiency}%</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${row.efficiency}%`, height: '100%', borderRadius: 4,
                                                    background: row.efficiency >= 90 ? '#10b981' : row.efficiency >= 80 ? '#f59e0b' : '#ef4444'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, minWidth: 35 }}>{row.efficiency}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
