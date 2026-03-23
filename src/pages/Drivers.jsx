import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Phone, Award } from 'lucide-react'
import { getDrivers, upsertDriver, deleteDriver } from '../utils/supabaseHelpers'
import { getVehicles } from '../utils/supabaseHelpers'

export default function Drivers() {
    const [drivers, setDrivers] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ id: '', name: '', license_no: '', contact: '', experience: '', status: 'active' })
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        Promise.all([getDrivers(), getVehicles()]).then(([d, v]) => {
            setDrivers(d); setVehicles(v); setLoading(false)
        })
    }, [])

    const filtered = drivers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.license_no?.toLowerCase().includes(search.toLowerCase())
    )

    // Map driver → vehicle from vehicles table
    const driverVehicle = (driverId) => vehicles.find(v => v.driver_id === driverId)

    const openAdd = () => {
        setForm({ id: `D-${String(drivers.length + 1).padStart(3, '0')}`, name: '', license_no: '', contact: '', experience: '', status: 'active' })
        setEditId(null); setShowModal(true)
    }

    const openEdit = (d) => {
        setForm({ id: d.id, name: d.name, license_no: d.license_no || '', contact: d.contact || '', experience: d.experience || '', status: d.status })
        setEditId(d.id); setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.name) return
        setSaving(true)
        await upsertDriver(form)
        const fresh = await getDrivers()
        setDrivers(fresh)
        setSaving(false); setShowModal(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this driver?')) return
        await deleteDriver(id)
        setDrivers(prev => prev.filter(d => d.id !== id))
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Drivers</div>
                    <div className="page-subtitle">Driver registry, vehicle assignments, and performance · Live via Supabase</div>
                </div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Driver</button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
                {[
                    { label: 'Total Drivers', value: drivers.length, color: 'teal' },
                    { label: 'Active', value: drivers.filter(d => d.status === 'active').length, color: 'green' },
                    { label: 'Idle / Unassigned', value: drivers.filter(d => d.status === 'idle').length, color: 'amber' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">Driver Registry ({filtered.length})</span>
                    <div className="search-bar" style={{ minWidth: 220 }}>
                        <Search size={14} className="search-icon" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..." />
                    </div>
                </div>
                {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading drivers…</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>License</th><th>Contact</th><th>Assigned Vehicle</th><th>Experience</th><th>Trips</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(d => {
                                    const veh = driverVehicle(d.id)
                                    return (
                                        <tr key={d.id}>
                                            <td><strong>{d.id}</strong></td>
                                            <td style={{ fontWeight: 500 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#0f766e,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                                                        {d.name.split(' ').map(w => w[0]).join('')}
                                                    </div>
                                                    {d.name}
                                                </div>
                                            </td>
                                            <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.license_no || '—'}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                                    <Phone size={11} style={{ color: 'var(--color-primary)' }} />{d.contact || '—'}
                                                </div>
                                            </td>
                                            <td style={{ fontSize: 12 }}>
                                                {veh ? `${veh.id} (${veh.plate_number})` : '—'}
                                            </td>
                                            <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Award size={11} style={{ color: 'var(--color-warning)' }} />{d.experience || '—'}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{d.trips ?? 0}</td>
                                            <td><span className={`status-badge ${d.status}`}><span className="dot" />{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} onClick={() => openEdit(d)}><Edit2 size={13} /></button>
                                                    <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDelete(d.id)}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{editId ? 'Edit Driver' : 'Add Driver'}</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                {[
                                    { label: 'Full Name *', key: 'name', placeholder: 'e.g. Murugan R.' },
                                    { label: 'License No.', key: 'license_no', placeholder: 'e.g. TN09 2023 12345' },
                                    { label: 'Contact', key: 'contact', placeholder: '+91 98400 00000' },
                                    { label: 'Experience', key: 'experience', placeholder: 'e.g. 3 yrs' },
                                ].map(f => (
                                    <div key={f.key} className="form-group">
                                        <label className="form-label">{f.label}</label>
                                        <input className="form-input" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="active">Active</option>
                                        <option value="idle">Idle</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Driver'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
