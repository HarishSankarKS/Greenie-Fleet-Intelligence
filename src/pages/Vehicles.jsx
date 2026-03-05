import { useState } from 'react'
import { Plus, Search, Truck, Edit2, Trash2, Eye } from 'lucide-react'

const initialVehicles = [
    { id: 'V-001', number: 'TN-09-AB-1234', model: 'Tata 407', type: 'Truck', status: 'active', driver: 'Murugan R.', lastService: '2026-01-15', mileage: '48,200 km' },
    { id: 'V-002', number: 'TN-11-CD-5678', model: 'Ashok Leyland Dost', type: 'Truck', status: 'active', driver: 'Kavitha S.', lastService: '2026-02-01', mileage: '32,100 km' },
    { id: 'V-003', number: 'TN-38-EF-9012', model: 'Mahindra Furio', type: 'Heavy Truck', status: 'maintenance', driver: 'Senthil K.', lastService: '2026-02-18', mileage: '71,500 km' },
    { id: 'V-004', number: 'TN-44-GH-3456', model: 'Eicher Pro 2095', type: 'Truck', status: 'idle', driver: '—', lastService: '2026-01-28', mileage: '25,300 km' },
    { id: 'V-005', number: 'TN-58-IJ-7890', model: 'Tata LPT 1412', type: 'Truck', status: 'active', driver: 'Arjun T.', lastService: '2026-02-10', mileage: '55,800 km' },
    { id: 'V-006', number: 'TN-77-KL-2345', model: 'BharatBenz 1617R', type: 'Heavy Truck', status: 'active', driver: 'Priya M.', lastService: '2026-01-05', mileage: '103,200 km' },
]

const emptyForm = { number: '', model: '', type: 'Truck', status: 'active', driver: '' }

export default function Vehicles() {
    const [vehicles, setVehicles] = useState(initialVehicles)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)

    const filtered = vehicles.filter(v =>
        v.number.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.driver.toLowerCase().includes(search.toLowerCase())
    )

    const handleSave = () => {
        if (!form.number || !form.model) return
        if (editId) {
            setVehicles(prev => prev.map(v => v.id === editId ? { ...v, ...form } : v))
            setEditId(null)
        } else {
            setVehicles(prev => [...prev, { ...form, id: `V-00${prev.length + 1}`, lastService: '—', mileage: '0 km' }])
        }
        setForm(emptyForm)
        setShowModal(false)
    }

    const handleEdit = (v) => {
        setForm({ number: v.number, model: v.model, type: v.type, status: v.status, driver: v.driver })
        setEditId(v.id)
        setShowModal(true)
    }

    const handleDelete = (id) => setVehicles(prev => prev.filter(v => v.id !== id))

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Vehicles</div>
                    <div className="page-subtitle">Fleet vehicle registry and status management</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>
                    <Plus size={15} /> Add Vehicle
                </button>
            </div>

            {/* KPI */}
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
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Plate No.</th><th>Model</th><th>Type</th><th>Driver</th><th>Status</th><th>Mileage</th><th>Last Service</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(v => (
                                <tr key={v.id}>
                                    <td><strong>{v.id}</strong></td>
                                    <td style={{ fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Truck size={13} style={{ color: 'var(--color-primary)' }} />
                                            {v.number}
                                        </div>
                                    </td>
                                    <td>{v.model}</td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.type}</td>
                                    <td>{v.driver}</td>
                                    <td><span className={`status-badge ${v.status}`}><span className="dot" />{v.status.charAt(0).toUpperCase() + v.status.slice(1)}</span></td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.mileage}</td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{v.lastService}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleEdit(v)}><Edit2 size={13} /></button>
                                            <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDelete(v.id)}><Trash2 size={13} /></button>
                                        </div>
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
                            <span className="modal-title">{editId ? 'Edit Vehicle' : 'Add Vehicle'}</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Plate Number *</label>
                                    <input className="form-input" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="e.g. TN-09-AB-1234" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Model *</label>
                                    <input className="form-input" value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} placeholder="e.g. Toyota Hino" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                                        <option>Truck</option>
                                        <option>Heavy Truck</option>
                                        <option>Mini Truck</option>
                                        <option>Loader</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Assigned Driver</label>
                                    <input className="form-input" value={form.driver} onChange={e => setForm(p => ({ ...p, driver: e.target.value }))} placeholder="Driver name" />
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
                            <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Add Vehicle'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
