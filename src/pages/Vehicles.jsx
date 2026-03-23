import { useState, useEffect } from 'react'
import { Plus, Search, Truck, Edit2, Trash2 } from 'lucide-react'
import { getVehicles, upsertVehicle, deleteVehicle, subscribeToVehicles } from '../utils/supabaseHelpers'
import { getDrivers } from '../utils/supabaseHelpers'

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ id: '', plate_number: '', model: '', type: 'Truck', driver_id: '', status: 'idle' })
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        Promise.all([getVehicles(), getDrivers()]).then(([v, d]) => {
            setVehicles(v); setDrivers(d); setLoading(false)
        })
        const ch = subscribeToVehicles(() => {
            getVehicles().then(setVehicles)
        })
        return () => ch.unsubscribe()
    }, [])

    const filtered = vehicles.filter(v =>
        v.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
        v.model?.toLowerCase().includes(search.toLowerCase()) ||
        v.drivers?.name?.toLowerCase().includes(search.toLowerCase())
    )

    const openAdd = () => {
        setForm({ id: `V-${String(vehicles.length + 1).padStart(3, '0')}`, plate_number: '', model: '', type: 'Truck', driver_id: '', status: 'idle' })
        setEditId(null); setShowModal(true)
    }

    const openEdit = (v) => {
        setForm({ id: v.id, plate_number: v.plate_number, model: v.model, type: v.type, driver_id: v.driver_id || '', status: v.status })
        setEditId(v.id); setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.plate_number || !form.model) return
        setSaving(true)
        await upsertVehicle({ ...form, driver_id: form.driver_id || null })
        const fresh = await getVehicles()
        setVehicles(fresh)
        setSaving(false); setShowModal(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return
        await deleteVehicle(id)
        setVehicles(prev => prev.filter(v => v.id !== id))
    }

    const STATUS_COLOR = { active: 'green', idle: 'amber', maintenance: 'red' }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Vehicles</div>
                    <div className="page-subtitle">Fleet vehicle registry and status management · Live via Supabase</div>
                </div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Vehicle</button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
                {[
                    { label: 'Total', value: vehicles.length, color: 'teal' },
                    { label: 'Active', value: vehicles.filter(v => v.status === 'active').length, color: 'green' },
                    { label: 'Idle', value: vehicles.filter(v => v.status === 'idle').length, color: 'amber' },
                    { label: 'In Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length, color: 'red' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Fleet Registry ({filtered.length})</span>
                    <div className="search-bar" style={{ minWidth: 240 }}>
                        <Search size={14} className="search-icon" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by plate, model, driver..." />
                    </div>
                </div>
                {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading vehicles…</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th><th>Plate No.</th><th>Model</th><th>Type</th>
                                    <th>Assigned Driver</th><th>Status</th><th>Mileage</th><th>Last Service</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(v => (
                                    <tr key={v.id}>
                                        <td><strong>{v.id}</strong></td>
                                        <td style={{ fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Truck size={13} style={{ color: 'var(--color-primary)' }} />
                                                {v.plate_number}
                                            </div>
                                        </td>
                                        <td>{v.model}</td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.type}</td>
                                        <td style={{ fontSize: 13 }}>{v.drivers?.name || '—'}</td>
                                        <td>
                                            <span className={`status-badge ${STATUS_COLOR[v.status] || 'amber'}`}>
                                                <span className="dot" />
                                                {v.status?.charAt(0).toUpperCase() + v.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            {v.mileage_km?.toLocaleString() || '—'} km
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.last_service || '—'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} onClick={() => openEdit(v)}><Edit2 size={13} /></button>
                                                <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDelete(v.id)}><Trash2 size={13} /></button>
                                            </div>
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
                            <span className="modal-title">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Plate Number *</label>
                                    <input className="form-input" value={form.plate_number} onChange={e => setForm(p => ({ ...p, plate_number: e.target.value }))} placeholder="e.g. TN-09-AB-1234" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Model *</label>
                                    <input className="form-input" value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="e.g. Tata 407" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                                        <option>Truck</option><option>Heavy Truck</option><option>Mini Truck</option><option>Loader</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Assigned Driver</label>
                                    <select className="form-select" value={form.driver_id} onChange={e => setForm(p => ({ ...p, driver_id: e.target.value }))}>
                                        <option value="">— Unassigned —</option>
                                        {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="active">Active</option>
                                        <option value="idle">Idle</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Vehicle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
