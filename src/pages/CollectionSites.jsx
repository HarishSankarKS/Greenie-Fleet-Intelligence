import { useState, useEffect } from 'react'
import { Plus, Search, MapPin, Edit2, Trash2, Eye, Factory, HardHat, Truck, X, CheckCircle } from 'lucide-react'
import { ACTIVITY_COLORS } from '../utils/siteInventory'
import {
    getCollectionSites, upsertCollectionSite, deleteCollectionSite,
    dispatchVehicle, subscribeToCollectionSites
} from '../utils/supabaseHelpers'
import { getVehicles, getDrivers } from '../utils/supabaseHelpers'

const TRANSFER_STATIONS = [
    { id: 'TS-N', name: 'Greenie North Transfer Station', area: 'Thudiyalur',           zone: 'North', capacity: 150, used: 112, status: 'active',      wards: '1–5, 12',  color: '#1a3263' },
    { id: 'TS-S', name: 'Greenie South Transfer Station', area: 'Singanallur',           zone: 'South', capacity: 200, used: 164, status: 'active',      wards: '60–65',    color: '#0f766e' },
    { id: 'TS-E', name: 'Greenie East Transfer Station',  area: 'Irugur / Avinashi Rd', zone: 'East',  capacity: 180, used: 91,  status: 'active',      wards: '23–30',    color: '#c8a951' },
    { id: 'TS-W', name: 'Greenie West Transfer Station',  area: 'Kuniyamuthur',          zone: 'West',  capacity: 120, used: 44,  status: 'maintenance', wards: '71–75, 82', color: '#6b7280' },
]
const ZONE_ICON = { North: '🔵', South: '🟢', East: '🟡', West: '⚫' }

const activityIcon = { Demolition: '🔨', 'Road Works': '🚧', Construction: '🏗️', Excavation: '⛏️' }

