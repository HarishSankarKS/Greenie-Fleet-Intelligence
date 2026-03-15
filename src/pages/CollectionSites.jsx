import { useState } from 'react'
import { Plus, Search, MapPin, Edit2, Trash2, Eye, Building2, HardHat, Factory, Truck } from 'lucide-react'
import { ACTIVITY_COLORS } from '../utils/siteInventory'

// ── 4 Greenie Transfer Stations ───────────────────────────────────────────────
const TRANSFER_STATIONS = [
    { id: 'TS-N', name: 'Greenie North Transfer Station', area: 'Thudiyalur',           zone: 'North', capacity: 150, used: 112, status: 'active',      wards: '1–5, 12',  color: '#1a3263' },
    { id: 'TS-S', name: 'Greenie South Transfer Station', area: 'Singanallur',           zone: 'South', capacity: 200, used: 164, status: 'active',      wards: '60–65',    color: '#0f766e' },
    { id: 'TS-E', name: 'Greenie East Transfer Station',  area: 'Irugur / Avinashi Rd', zone: 'East',  capacity: 180, used: 91,  status: 'active',      wards: '23–30',    color: '#c8a951' },
    { id: 'TS-W', name: 'Greenie West Transfer Station',  area: 'Kuniyamuthur',          zone: 'West',  capacity: 120, used: 44,  status: 'maintenance', wards: '71–75, 82', color: '#6b7280' },
]

const ZONE_ICON = { North: '🔵', South: '🟢', East: '🟡', West: '⚫' }

// ── 12 Active C&D / Demolition Collection Sites ───────────────────────────────
const initialSites = [
    { id: 'CBE-S01', name: 'RS Puram Old Residential Block',    area: 'RS Puram',        ward: 70,  zone: 'South', activity: 'Demolition',   type: 'Brick / Concrete Rubble', capacity: 50,  used: 38, status: 'active',      aiConf: 91, lastCollection: '2026-03-14' },
    { id: 'CBE-S02', name: 'Gandhipuram Commercial Teardown',   area: 'Gandhipuram',     ward: 67,  zone: 'North', activity: 'Demolition',   type: 'Steel / Concrete Rubble', capacity: 80,  used: 64, status: 'active',      aiConf: 85, lastCollection: '2026-03-14' },
    { id: 'CBE-S03', name: 'Peelamedu Junction Warehouse Site', area: 'Peelamedu',       ward: 36,  zone: 'East',  activity: 'Demolition',   type: 'Steel / Mixed Debris',    capacity: 100, used: 77, status: 'active',      aiConf: 78, lastCollection: '2026-03-14' },
    { id: 'CBE-S04', name: 'Ramanathapuram Layout Demo',        area: 'Ramanathapuram',  ward: 33,  zone: 'South', activity: 'Demolition',   type: 'Brick / Timber',          capacity: 60,  used: 48, status: 'active',      aiConf: 88, lastCollection: '2026-03-13' },
    { id: 'CBE-S05', name: 'Ondipudur Bypass Road Widening',    area: 'Ondipudur',       ward: 29,  zone: 'East',  activity: 'Road Works',   type: 'Concrete / Aggregate',    capacity: 70,  used: 61, status: 'active',      aiConf: 62, lastCollection: '2026-03-13' },
    { id: 'CBE-S06', name: 'Ganapathy 4th Cross Site',          area: 'Ganapathy',       ward: 55,  zone: 'North', activity: 'Construction', type: 'Mixed Debris / Brick',    capacity: 45,  used: 28, status: 'active',      aiConf: 82, lastCollection: '2026-03-12' },
    { id: 'CBE-S07', name: 'Kovaipudur Hill Access Road',       area: 'Kovaipudur',      ward: 82,  zone: 'West',  activity: 'Excavation',   type: 'Concrete / Aggregate',    capacity: 40,  used: 30, status: 'active',      aiConf: 93, lastCollection: '2026-03-14' },
    { id: 'CBE-S08', name: 'Saibaba Colony Junction Demo',      area: 'Saibaba Colony',  ward: 69,  zone: 'North', activity: 'Demolition',   type: 'Brick / Steel',           capacity: 55,  used: 44, status: 'active',      aiConf: 55, lastCollection: '2026-03-12' },
    { id: 'CBE-S09', name: 'Kalapatti IT Corridor',             area: 'Kalapatti',       ward: 23,  zone: 'East',  activity: 'Construction', type: 'Concrete / Steel',        capacity: 65,  used: 54, status: 'active',      aiConf: 76, lastCollection: '2026-03-13' },
    { id: 'CBE-S10', name: 'Podanur Railway-Adjacent Site',     area: 'Podanur',         ward: 90,  zone: 'South', activity: 'Demolition',   type: 'Steel / Concrete',        capacity: 35,  used: 26, status: 'idle',        aiConf: 70, lastCollection: '2026-03-11' },
    { id: 'CBE-S11', name: 'Sowripalayam Old Factory',          area: 'Sowripalayam',    ward: 45,  zone: 'South', activity: 'Demolition',   type: 'Steel / Plastic',         capacity: 80,  used: 53, status: 'active',      aiConf: 47, lastCollection: '2026-03-10' },
    { id: 'CBE-S12', name: 'Mettupalayam Rd Flyover Site',      area: 'Thudiyalur',      ward: 2,   zone: 'North', activity: 'Road Works',   type: 'Concrete / Aggregate',    capacity: 90,  used: 74, status: 'active',      aiConf: 88, lastCollection: '2026-03-14' },
]

