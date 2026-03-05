import { useState } from 'react'
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Shield, FileText, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const monthlyData = [
    { month: 'Sep', compliance: 94.2, target: 95 },
    { month: 'Oct', compliance: 96.1, target: 95 },
    { month: 'Nov', compliance: 93.8, target: 95 },
    { month: 'Dec', compliance: 97.2, target: 95 },
    { month: 'Jan', compliance: 95.5, target: 95 },
    { month: 'Feb', compliance: 97.2, target: 95 },
]

const breachLog = [
    { id: 'BR-041', date: '28 Feb 2026', type: 'Missed Collection', site: 'Tambaram Zone B', severity: 'high', penalty: '₹5,000', resolution: 'Pending' },
    { id: 'BR-040', date: '25 Feb 2026', type: 'Late Collection', site: 'Porur Industrial Area', severity: 'medium', penalty: '₹2,000', resolution: 'Acknowledged' },
    { id: 'BR-039', date: '22 Feb 2026', type: 'Weight Discrepancy', site: 'Adyar Transit Hub', severity: 'low', penalty: '₹500', resolution: 'Resolved' },
    { id: 'BR-038', date: '18 Feb 2026', type: 'Missed Collection', site: 'Ambattur Depot', severity: 'high', penalty: '₹5,000', resolution: 'Resolved' },
    { id: 'BR-037', date: '15 Feb 2026', type: 'Late Collection', site: 'Guindy Transfer Station', severity: 'medium', penalty: '₹2,000', resolution: 'Resolved' },
]

const severityConfig = {
    high: { color: '#ef4444', bg: '#fef2f2' },
    medium: { color: '#f59e0b', bg: '#fff8e6' },
    low: { color: '#10b981', bg: '#e8f9f0' },
}

export default function ClientSLAReports() {
    const [tab, setTab] = useState('overview')

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>SLA & Compliance Reports</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Service Level Agreement performance scorecard</p>
                </div>
                <button onClick={() => alert('PDF report download')} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                    <Download size={14} /> Download PDF
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f0f2f5', padding: 4, borderRadius: 10 - 2, width: 'fit-content' }}>
                {[{ key: 'overview', label: 'Overview' }, { key: 'breaches', label: 'Breach Log' }].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '7px 18px', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', background: tab === t.key ? '#fff' : 'transparent',
                        color: tab === t.key ? '#1a3263' : '#5a6478',
                        boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}>{t.label}</button>
                ))}
            </div>

            {tab === 'overview' ? (
                <>
                    {/* Scorecard */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                        {[
                            { label: 'Overall Compliance', value: '97.2%', sub: '↑ 1.7% from Jan', color: '#10b981', icon: Shield },
                            { label: 'SLA Target', value: '95.0%', sub: 'Monthly minimum', color: '#1a3263', icon: TrendingUp },
                            { label: 'Breaches (Feb)', value: '3', sub: '₹7,500 total penalty', color: '#ef4444', icon: AlertTriangle },
                            { label: 'Streak', value: '4 days', sub: 'No breaches', color: '#7c3aed', icon: CheckCircle },
                        ].map(c => (
                            <div key={c.label} style={{
                                background: '#fff', borderRadius: 10, padding: '16px 18px',
                                border: '1px solid #e5e9f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: 11.5, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.label}</div>
                                        <div style={{ fontSize: 26, fontWeight: 800, color: c.color, marginTop: 4 }}>{c.value}</div>
                                    </div>
                                    <c.icon size={20} color={c.color} style={{ opacity: 0.5 }} />
                                </div>
                                <div style={{ fontSize: 12, color: '#5a6478', marginTop: 6 }}>{c.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e5e9f0' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>6-Month Compliance Trend</div>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                                    <XAxis dataKey="month" tick={{ fill: '#5a6478', fontSize: 12 }} />
                                    <YAxis domain={[90, 100]} tick={{ fill: '#5a6478', fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="compliance" stroke="#1a3263" strokeWidth={2.5} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e5e9f0' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Penalty Summary (₹)</div>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={[
                                    { month: 'Sep', penalty: 12000 }, { month: 'Oct', penalty: 5000 },
                                    { month: 'Nov', penalty: 15000 }, { month: 'Dec', penalty: 2000 },
                                    { month: 'Jan', penalty: 7500 }, { month: 'Feb', penalty: 7500 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                                    <XAxis dataKey="month" tick={{ fill: '#5a6478', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#5a6478', fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="penalty" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                /* Breach Log Table */
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e9f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f8f9fb', borderBottom: '1px solid #e5e9f0' }}>
                                {['Breach ID', 'Date', 'Type', 'Site', 'Severity', 'Penalty', 'Resolution'].map(h => (
                                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11.5, color: '#5a6478', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {breachLog.map(b => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1a3263', fontSize: 12 }}>{b.id}</td>
                                    <td style={{ padding: '10px 14px' }}>{b.date}</td>
                                    <td style={{ padding: '10px 14px' }}>{b.type}</td>
                                    <td style={{ padding: '10px 14px' }}>{b.site}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{
                                            padding: '2px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                            background: severityConfig[b.severity].bg, color: severityConfig[b.severity].color,
                                        }}>{b.severity.charAt(0).toUpperCase() + b.severity.slice(1)}</span>
                                    </td>
                                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#ef4444' }}>{b.penalty}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{
                                            padding: '2px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                            background: b.resolution === 'Resolved' ? '#e8f9f0' : b.resolution === 'Acknowledged' ? '#fff8e6' : '#fef2f2',
                                            color: b.resolution === 'Resolved' ? '#10b981' : b.resolution === 'Acknowledged' ? '#f59e0b' : '#ef4444',
                                        }}>{b.resolution}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
