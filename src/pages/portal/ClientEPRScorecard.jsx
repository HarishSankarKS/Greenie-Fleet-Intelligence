import { useState } from 'react'
import { Leaf, TrendingUp, AlertTriangle, Download, FileText, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const monthlyEPR = [
    { month: 'Sep', score: 72 }, { month: 'Oct', score: 78 },
    { month: 'Nov', score: 74 }, { month: 'Dec', score: 82 },
    { month: 'Jan', score: 85 }, { month: 'Feb', score: 88 },
]

const wasteBreakdown = [
    { name: 'Concrete Rubble', value: 42, color: '#1a3263' },
    { name: 'Mixed Debris', value: 28, color: '#c8a951' },
    { name: 'Metal Scrap', value: 15, color: '#10b981' },
    { name: 'Wood', value: 10, color: '#7c3aed' },
    { name: 'Other', value: 5, color: '#9ca3af' },
]

export default function ClientEPRScorecard() {
    const currentScore = 88
    const target = 80
    const circumference = 2 * Math.PI * 65
    const offset = circumference - (currentScore / 100) * circumference

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>EPR Scorecard</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Extended Producer Responsibility compliance tracking</p>
                </div>
                <button onClick={() => alert('CPCB PDF export')} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}><Download size={14} /> CPCB Report</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginBottom: 20 }}>
                {/* EPR Gauge */}
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e9f0',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="65" fill="none" stroke="#f0f2f5" strokeWidth="12" />
                        <circle cx="80" cy="80" r="65" fill="none" stroke={currentScore >= target ? '#10b981' : '#ef4444'}
                            strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset}
                            strokeLinecap="round" transform="rotate(-90 80 80)"
                            style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                        <text x="80" y="72" textAnchor="middle" fontSize="28" fontWeight="800" fill="#1a1a2e">{currentScore}%</text>
                        <text x="80" y="92" textAnchor="middle" fontSize="11" fill="#5a6478">EPR Score</text>
                    </svg>
                    <div style={{
                        marginTop: 12, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: '#e8f9f0', color: '#10b981',
                    }}>✓ Above CPCB Target ({target}%)</div>
                    <div style={{ fontSize: 12, color: '#5a6478', marginTop: 8 }}>FY 2025-26 · Q4 Progress</div>
                </div>

                {/* KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                        { label: 'Total Waste Processed', value: '1,248 T', sub: 'This financial year', color: '#1a3263', icon: Leaf },
                        { label: 'Recycling Rate', value: '76.4%', sub: '↑ 3.2% from Q3', color: '#10b981', icon: TrendingUp },
                        { label: 'Pending Certificates', value: '2', sub: 'Await TSPCB approval', color: '#f59e0b', icon: FileText },
                        { label: 'Penalty Forecast', value: '₹0', sub: 'No penalties projected', color: '#10b981', icon: AlertTriangle },
                    ].map(c => (
                        <div key={c.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', border: '1px solid #e5e9f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: 11.5, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase' }}>{c.label}</div>
                                <c.icon size={16} color={c.color} style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: c.color, marginTop: 4 }}>{c.value}</div>
                            <div style={{ fontSize: 12, color: '#5a6478', marginTop: 4 }}>{c.sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Trend */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>EPR Score Trend (6 Months)</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={monthlyEPR}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                            <XAxis dataKey="month" tick={{ fill: '#5a6478', fontSize: 12 }} />
                            <YAxis domain={[60, 100]} tick={{ fill: '#5a6478', fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Waste breakdown */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Waste Category Breakdown</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie data={wasteBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                                    {wasteBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {wasteBreakdown.map(w => (
                                <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: w.color }} />
                                    <span style={{ color: '#5a6478' }}>{w.name}</span>
                                    <span style={{ fontWeight: 700, color: '#1a1a2e', marginLeft: 'auto' }}>{w.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