const activityIcon = { Demolition: '🔨', 'Road Works': '🚧', Construction: '🏗️', Excavation: '⛏️' }

export default function CollectionSites() {
    const [sites, setSites] = useState(initialSites)
    const [search, setSearch] = useState('')
    const [filterZone, setFilterZone] = useState('All')
    const [filterActivity, setFilterActivity] = useState('All')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: '', area: '', ward: '', zone: 'North', activity: 'Demolition', type: '', capacity: '' })

    const filtered = sites.filter(s =>
        (filterZone === 'All' || s.zone === filterZone) &&
        (filterActivity === 'All' || s.activity === filterActivity) &&
        (s.name.toLowerCase().includes(search.toLowerCase()) || s.area.toLowerCase().includes(search.toLowerCase()))
    )

    const handleAdd = () => {
        if (!form.name || !form.area) return
        setSites(prev => [...prev, {
            ...form, id: `CBE-S${String(prev.length + 1).padStart(2, '0')}`,
            capacity: parseInt(form.capacity) || 50, used: 0,
            status: 'active', aiConf: 80, lastCollection: '—',
        }])
        setShowModal(false)
        setForm({ name: '', area: '', ward: '', zone: 'North', activity: 'Demolition', type: '', capacity: '' })
    }

    const avgCap = Math.round(sites.reduce((a, s) => a + Math.round((s.used / s.capacity) * 100), 0) / sites.length)
    const lowAI  = sites.filter(s => s.aiConf < 70).length
    const totalUsed = sites.reduce((a, s) => a + s.used, 0)

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Sites & Transfer Stations</div>
                    <div className="page-subtitle">4 Greenie transfer hubs · 12 active C&D collection sites across Coimbatore</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={15} /> Add Site
                </button>
            </div>

            {/* ── Summary KPIs ── */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                {[
                    { label: 'Transfer Stations',   value: '4',              color: 'teal'  },
                    { label: 'Active Demo Sites',    value: sites.filter(s => s.status === 'active').length, color: 'green' },
                    { label: 'Waste Accumulated',    value: `${totalUsed}T`,  color: 'blue'  },
                    { label: 'Sites Near Full',      value: sites.filter(s => Math.round((s.used/s.capacity)*100) > 80).length, color: 'amber' },
                    { label: 'AI Flags (<70%)',      value: lowAI,            color: lowAI > 0 ? 'red' : 'green' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                    </div>
                ))}
            </div>

            {/* ── Transfer Stations Grid ── */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Factory size={15} color="#1a3263" /> Greenie Transfer Stations
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                    {TRANSFER_STATIONS.map(ts => {
                        const pct = Math.round((ts.used / ts.capacity) * 100)
                        return (
                            <div key={ts.id} style={{
                                background: '#fff', borderRadius: 12, padding: '16px 18px',
                                border: `2px solid ${ts.color}22`,
                                borderLeft: `4px solid ${ts.color}`,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 10.5, fontWeight: 700, color: ts.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                                            {ZONE_ICON[ts.zone]} {ts.zone} Zone
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>{ts.name}</div>
                                        <div style={{ fontSize: 11.5, color: '#5a6478', marginTop: 2 }}>{ts.area} · Wards {ts.wards}</div>
                                    </div>
                                    <span style={{
                                        fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                                        background: ts.status === 'active' ? '#e8f9f0' : '#fef3cd',
                                        color: ts.status === 'active' ? '#10b981' : '#d97706',
                                    }}>{ts.status === 'active' ? '● Active' : '⚙ Maintenance'}</span>
                                </div>
                                <div style={{ fontSize: 11.5, marginBottom: 2, fontWeight: 600 }}>
                                    {ts.used}T / {ts.capacity}T
                                    <span style={{ marginLeft: 6, color: pct > 80 ? '#ef4444' : '#10b981', fontWeight: 700 }}>({pct}%)</span>
                                </div>
                                <div style={{ height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${ts.color}, ${ts.color}99)`, borderRadius: 4 }} />
                                </div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                    <button className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 11 }}><Eye size={11} /> View</button>
                                    <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}><Edit2 size={11} /></button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── C&D Collection Sites Table ── */}
            <div className="card">
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <HardHat size={15} color="#f59e0b" />
                        <span className="card-title">Active C&D Collection Sites ({filtered.length})</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {/* Zone filter */}
                        <select value={filterZone} onChange={e => setFilterZone(e.target.value)}
                            style={{ padding: '6px 10px', border: '1.5px solid #dce1ea', borderRadius: 7, fontSize: 12, background: '#fff' }}>
                            {['All', 'North', 'South', 'East', 'West'].map(z => <option key={z}>{z}</option>)}
                        </select>
                        {/* Activity filter */}
                        <select value={filterActivity} onChange={e => setFilterActivity(e.target.value)}
                            style={{ padding: '6px 10px', border: '1.5px solid #dce1ea', borderRadius: 7, fontSize: 12, background: '#fff' }}>
                            {['All', 'Demolition', 'Road Works', 'Construction', 'Excavation'].map(a => <option key={a}>{a}</option>)}
                        </select>
                        <div className="search-bar" style={{ minWidth: 200 }}>
                            <Search size={13} className="search-icon" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites…" />
                        </div>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Site ID</th>
                                <th>Demolition / Construction Site</th>
                                <th>Area / Ward</th>
                                <th>Drops to TS</th>
                                <th>Activity</th>
                                <th>Dominant Waste</th>
                                <th>Waste Accumulated</th>
                                <th>AI Scan Conf.</th>
                                <th>Pickup Status</th>
                                <th>Next Scheduled</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(site => {
                                const pct = Math.round((site.used / site.capacity) * 100)
                                const actCfg = ACTIVITY_COLORS[site.activity] || { bg: '#f5f6f8', color: '#5a6478' }
                                const tsColor = { North: '#1a3263', South: '#0f766e', East: '#c8a951', West: '#6b7280' }[site.zone]
                                return (
                                    <tr key={site.id} style={{ background: site.aiConf < 70 ? '#fff7ed' : 'transparent' }}>
                                        <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{site.id}</strong></td>
                                        <td style={{ fontWeight: 600, maxWidth: 180 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <MapPin size={12} color="var(--color-primary)" />
                                                {site.name}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            {site.area}<br />
                                            <span style={{ fontSize: 11 }}>Ward {site.ward}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: 11.5, fontWeight: 700, color: tsColor }}>
                                                {ZONE_ICON[site.zone]} {site.zone}
                                            </span>
                                            <div style={{ fontSize: 10.5, color: '#5a6478' }}>→ TS-{site.zone[0]}</div>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                                background: actCfg.bg, color: actCfg.color,
                                            }}>
                                                {activityIcon[site.activity]} {site.activity}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12 }}>{site.type}</td>
                                        <td style={{ minWidth: 120 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#1a1a2e' }}>
                                                {site.used}T
                                            </div>
                                            <div style={{ height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
                                                <div style={{
                                                    width: `${pct}%`, height: '100%', borderRadius: 3,
                                                    background: pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981',
                                                }} />
                                            </div>
                                            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{pct > 80 ? '⚠ Urgent pickup' : pct > 60 ? 'Schedule soon' : 'Normal'}</div>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 700,
                                                background: site.aiConf >= 70 ? '#e8f9f0' : '#fef2f2',
                                                color: site.aiConf >= 70 ? '#10b981' : '#ef4444',
                                            }}>
                                                {site.aiConf < 70 && '⚠ '}{site.aiConf}%
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${site.status}`}>
                                                <span className="dot" />
                                                {site.status === 'idle' ? 'Awaiting Pickup' : site.status === 'active' ? 'Active — In Progress' : site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            {site.lastCollection !== '—' ? <><span style={{ fontSize: 10.5, color: '#9ca3af' }}>Last: </span>{site.lastCollection}</> : <span style={{ color: '#ef4444' }}>Not yet collected</span>}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View"><Eye size={12} /></button>
                                                <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="Edit"><Edit2 size={12} /></button>
                                                <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} title="Delete" onClick={() => setSites(p => p.filter(s => s.id !== site.id))}><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Add Site Modal ── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Add Collection Site</span>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                {[
                                    { label: 'Site Name *', key: 'name',     type: 'text',   placeholder: 'e.g. Singanallur Factory Block' },
                                    { label: 'Area *',      key: 'area',     type: 'text',   placeholder: 'e.g. Singanallur' },
                                    { label: 'Ward No.',    key: 'ward',     type: 'text',   placeholder: 'e.g. 44' },
                                    { label: 'Material Type',key: 'type',    type: 'text',   placeholder: 'e.g. Concrete / Brick' },
                                    { label: 'Capacity (T)',key: 'capacity', type: 'number', placeholder: 'e.g. 60' },
                                ].map(({ label, key, type, placeholder }) => (
                                    <div className="form-group" key={key}>
                                        <label className="form-label">{label}</label>
                                        <input className="form-input" type={type} value={form[key]}
                                            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label className="form-label">Zone</label>
                                    <select className="form-select" value={form.zone} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))}>
                                        {['North', 'South', 'East', 'West'].map(z => <option key={z}>{z}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Activity Type</label>
                                    <select className="form-select" value={form.activity} onChange={e => setForm(p => ({ ...p, activity: e.target.value }))}>
                                        {['Demolition', 'Road Works', 'Construction', 'Excavation'].map(a => <option key={a}>{a}</option>)}
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
