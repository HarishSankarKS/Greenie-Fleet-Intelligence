import { useState } from 'react'
import { Plus, Search, User, Edit2, Trash2, Phone, Award } from 'lucide-react'

const initialDrivers = [
    { id: 'D-001', name: 'Murugan R.', license: 'TN09 20190044521', contact: '+91 98401 23456', vehicle: 'V-001 (TN-09-AB-1234)', experience: '7 yrs', status: 'active', trips: 412 },
    { id: 'D-002', name: 'Kavitha S.', license: 'TN11 20210088765', contact: '+91 94421 98765', vehicle: 'V-002 (TN-11-CD-5678)', experience: '4 yrs', status: 'active', trips: 283 },
    { id: 'D-003', name: 'Senthil K.', license: 'TN38 20180033210', contact: '+91 97890 55432', vehicle: 'V-003 (TN-38-EF-9012)', experience: '9 yrs', status: 'idle', trips: 638 },
    { id: 'D-004', name: 'Arjun T.', license: 'TN58 20200011098', contact: '+91 93845 66778', vehicle: 'V-005 (TN-58-IJ-7890)', experience: '5 yrs', status: 'active', trips: 315 },
    { id: 'D-005', name: 'Priya M.', license: 'TN77 20220055432', contact: '+91 96000 44556', vehicle: 'V-006 (TN-77-KL-2345)', experience: '2 yrs', status: 'active', trips: 180 },
    { id: 'D-006', name: 'Rajan V.', license: 'TN44 20170022987', contact: '+91 99401 77889', vehicle: '—', experience: '11 yrs', status: 'idle', trips: 754 },
]

const emptyForm = { name: '', license: '', contact: '', vehicle: '', experience: '', status: 'active' }

export default function Drivers() {
    const [drivers, setDrivers] = useState(initialDrivers)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)

    const filtered = drivers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.license.toLowerCase().includes(search.toLowerCase())
    )

    const handleSave = () => {
        if (!form.name || !form.license) return
        if (editId) {
            setDrivers(prev => prev.map(d => d.id === editId ? { ...d, ...form } : d))
            setEditId(null)
        } else {
            setDrivers(prev => [...prev, { ...form, id: `D-00${prev.length + 1}`, trips: 0 }])
        }
        setForm(emptyForm)
        setShowModal(false)
    }

    const handleEdit = (d) => {
        setForm({ name: d.name, license: d.license, contact: d.contact, vehicle: d.vehicle, experience: d.experience, status: d.status })
        setEditId(d.id)
        setShowModal(true)
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Drivers</div>
                    <div className="page-subtitle">Driver registry, assignments, and performance</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>
                    <Plus size={15} /> Add Driver
                </button>
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
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>License</th><th>Contact</th><th>Assigned Vehicle</th><th>Experience</th><th>Trips</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(d => (
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
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.license}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                            <Phone size={11} style={{ color: 'var(--color-primary)' }} />{d.contact}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 12 }}>{d.vehicle}</td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Award size={11} style={{ color: 'var(--color-warning)' }} />{d.experience}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{d.trips}</td>
                                    <td><span className={`status-badge ${d.status}`}><span className="dot" />{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleEdit(d)}><Edit2 size={13} /></button>
                                            <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => setDrivers(prev => prev.filter(x => x.id !== d.id))}><Trash2 size={13} /></button>
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
                            <span className="modal-title">{editId ? 'Edit Driver' : 'Add Driver'}</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                {[
                                    { label: 'Full Name *', key: 'name', placeholder: 'e.g. Murugan R.' },
                                    { label: 'License No. *', key: 'license', placeholder: 'e.g. TN09 2023 12345' },
                                    { label: 'Contact', key: 'contact', placeholder: '+91 98400 00000' },
                                    { label: 'Assigned Vehicle', key: 'vehicle', placeholder: 'e.g. V-001 (TN-09-AB-1234)' },
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
                            <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Add Driver'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