export default function CollectionSites() {
    const [sites, setSites] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterZone, setFilterZone] = useState('All')
    const [filterActivity, setFilterActivity] = useState('All')

    // Add site modal
    const [showAddModal, setShowAddModal] = useState(false)
    const [form, setForm] = useState({ name: '', area: '', ward: '', zone: 'North', activity: 'Demolition', waste_type: '', capacity_tonnes: '' })

    // Dispatch modal
    const [dispatchSite, setDispatchSite] = useState(null)
    const [dispVehicle, setDispVehicle] = useState('')
    const [dispDriver, setDispDriver] = useState('')
    const [dispatching, setDispatching] = useState(false)
    const [dispatchDone, setDispatchDone] = useState(false)

    useEffect(() => {
        Promise.all([getCollectionSites(), getVehicles(), getDrivers()]).then(([s, v, d]) => {
            setSites(s); setVehicles(v); setDrivers(d); setLoading(false)
        })
        const ch = subscribeToCollectionSites(() => {
            getCollectionSites().then(setSites)
        })
        return () => ch.unsubscribe()
    }, [])

    // Available vehicles for a given zone (idle or active, not maintenance)
    const availableVehicles = vehicles.filter(v => v.status !== 'maintenance')

    const filtered = sites.filter(s =>
        (filterZone === 'All' || s.zone === filterZone) &&
        (filterActivity === 'All' || s.activity === filterActivity) &&
        (s.name.toLowerCase().includes(search.toLowerCase()) || s.area?.toLowerCase().includes(search.toLowerCase()))
    )

    const handleAdd = async () => {
        if (!form.name || !form.area) return
        const newSite = {
            id: `CBE-S${String(sites.length + 1).padStart(2, '0')}`,
            ...form, ward: parseInt(form.ward) || 0,
            capacity_tonnes: parseInt(form.capacity_tonnes) || 50,
            used_tonnes: 0, status: 'active', ai_confidence: 80,
        }
        await upsertCollectionSite(newSite)
        const fresh = await getCollectionSites()
        setSites(fresh)
        setShowAddModal(false)
        setForm({ name: '', area: '', ward: '', zone: 'North', activity: 'Demolition', waste_type: '', capacity_tonnes: '' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this site?')) return
        await deleteCollectionSite(id)
        setSites(prev => prev.filter(s => s.id !== id))
    }

    const openDispatch = (site) => {
        setDispatchSite(site)
        setDispVehicle(''); setDispDriver('')
        setDispatchDone(false)
    }

    const handleDispatch = async () => {
        if (!dispVehicle || !dispDriver) return
        setDispatching(true)
        const ok = await dispatchVehicle({
            type: 'site_collection',
            ref_id: dispatchSite.id,
            vehicle_id: dispVehicle,
            driver_id: dispDriver,
        })
        setDispatching(false)
        if (ok) {
            setDispatchDone(true)
            const fresh = await getCollectionSites()
            setSites(fresh)
            setTimeout(() => setDispatchSite(null), 1800)
        }
    }

    const avgCap = sites.length ? Math.round(sites.reduce((a, s) => a + Math.round((s.used_tonnes / s.capacity_tonnes) * 100), 0) / sites.length) : 0
    const lowAI  = sites.filter(s => s.ai_confidence < 70).length
    const totalUsed = sites.reduce((a, s) => a + (s.used_tonnes || 0), 0)

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Sites & Transfer Stations</div>
                    <div className="page-subtitle">4 Greenie transfer hubs · {sites.length} active C&D collection sites · Live via Supabase</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={15} /> Add Site
                </button>
            </div>

            {/* KPIs */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                {[
                    { label: 'Transfer Stations',   value: '4',                                                                   color: 'teal'  },
                    { label: 'Active Demo Sites',    value: sites.filter(s => s.status === 'active').length,                      color: 'green' },
                    { label: 'Waste Accumulated',    value: `${totalUsed}T`,                                                      color: 'blue'  },
                    { label: 'Sites Near Full',      value: sites.filter(s => Math.round((s.used_tonnes/s.capacity_tonnes)*100) > 80).length, color: 'amber' },
                    { label: 'AI Flags (<70%)',      value: lowAI,                                                                 color: lowAI > 0 ? 'red' : 'green' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                    </div>
                ))}
            </div>

            {/* Transfer Stations (static) */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Factory size={15} color="#1a3263" /> Greenie Transfer Stations
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                    {TRANSFER_STATIONS.map(ts => {
                        const pct = Math.round((ts.used / ts.capacity) * 100)
                        return (
                            <div key={ts.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: `2px solid ${ts.color}22`, borderLeft: `4px solid ${ts.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 10.5, fontWeight: 700, color: ts.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{ZONE_ICON[ts.zone]} {ts.zone} Zone</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.3 }}>{ts.name}</div>
                                        <div style={{ fontSize: 11.5, color: '#5a6478', marginTop: 2 }}>{ts.area} · Wards {ts.wards}</div>
                                    </div>
                                    <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: ts.status === 'active' ? '#e8f9f0' : '#fef3cd', color: ts.status === 'active' ? '#10b981' : '#d97706' }}>
                                        {ts.status === 'active' ? '● Active' : '⚙ Maintenance'}
                                    </span>
                                </div>
                                <div style={{ fontSize: 11.5, marginBottom: 2, fontWeight: 600 }}>
                                    {ts.used}T / {ts.capacity}T <span style={{ marginLeft: 6, color: pct > 80 ? '#ef4444' : '#10b981', fontWeight: 700 }}>({pct}%)</span>
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

            {/* C&D Collection Sites Table */}
            <div className="card">
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <HardHat size={15} color="#f59e0b" />
                        <span className="card-title">Active C&D Collection Sites ({filtered.length})</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select value={filterZone} onChange={e => setFilterZone(e.target.value)} style={{ padding: '6px 10px', border: '1.5px solid #dce1ea', borderRadius: 7, fontSize: 12, background: '#fff' }}>
                            {['All', 'North', 'South', 'East', 'West'].map(z => <option key={z}>{z}</option>)}
                        </select>
                        <select value={filterActivity} onChange={e => setFilterActivity(e.target.value)} style={{ padding: '6px 10px', border: '1.5px solid #dce1ea', borderRadius: 7, fontSize: 12, background: '#fff' }}>
                            {['All', 'Demolition', 'Road Works', 'Construction', 'Excavation'].map(a => <option key={a}>{a}</option>)}
                        </select>
                        <div className="search-bar" style={{ minWidth: 200 }}>
                            <Search size={13} className="search-icon" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sites…" />
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading sites…</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Site ID</th><th>Site Name</th><th>Area / Ward</th><th>Drops to TS</th>
                                    <th>Activity</th><th>Dominant Waste</th><th>Waste Accumulated</th>
                                    <th>AI Scan Conf.</th><th>Status</th><th>Assigned Vehicle</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(site => {
                                    const pct = site.capacity_tonnes ? Math.round((site.used_tonnes / site.capacity_tonnes) * 100) : 0
                                    const actCfg = ACTIVITY_COLORS[site.activity] || { bg: '#f5f6f8', color: '#5a6478' }
                                    const tsColor = { North: '#1a3263', South: '#0f766e', East: '#c8a951', West: '#6b7280' }[site.zone]
                                    const isDispatched = site.status === 'dispatched'
                                    return (
                                        <tr key={site.id} style={{ background: site.ai_confidence < 70 ? '#fff7ed' : 'transparent' }}>
                                            <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{site.id}</strong></td>
                                            <td style={{ fontWeight: 600, maxWidth: 180 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MapPin size={12} color="var(--color-primary)" />{site.name}
                                                </div>
                                            </td>
                                            <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                                {site.area}<br /><span style={{ fontSize: 11 }}>Ward {site.ward}</span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: 11.5, fontWeight: 700, color: tsColor }}>{ZONE_ICON[site.zone]} {site.zone}</span>
                                                <div style={{ fontSize: 10.5, color: '#5a6478' }}>→ TS-{site.zone?.[0]}</div>
                                            </td>
                                            <td>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: actCfg.bg, color: actCfg.color }}>
                                                    {activityIcon[site.activity]} {site.activity}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: 12 }}>{site.waste_type}</td>
                                            <td style={{ minWidth: 120 }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#1a1a2e' }}>
                                                    {site.used_tonnes}T
                                                </div>
                                                <div style={{ height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginTop: 4 }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981' }} />
                                                </div>
                                                <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{pct > 80 ? '⚠ Urgent pickup' : pct > 60 ? 'Schedule soon' : 'Normal'}</div>
                                            </td>
                                            <td>
                                                <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: site.ai_confidence >= 70 ? '#e8f9f0' : '#fef2f2', color: site.ai_confidence >= 70 ? '#10b981' : '#ef4444' }}>
                                                    {site.ai_confidence < 70 && '⚠ '}{site.ai_confidence}%
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${isDispatched ? 'blue' : site.status === 'active' ? 'active' : 'idle'}`}>
                                                    <span className="dot" />
                                                    {isDispatched ? 'Dispatched' : site.status === 'active' ? 'Active' : 'Awaiting Pickup'}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: 12 }}>
                                                {site.vehicles?.plate_number
                                                    ? <span style={{ fontWeight: 600, color: '#1a3263' }}><Truck size={11} style={{ marginRight: 4 }} />{site.vehicles.plate_number}</span>
                                                    : <span style={{ color: '#9ca3af' }}>—</span>
                                                }
                                                {site.drivers?.name && <div style={{ fontSize: 11, color: '#5a6478' }}>{site.drivers.name}</div>}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 5 }}>
                                                    {!isDispatched && (
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            style={{ padding: '4px 10px', fontSize: 11 }}
                                                            onClick={() => openDispatch(site)}
                                                            title="Dispatch vehicle"
                                                        >
                                                            <Truck size={12} /> Dispatch
                                                        </button>
                                                    )}
                                                    <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDelete(site.id)} title="Delete"><Trash2 size={12} /></button>
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

            {/* ── Add Site Modal ── */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Add Collection Site</span>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                {[
                                    { label: 'Site Name *', key: 'name', type: 'text', placeholder: 'e.g. Singanallur Factory Block' },
                                    { label: 'Area *', key: 'area', type: 'text', placeholder: 'e.g. Singanallur' },
                                    { label: 'Ward No.', key: 'ward', type: 'text', placeholder: 'e.g. 44' },
                                    { label: 'Material / Waste Type', key: 'waste_type', type: 'text', placeholder: 'e.g. Concrete / Brick' },
                                    { label: 'Capacity (T)', key: 'capacity_tonnes', type: 'number', placeholder: 'e.g. 60' },
                                ].map(({ label, key, type, placeholder }) => (
                                    <div className="form-group" key={key}>
                                        <label className="form-label">{label}</label>
                                        <input className="form-input" type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
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
                            <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAdd}>Add Site</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Dispatch Modal ── */}
            {dispatchSite && (
                <div className="modal-overlay" onClick={() => setDispatchSite(null)}>
                    <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Truck size={16} color="#1a3263" />
                                <span className="modal-title">Dispatch Vehicle</span>
                            </div>
                            <button className="modal-close" onClick={() => setDispatchSite(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {dispatchDone ? (
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <CheckCircle size={40} color="#10b981" style={{ marginBottom: 10 }} />
                                    <div style={{ fontWeight: 700, fontSize: 16, color: '#10b981' }}>Vehicle Dispatched!</div>
                                    <div style={{ color: '#5a6478', fontSize: 13, marginTop: 6 }}>Site status updated to Dispatched.</div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ background: '#f8f9fb', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13 }}>
                                        <strong>Site:</strong> {dispatchSite.name}<br />
                                        <span style={{ color: '#5a6478' }}>{dispatchSite.area} · {dispatchSite.zone} Zone · {dispatchSite.waste_type}</span>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Select Vehicle *</label>
                                            <select className="form-select" value={dispVehicle} onChange={e => {
                                                setDispVehicle(e.target.value)
                                                // Auto-select linked driver
                                                const v = availableVehicles.find(v => v.id === e.target.value)
                                                if (v?.driver_id) setDispDriver(v.driver_id)
                                            }}>
                                                <option value="">— Choose vehicle —</option>
                                                {availableVehicles.map(v => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.plate_number} ({v.model}) — {v.status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Driver *</label>
                                            <select className="form-select" value={dispDriver} onChange={e => setDispDriver(e.target.value)}>
                                                <option value="">— Choose driver —</option>
                                                {drivers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {!dispatchDone && (
                            <div className="modal-footer">
                                <button className="btn btn-outline" onClick={() => setDispatchSite(null)}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleDispatch}
                                    disabled={!dispVehicle || !dispDriver || dispatching}
                                >
                                    {dispatching ? 'Dispatching…' : <><Truck size={14} /> Confirm Dispatch</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
