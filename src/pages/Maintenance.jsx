import { useState } from 'react'
import { Plus, Search, Wrench, Edit2, Trash2, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const initialRecords = [
    { id: 'M-001', vehicle: 'TN-09-AB-1234', vehicleId: 'V-001', date: '2026-01-15', cost: 12500, desc: 'Engine oil change, filter replacement', status: 'completed' },
    { id: 'M-002', vehicle: 'TN-38-EF-9012', vehicleId: 'V-003', date: '2026-02-18', cost: 45000, desc: 'Transmission repair and brake overhaul', status: 'active' },
    { id: 'M-003', vehicle: 'TN-11-CD-5678', vehicleId: 'V-002', date: '2026-02-01', cost: 8200, desc: 'Tire rotation and alignment check', status: 'completed' },
    { id: 'M-004', vehicle: 'TN-58-IJ-7890', vehicleId: 'V-005', date: '2026-02-10', cost: 18700, desc: 'Hydraulic system maintenance', status: 'completed' },
    { id: 'M-005', vehicle: 'TN-44-GH-3456', vehicleId: 'V-004', date: '2026-02-25', cost: 32000, desc: 'Full engine overhaul scheduled', status: 'pending' },
    { id: 'M-006', vehicle: 'TN-77-KL-2345', vehicleId: 'V-006', date: '2026-01-05', cost: 6800, desc: 'Coolant flush and radiator cleaning', status: 'completed' },
]

const costByMonth = [
    { month: 'Sep', cost: 38000 },
    { month: 'Oct', cost: 52000 },
    { month: 'Nov', cost: 41000 },
    { month: 'Dec', cost: 67000 },
    { month: 'Jan', cost: 48000 },
    { month: 'Feb', cost: 122900 },
]

const emptyForm = { vehicle: '', date: '', cost: '', desc: '', status: 'pending' }

export default function Maintenance() {
    const [records, setRecords] = useState(initialRecords)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)

    const filtered = records.filter(r =>
        r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        r.desc.toLowerCase().includes(search.toLowerCase())
    )

    const totalCost = records.reduce((sum, r) => sum + r.cost, 0)

    const handleAdd = () => {
        if (!form.vehicle || !form.date) return
        setRecords(prev => [...prev, { ...form, id: `M-00${prev.length + 1}`, vehicleId: '—', cost: Number(form.cost) || 0 }])
        setForm(emptyForm)
        setShowModal(false)
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Maintenance</div>
                    <div className="page-subtitle">Service schedules, tracking, and cost management</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={15} /> Schedule Maintenance
                </button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
                {[
                    { label: 'Total Records', value: records.length, color: 'teal' },
                    { label: 'Active (In Service)', value: records.filter(r => r.status === 'active').length, color: 'amber' },
                    { label: 'Pending', value: records.filter(r => r.status === 'pending').length, color: 'blue' },
                    { label: 'Total Cost', value: `₹${(totalCost / 1000).toFixed(0)}K`, color: 'red' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value" style={{ fontSize: k.label === 'Total Cost' ? 24 : 32 }}>{k.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <div className="card-header"><span className="card-title">Monthly Maintenance Cost</span></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={costByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}K`} />
                                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Cost']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="cost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span className="card-title">Status Breakdown</span></div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {['completed', 'active', 'pending'].map(s => {
                            const cnt = records.filter(r => r.status === s).length
                            const pct = Math.round(cnt / records.length * 100)
                            return (
                                <div key={s}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                        <span style={{ fontWeight: 500 }}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                                        <span style={{ fontWeight: 700 }}>{cnt} ({pct}%)</span>
                                    </div>
                                    <div style={{ height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: s === 'completed' ? '#10b981' : s === 'active' ? '#f59e0b' : '#3b82f6' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Maintenance Records ({filtered.length})</span>
                    <div className="search-bar" style={{ minWidth: 220 }}>
                        <Search size={14} className="search-icon" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>ID</th><th>Vehicle</th><th>Date</th><th>Description</th><th>Cost</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r.id}>
                                    <td><strong>{r.id}</strong></td>
                                    <td style={{ fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Wrench size={13} style={{ color: 'var(--color-primary)' }} />{r.vehicle}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.date}</td>
                                    <td style={{ fontSize: 12.5, maxWidth: 260 }}>{r.desc}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                            <DollarSign size={12} style={{ color: 'var(--color-text-muted)' }} />
                                            ₹{r.cost.toLocaleString()}
                                        </div>
                                    </td>
                                    <td><span className={`status-badge ${r.status === 'active' ? 'idle' : r.status}`}><span className="dot" />{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span></td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => setRecords(prev => prev.filter(x => x.id !== r.id))}><Trash2 size={13} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Schedule Maintenance</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Vehicle Plate *</label>
                                    <input className="form-input" value={form.vehicle} onChange={e => setForm(p => ({ ...p, vehicle: e.target.value }))} placeholder="e.g. TN-09-AB-1234" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date *</label>
                                    <input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cost (₹)</label>
                                    <input className="form-input" type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="e.g. 15000" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="pending">Pending</option>
                                        <option value="active">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows={3} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the maintenance work..." style={{ resize: 'vertical' }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAdd}>Schedule</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
