import { useState } from 'react'
import { Search, Download, Filter, ChevronDown, MapPin, Clock, Truck, AlertTriangle, CheckCircle, XCircle, ArrowUpDown } from 'lucide-react'

const ACTIVITY_DATA = [
    { id: 'COL-2401', site: 'RS Puram C&D Site', driver: 'Murugan R.', truck: 'TN 38 AA 1001', time: '09:42 AM', weight: '3.2 T', status: 'completed', type: 'C&D Waste', duration: '18 min' },
    { id: 'COL-2402', site: 'Gandhipuram Collection Pt', driver: 'Karthik S.', truck: 'TN 38 BB 2002', time: '10:15 AM', weight: '2.8 T', status: 'completed', type: 'Mixed Debris', duration: '22 min' },
    { id: 'COL-2403', site: 'Saravanampatti IT Zone', driver: 'Selvam P.', truck: 'TN 38 CC 3003', time: '11:00 AM', weight: '—', status: 'in-transit', type: 'C&D Waste', duration: '—' },
    { id: 'COL-2404', site: 'Singanallur Depot', driver: 'Rajan K.', truck: 'TN 38 DD 4004', time: '11:30 AM', weight: '—', status: 'pending', type: 'Mixed Waste', duration: '—' },
    { id: 'COL-2405', site: 'Ondipudur Gate', driver: 'Unassigned', truck: '—', time: '08:20 AM', weight: '—', status: 'missed', type: 'C&D Waste', duration: '—' },
    { id: 'COL-2406', site: 'Ukkadam Sorting Yard', driver: 'Murugan R.', truck: 'TN 38 AA 1001', time: '08:55 AM', weight: '4.1 T', status: 'completed', type: 'Concrete Rubble', duration: '15 min' },
    { id: 'COL-2407', site: 'Selvapuram West Site', driver: 'Selvam P.', truck: 'TN 38 CC 3003', time: '12:15 PM', weight: '—', status: 'pending', type: 'C&D Waste', duration: '—' },
    { id: 'COL-2408', site: 'Kuniyamuthur Hub', driver: 'Karthik S.', truck: 'TN 38 BB 2002', time: '01:30 PM', weight: '—', status: 'pending', type: 'Rubble', duration: '—' },
    { id: 'COL-2409', site: 'Vadavalli Transfer Stn', driver: 'Rajan K.', truck: 'TN 38 DD 4004', time: '07:30 AM', weight: '3.0 T', status: 'completed', type: 'C&D Waste', duration: '20 min' },
    { id: 'COL-2410', site: 'Thudiyalur Site', driver: 'Unassigned', truck: '—', time: '09:00 AM', weight: '—', status: 'missed', type: 'Mixed Debris', duration: '—' },
]

const statusConfig = {
    completed: { label: 'Completed', color: '#10b981', bg: '#e8f9f0', icon: CheckCircle },
    'in-transit': { label: 'In Transit', color: '#f59e0b', bg: '#fff8e6', icon: Truck },
    pending: { label: 'Pending', color: '#6b7280', bg: '#f0f2f5', icon: Clock },
    missed: { label: 'Missed', color: '#ef4444', bg: '#fef2f2', icon: XCircle },
}

export default function ClientActivityLog() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortField, setSortField] = useState('time')
    const [sortDir, setSortDir] = useState('desc')

    const filtered = ACTIVITY_DATA
        .filter(r => statusFilter === 'all' || r.status === statusFilter)
        .filter(r => !search || r.site.toLowerCase().includes(search.toLowerCase()) || r.driver.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))

    const counts = {
        all: ACTIVITY_DATA.length,
        completed: ACTIVITY_DATA.filter(r => r.status === 'completed').length,
        'in-transit': ACTIVITY_DATA.filter(r => r.status === 'in-transit').length,
        pending: ACTIVITY_DATA.filter(r => r.status === 'pending').length,
        missed: ACTIVITY_DATA.filter(r => r.status === 'missed').length,
    }

    const totalWeight = ACTIVITY_DATA.filter(r => r.weight !== '—').reduce((s, r) => s + parseFloat(r.weight), 0)

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Collection Activity Log</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Today's collection operations — {ACTIVITY_DATA.length} entries</p>
                </div>
                <button onClick={() => alert('CSV export would download here')} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Total Collections', value: ACTIVITY_DATA.length, color: '#1a3263' },
                    { label: 'Completed', value: counts.completed, color: '#10b981' },
                    { label: 'Missed', value: counts.missed, color: '#ef4444' },
                    { label: 'Waste Collected', value: `${totalWeight.toFixed(1)} T`, color: '#7c3aed' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: '#fff', borderRadius: 10, padding: '14px 16px',
                        border: '1px solid #e5e9f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{ fontSize: 11.5, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginTop: 4 }}>{c.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9aa3b2' }} />
                    <input
                        placeholder="Search by site, driver, or ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '8px 12px 8px 34px', border: '1.5px solid #dce1ea',
                            borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                {Object.entries(counts).map(([key, count]) => (
                    <button key={key} onClick={() => setStatusFilter(key)} style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', border: '1.5px solid',
                        background: statusFilter === key ? (key === 'all' ? '#1a3263' : statusConfig[key]?.color || '#1a3263') : '#fff',
                        color: statusFilter === key ? '#fff' : '#5a6478',
                        borderColor: statusFilter === key ? 'transparent' : '#dce1ea',
                    }}>
                        {key === 'all' ? 'All' : statusConfig[key]?.label} ({count})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{
                background: '#fff', borderRadius: 12, border: '1px solid #e5e9f0',
                overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: '#f8f9fb', borderBottom: '1px solid #e5e9f0' }}>
                            {['ID', 'Site', 'Driver', 'Truck', 'Time', 'Weight', 'Type', 'Duration', 'Status'].map(h => (
                                <th key={h} style={{
                                    padding: '10px 14px', textAlign: 'left', fontWeight: 700,
                                    fontSize: 11.5, color: '#5a6478', textTransform: 'uppercase', letterSpacing: '0.04em',
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r, i) => {
                            const sc = statusConfig[r.status]
                            const Icon = sc.icon
                            const isMissed = r.status === 'missed'
                            return (
                                <tr key={r.id} style={{
                                    borderBottom: '1px solid #f0f2f5',
                                    background: isMissed ? '#fef8f8' : i % 2 === 0 ? '#fff' : '#fafbfc',
                                }}>
                                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1a3263', fontSize: 12 }}>{r.id}</td>
                                    <td style={{ padding: '10px 14px', fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <MapPin size={12} color="#9aa3b2" /> {r.site}
                                        </div>
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>{r.driver}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 12, fontFamily: 'monospace' }}>{r.truck}</td>
                                    <td style={{ padding: '10px 14px' }}>{r.time}</td>
                                    <td style={{ padding: '10px 14px', fontWeight: 700 }}>{r.weight}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 12 }}>{r.type}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 12 }}>{r.duration}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                            background: sc.bg, color: sc.color,
                                        }}>
                                            <Icon size={12} /> {sc.label}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#9aa3b2', fontSize: 14 }}>No collections match your filters</div>
                )}
            </div>
        </div>
    )
}
