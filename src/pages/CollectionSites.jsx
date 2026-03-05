import { useState } from 'react'
import { Plus, Search, MapPin, Edit2, Trash2, Eye } from 'lucide-react'

const initialSites = [
    { id: 'CS-001', name: 'Chennai Central Hub', location: 'Anna Salai, Chennai', type: 'C&D Waste', capacity: '50 tons', status: 'active', units: 8, lastCollection: '2026-02-21' },
    { id: 'CS-002', name: 'Coimbatore North Depot', location: 'Ganapathy, Coimbatore', type: 'Mixed Debris', capacity: '80 tons', status: 'active', units: 12, lastCollection: '2026-02-20' },
    { id: 'CS-003', name: 'Madurai South Site', location: 'Mattuthavani, Madurai', type: 'Concrete Rubble', capacity: '30 tons', status: 'idle', units: 4, lastCollection: '2026-02-19' },
    { id: 'CS-004', name: 'Salem Industrial Hub', location: 'Ammapet Industrial Area, Salem', type: 'C&D Waste', capacity: '120 tons', status: 'active', units: 15, lastCollection: '2026-02-21' },
    { id: 'CS-005', name: 'Trichy West Base', location: 'Ariyamangalam, Trichy', type: 'Mixed Waste', capacity: '60 tons', status: 'maintenance', units: 6, lastCollection: '2026-02-18' },
    { id: 'CS-006', name: 'Tirunelveli Gateway', location: 'Palayamkottai, Tirunelveli', type: 'C&D Waste', capacity: '45 tons', status: 'active', units: 9, lastCollection: '2026-02-21' },
]

export default function CollectionSites() {
    const [sites, setSites] = useState(initialSites)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: '', location: '', type: 'C&D Waste', capacity: '', status: 'active' })

    const filtered = sites.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.location.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = () => {
        if (!form.name || !form.location) return
        setSites(prev => [...prev, {
            ...form, id: `CS-00${prev.length + 1}`, units: 0, lastCollection: '—'
        }])
        setForm({ name: '', location: '', type: 'C&D Waste', capacity: '', status: 'active' })
        setShowModal(false)
    }

    const handleDelete = (id) => setSites(prev => prev.filter(s => s.id !== id))

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Collection Sites</div>
                    <div className="page-subtitle">Manage all waste collection points across the city</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={15} /> Add Site
                </button>
            </div>

            {/* Summary KPIs */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
                {[
                    { label: 'Total Sites', value: sites.length, color: 'teal' },
                    { label: 'Active', value: sites.filter(s => s.status === 'active').length, color: 'green' },
                    { label: 'Idle', value: sites.filter(s => s.status === 'idle').length, color: 'amber' },
                    { label: 'Maintenance', value: sites.filter(s => s.status === 'maintenance').length, color: 'red' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <span className="card-title">All Sites ({filtered.length})</span>
                    <div className="search-bar" style={{ minWidth: 240 }}>
                        <Search size={14} className="search-icon" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites..." />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Site ID</th><th>Name</th><th>Location</th><th>Type</th><th>Capacity</th><th>Units</th><th>Status</th><th>Last Collection</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(site => (
                                <tr key={site.id}>
                                    <td><strong>{site.id}</strong></td>
                                    <td style={{ fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
                                            {site.name}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{site.location}</td>
                                    <td>{site.type}</td>
                                    <td>{site.capacity}</td>
                                    <td>{site.units}</td>
                                    <td><span className={`status-badge ${site.status}`}><span className="dot" />{site.status.charAt(0).toUpperCase() + site.status.slice(1)}</span></td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{site.lastCollection}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View"><Eye size={13} /></button>
                                            <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="Edit"><Edit2 size={13} /></button>
                                            <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} title="Delete" onClick={() => handleDelete(site.id)}><Trash2 size={13} /></button>
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
                            <span className="modal-title">Add Collection Site</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Site Name *</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. North Depot" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location *</label>
                                    <input className="form-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Block 5, North Area" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Waste Type</label>
                                    <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                                        <option>C&D Waste</option>
                                        <option>Mixed Debris</option>
                                        <option>Concrete Rubble</option>
                                        <option>Mixed Waste</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Capacity</label>
                                    <input className="form-input" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} placeholder="e.g. 60 tons" />
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
                            <button className="btn btn-primary" onClick={handleAdd}>Add Site</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
