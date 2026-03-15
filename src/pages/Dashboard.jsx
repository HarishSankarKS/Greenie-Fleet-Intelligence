import { useState } from 'react'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'
import {
    Truck, CheckCircle, Clock, AlertTriangle, TrendingUp,
    Activity, Plus, ArrowUpRight, ArrowDownRight, Leaf, Wind, IndianRupee
} from 'lucide-react'

const collectionTrend = [
    { day: 'Mon', completed: 42, pending: 8 },
    { day: 'Tue', completed: 56, pending: 12 },
    { day: 'Wed', completed: 38, pending: 6 },
    { day: 'Thu', completed: 65, pending: 9 },
    { day: 'Fri', completed: 71, pending: 14 },
    { day: 'Sat', completed: 48, pending: 7 },
    { day: 'Sun', completed: 30, pending: 4 },
]

const statusData = [
    { name: 'Active', value: 68, color: '#10b981' },
    { name: 'Idle', value: 22, color: '#f59e0b' },
    { name: 'Maintenance', value: 10, color: '#ef4444' },
]

const recentActivity = [
    { id: 'U-001', site: 'RS Puram C&D Site', type: 'C&D Waste', status: 'completed', time: '10 min ago', driver: 'Murugan R.' },
    { id: 'U-012', site: 'Gandhipuram Collection Pt', type: 'Mixed Debris', status: 'active', time: '25 min ago', driver: 'Karthik S.' },
    { id: 'U-034', site: 'Saravanampatti IT Zone', type: 'C&D Waste', status: 'pending', time: '1 hr ago', driver: 'Selvam P.' },
    { id: 'U-007', site: 'Singanallur Depot', type: 'Mixed Waste', status: 'maintenance', time: '2 hr ago', driver: 'Rajan K.' },
    { id: 'U-019', site: 'Ukkadam Sorting Yard', type: 'Concrete Rubble', status: 'completed', time: '3 hr ago', driver: 'Kavitha S.' },
]

const kpis = [
    { label: 'Total Units', value: '124', change: '+4', up: true, sub: 'vs last month', color: 'teal', icon: Truck },
    { label: 'Active Units', value: '84', change: '+7', up: true, sub: 'currently operating', color: 'green', icon: Activity },
    { label: 'Pending Collections', value: '23', change: '-3', up: false, sub: 'awaiting dispatch', color: 'amber', icon: Clock },
    { label: 'Completed Today', value: '61', change: '+12', up: true, sub: 'since midnight', color: 'blue', icon: CheckCircle },
    { label: 'In Maintenance', value: '17', change: '+2', up: false, sub: 'under service', color: 'red', icon: AlertTriangle },
]

export default function Dashboard() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Operations Dashboard</div>
                    <div className="page-subtitle">Real-time overview of C&D waste collection units across Coimbatore · Friday, 6 Mar 2026</div>
                </div>
                <button className="btn btn-primary"><Plus size={15} /> New Collection</button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpis.map(({ label, value, change, up, sub, color, icon: Icon }) => (
                    <div key={label} className={`kpi-card ${color}`}>
                        <div className="kpi-header">
                            <span className="kpi-label">{label}</span>
                            <div className={`kpi-icon ${color}`}><Icon size={18} /></div>
                        </div>
                        <div className="kpi-value">{value}</div>
                        <div className="kpi-footer">
                            <span className={`kpi-change ${up ? 'up' : 'down'}`}>
                                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {change}
                            </span>
                            <span className="kpi-sub">{sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid-2" style={{ marginBottom: 24 }}>
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Weekly Collection Trend</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Last 7 days</span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={collectionTrend}>
                                <defs>
                                    <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                                <Area type="monotone" dataKey="completed" stroke="#0f766e" strokeWidth={2.5} fill="url(#colorDone)" name="Completed" />
                                <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="4 2" name="Pending" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Fleet Status Distribution</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>124 total units</span>
                    </div>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <ResponsiveContainer width="50%" height={180}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                    {statusData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v, n) => [`${v} units`, n]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {statusData.map(({ name, value, color }) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <div style={{ flex: 1, fontSize: 13 }}>{name}</div>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{Math.round(value / 1.24)}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Carbon Impact Card ── */}
            <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #bbf7d0' }}>
                <div className="card-header" style={{ borderBottom: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bbf7d0' }}>
                            <Leaf size={17} color="#166534" />
                        </div>
                        <div>
                            <span className="card-title" style={{ color: '#166534' }}>Today's Carbon Impact</span>
                            <div style={{ fontSize: 11.5, color: '#166534', opacity: 0.75, marginTop: 1 }}>Based on 61 completed collections · CO₂ diversion factor: 0.42 t CO₂/t waste</div>
                        </div>
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: '#166534', background: '#dcfce7', padding: '4px 12px', borderRadius: 20, border: '1px solid #bbf7d0' }}>Live · Today</div>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {[
                            {
                                icon: Wind, label: 'CO₂ Diverted Today',
                                value: `${(61 * 3 * 0.42).toFixed(1)} t`,
                                sub: '61 jobs × avg 3T × 0.42 factor',
                                color: '#166534', bg: '#dcfce7', border: '#bbf7d0',
                            },
                            {
                                icon: Leaf, label: 'Tree Equivalent',
                                value: `${Math.round(61 * 3 * 0.42 * 45)} 🌳`,
                                sub: '1 tonne CO₂ ≈ 45 trees/year',
                                color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0',
                            },
                            {
                                icon: IndianRupee, label: 'Carbon Credit Value',
                                value: `₹${((61 * 3 * 0.42) * 600).toLocaleString('en-IN')}`,
                                sub: '@ ₹600/t CO₂ (voluntary market)',
                                color: '#854d0e', bg: '#fefce8', border: '#fde68a',
                            },
                            {
                                icon: TrendingUp, label: 'Monthly Projection',
                                value: `${(61 * 26 * 3 * 0.42).toFixed(0)} t CO₂`,
                                sub: 'At today\'s rate × 26 working days',
                                color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe',
                            },
                        ].map(({ icon: Icon, label, value, sub, color, bg, border }) => (
                            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                                    <Icon size={14} color={color} />
                                    <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                                </div>
                                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Recent Activity</span>
                    <button className="btn btn-outline btn-sm">View All</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Unit ID</th><th>Collection Site</th><th>Waste Type</th><th>Driver</th><th>Status</th><th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map(row => (
                                <tr key={row.id}>
                                    <td><strong>{row.id}</strong></td>
                                    <td>{row.site}</td>
                                    <td>{row.type}</td>
                                    <td>{row.driver}</td>
                                    <td>
                                        <span className={`status-badge ${row.status}`}>
                                            <span className="dot" />{row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
