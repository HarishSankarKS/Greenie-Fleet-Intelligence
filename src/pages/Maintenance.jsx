import { useState, useEffect } from 'react'
import { Plus, Search, Wrench, Trash2, DollarSign, Check, Clock, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getMaintenanceRecords, insertMaintenanceRecord, updateMaintenanceStatus } from '../utils/supabaseHelpers'
import { getVehicles } from '../utils/supabaseHelpers'

export default function Maintenance() {
    const [records, setRecords] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ vehicle_id: '', date: '', cost: '', description: '', status: 'pending' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        Promise.all([getMaintenanceRecords(), getVehicles()]).then(([r, v]) => {
            setRecords(r); setVehicles(v); setLoading(false)
        })
    }, [])

    const filtered = records.filter(r =>
        r.vehicles?.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
    )

    const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0)

    // Build chart data from actual records
    const costByMonth = (() => {
        const months = {}
        records.forEach(r => {
            const m = r.date ? new Date(r.date).toLocaleString('en-IN', { month: 'short' }) : '?'
            months[m] = (months[m] || 0) + (r.cost || 0)
        })
        return Object.entries(months).map(([month, cost]) => ({ month, cost }))
    })()

    const handleAdd = async () => {
        if (!form.vehicle_id || !form.date) return
        setSaving(true)
        const newRec = await insertMaintenanceRecord({ ...form, id: `M-${String(records.length + 1).padStart(3, '0')}`, cost: Number(form.cost) || 0 })
        if (newRec) {
            // Refresh to get joined vehicle data
            const fresh = await getMaintenanceRecords()
            setRecords(fresh)
        }
        setSaving(false); setShowModal(false)
        setForm({ vehicle_id: '', date: '', cost: '', description: '', status: 'pending' })
    }

    const handleStatusChange = async (record, newStatus) => {
        await updateMaintenanceStatus(record.id, newStatus, record.vehicle_id)
        setRecords(prev => prev.map(r => r.id === record.id ? { ...r, status: newStatus } : r))
        // Also update local vehicle status
        setVehicles(prev => prev.map(v => {
            if (v.id !== record.vehicle_id) return v
            const ns = newStatus === 'active' ? 'maintenance' : newStatus === 'completed' ? 'idle' : v.status
            return { ...v, status: ns }
        }))
    }

    const STATUS_ICON = { completed: <Check size={12} />, active: <Clock size={12} />, pending: <AlertTriangle size={12} /> }
    const STATUS_CLASS = { completed: 'green', active: 'amber', pending: 'blue' }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Maintenance</div>
                    <div className="page-subtitle">Service schedules, tracking, and cost management · Live via Supabase</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Schedule Maintenance</button>
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
                            const pct = records.length ? Math.round(cnt / records.length * 100) : 0
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
                {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading records…</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>ID</th><th>Vehicle</th><th>Date</th><th>Description</th><th>Cost</th><th>Status</th><th>Update Status</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.id}>
                                        <td><strong>{r.id}</strong></td>
                                        <td style={{ fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Wrench size={13} style={{ color: 'var(--color-primary)' }} />
                                                {r.vehicles?.plate_number || r.vehicle_id}
                                                {r.vehicles?.model && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 4 }}>({r.vehicles.model})</span>}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.date}</td>
                                        <td style={{ fontSize: 12.5, maxWidth: 260 }}>{r.description}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                                <DollarSign size={12} style={{ color: 'var(--color-text-muted)' }} />
                                                ₹{(r.cost || 0).toLocaleString()}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${STATUS_CLASS[r.status] || 'amber'}`}>
                                                {STATUS_ICON[r.status]} <span className="dot" />{r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                style={{ fontSize: 12, padding: '4px 8px', minWidth: 130 }}
                                                value={r.status}
                                                onChange={e => handleStatusChange(r, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="active">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
                                    <label className="form-label">Vehicle *</label>
                                    <select className="form-select" value={form.vehicle_id} onChange={e => setForm(p => ({ ...p, vehicle_id: e.target.value }))}>
                                        <option value="">— Select vehicle —</option>
                                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number} ({v.model})</option>)}
                                    </select>
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
                                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the maintenance work..." style={{ resize: 'vertical' }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Saving…' : 'Schedule'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
