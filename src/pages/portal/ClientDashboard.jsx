import { TrendingUp, Truck, MapPin, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

const KPI = [
    {
        label: "Today's Coverage",
        value: '87.3%',
        sub: 'of 124 sites collected',
        color: '#2ecc7a',
        bg: '#e8f9f0',
        icon: CheckCircle,
        trend: '+4.1% vs yesterday',
        trendUp: true,
    },
    {
        label: 'SLA Status',
        value: 'On Track',
        sub: 'Monthly target: 95% | Actual: 97.2%',
        color: '#1a9c55',
        bg: '#e8f9f0',
        icon: TrendingUp,
        trend: '↑ 2.2% above target',
        trendUp: true,
    },
    {
        label: 'Sites Pending',
        value: '16',
        sub: 'scheduled for afternoon shift',
        color: '#f59e0b',
        bg: '#fff8e8',
        icon: Clock,
        trend: '3 overdue — action needed',
        trendUp: false,
    },
    {
        label: 'Active Trucks',
        value: '22',
        sub: 'of 28 deployed today',
        color: '#1a3263',
        bg: '#e8edf8',
        icon: Truck,
        trend: '4 in maintenance | 2 idle',
        trendUp: true,
    },
    {
        label: "Waste Volume Today",
        value: '84.6 T',
        sub: 'tonnes collected so far',
        color: '#7c3aed',
        bg: '#f0ebff',
        icon: Activity,
        trend: 'Target: 100 T | 84.6% achieved',
        trendUp: true,
    },
    {
        label: 'Missed Collections',
        value: '3',
        sub: 'sites not collected today',
        color: '#b91c1c',
        bg: '#fff1f1',
        icon: AlertTriangle,
        trend: 'Reasons: Vehicle breakdown (2), Access blocked (1)',
        trendUp: false,
    },
]

const sparkData = [
    { d: 'Mon', v: 89 }, { d: 'Tue', v: 83 }, { d: 'Wed', v: 91 },
    { d: 'Thu', v: 86 }, { d: 'Fri', v: 94 }, { d: 'Sat', v: 78 }, { d: 'Sun', v: 87 },
]

const recentActivity = [
    { site: 'Anna Nagar Collection Point', time: '09:42 AM', driver: 'Rajan K.', weight: '4.2 T', status: 'Completed' },
    { site: 'Adyar Transit Hub', time: '10:15 AM', driver: 'Murugan S.', weight: '6.8 T', status: 'Completed' },
    { site: 'T. Nagar Market Site', time: '11:00 AM', driver: 'Selvam R.', weight: '—', status: 'In Transit' },
    { site: 'Velachery Depot', time: '11:30 AM', driver: 'Karthik P.', weight: '—', status: 'Pending' },
    { site: 'Tambaram Zone B', time: '08:20 AM', driver: 'Unassigned', weight: '—', status: 'Missed' },
]

const statusColors = {
    Completed: { bg: '#e8f9f0', color: '#1a9c55' },
    'In Transit': { bg: '#fff8e8', color: '#d97706' },
    Pending: { bg: '#e8edf8', color: '#1a3263' },
    Missed: { bg: '#fff1f1', color: '#b91c1c' },
}

export default function ClientDashboard() {
    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>
                    Good morning, Project Manager 👋
                </h1>
                <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13.5 }}>
                    Sunday, 02 March 2026 · Region: Tamil Nadu South · Account ID: ACM-2024-007
                </p>
            </div>

            {/* KPI cards */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16, marginBottom: 24,
            }}>
                {KPI.map(({ label, value, sub, color, bg, icon: Icon, trend, trendUp }) => (
                    <div key={label} style={{
                        background: '#fff', borderRadius: 12, padding: '18px 20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        borderTop: `3px solid ${color}`,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#5a6478', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {label}
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', lineHeight: 1.1 }}>{value}</div>
                                <div style={{ fontSize: 12, color: '#5a6478', marginTop: 4 }}>{sub}</div>
                            </div>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, background: bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Icon size={18} color={color} />
                            </div>
                        </div>
                        <div style={{
                            marginTop: 12, paddingTop: 10, borderTop: '1px solid #f0f2f5',
                            fontSize: 11.5, color: trendUp ? '#1a9c55' : '#b91c1c', fontWeight: 600,
                        }}>
                            {trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sparkline + Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>

                {/* Weekly trend */}
                <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>7-Day Coverage Trend</div>
                    <div style={{ fontSize: 12, color: '#5a6478', marginBottom: 16 }}>Collection rate % by day</div>
                    <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={sparkData}>
                            <Line type="monotone" dataKey="v" stroke="#1a3263" strokeWidth={2.5} dot={{ r: 3, fill: '#1a3263' }} />
                            <Tooltip
                                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #dce1ea' }}
                                formatter={v => [`${v}%`, 'Coverage']}
                                labelFormatter={l => sparkData[parseInt(l)]?.d || l}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: '#5a6478' }}>7-day avg</span>
                        <span style={{ fontWeight: 700, color: '#1a3263' }}>86.9%</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 16 }}>
                        Today&apos;s Activity
                        <span style={{ marginLeft: 8, fontSize: 11, color: '#5a6478', fontWeight: 400 }}>Live feed</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f8f9fb' }}>
                                {['Site', 'Time', 'Driver', 'Weight', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#5a6478', textTransform: 'uppercase', letterSpacing: 0.4 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                    <td style={{ padding: '10px 10px', fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <MapPin size={11} color="#5a6478" /> {r.site}
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px 10px', color: '#5a6478' }}>{r.time}</td>
                                    <td style={{ padding: '10px 10px', color: '#5a6478' }}>{r.driver}</td>
                                    <td style={{ padding: '10px 10px', color: '#1a1a2e', fontWeight: 600 }}>{r.weight}</td>
                                    <td style={{ padding: '10px 10px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                            ...statusColors[r.status],
                                        }}>{r.status}</span>
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
