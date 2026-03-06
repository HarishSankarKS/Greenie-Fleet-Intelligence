import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Activity, Clock, AlertTriangle, Filter, RefreshCw, Cpu, Zap, TrendingUp, Radio } from 'lucide-react'
import { useDRLRoutes, SITES, TRUCKS, TRUCK_COLORS } from '../utils/drlCVRP'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const siteIcon = (status) => L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;border-radius:50%;
    background:${status === 'active' ? '#10b981' : status === 'idle' ? '#f59e0b' : '#ef4444'};
    border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -14],
})

const trafficIcon = (congestion) => L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:50%;
    background:${congestion >= 0.8 ? '#10b981' : congestion >= 0.5 ? '#f59e0b' : '#ef4444'};
    border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [12, 12], iconAnchor: [6, 6],
})

const PHASE_LABELS = {
    initialising: { text: 'Initialising…', color: '#6b7280' },
    fetching_traffic: { text: 'Fetching Live Traffic', color: '#f59e0b' },
    fetching_matrix: { text: 'Building Road Matrix', color: '#3b82f6' },
    solving: { text: 'DRL Solving…', color: '#8b5cf6' },
    fetching_routes: { text: 'Loading Route Paths', color: '#0ea5e9' },
    ready: { text: 'Routes Optimised', color: '#10b981' },
    error: { text: 'Error', color: '#ef4444' },
}

const ALG_STEPS = [
    { key: 'gnn', label: 'GNN Attention', sub: 'Site scoring', icon: Cpu },
    { key: 'ppo', label: 'PPO Update', sub: 'Reward shaping', icon: TrendingUp },
    { key: '2opt', label: '2-opt Refine', sub: 'Local search', icon: Zap },
]

const congestionColor = (c) => c >= 0.8 ? '#10b981' : c >= 0.5 ? '#f59e0b' : '#ef4444'
const congestionLabel = (c) => c >= 0.8 ? 'Free Flow' : c >= 0.5 ? 'Moderate' : 'Congested'

export default function Monitoring() {
    const { phase, routes, routeGeometries, trafficSpeeds, episode, reward, convergence, avgTrafficFactor, timestamp, reOptimise } = useDRLRoutes()
    const [filter, setFilter] = useState('all')
    const [algStep, setAlgStep] = useState(0)

    // Cycle algorithm step during solving
    useEffect(() => {
        if (phase === 'solving') {
            const iv = setInterval(() => setAlgStep(s => (s + 1) % 3), 700)
            return () => clearInterval(iv)
        }
        if (phase === 'ready') setAlgStep(-1) // -1 = all done
    }, [phase])

    const statusSites = SITES.map(s => {
        const route = routes.find(r => r.assignedSites.some(a => a.id === s.id))
        const order = route ? route.assignedSites.findIndex(a => a.id === s.id) : -1
        let status = 'idle'
        if (route) status = order === 0 ? 'active' : 'active'
        return { ...s, status, truckColor: route?.color || '#6b7280' }
    })
    const filtered = filter === 'all' ? statusSites : statusSites.filter(s => s.status === filter)
    const phaseInfo = PHASE_LABELS[phase] || PHASE_LABELS.initialising
    const pct = parseFloat(convergence) || 0
    const avgSpeed = trafficSpeeds.length
        ? Math.round(trafficSpeeds.reduce((s, t) => s + t.currentSpeed, 0) / trafficSpeeds.length)
        : '—'

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Monitoring / DRL Route Optimisation</div>
                    <div className="page-subtitle">
                        Hybrid DRL-CVRP with live Coimbatore traffic · {SITES.length} sites · {TRUCKS.length} trucks
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                        background: phaseInfo.color + '18', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        color: phaseInfo.color, border: `1px solid ${phaseInfo.color}40`,
                    }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: phaseInfo.color, display: 'inline-block', animation: phase !== 'ready' ? 'pulse 1.2s infinite' : 'none' }} />
                        {phaseInfo.text}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={reOptimise}
                        disabled={phase !== 'ready'}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <RefreshCw size={14} /> Re-Optimise Now
                    </button>
                </div>
            </div>

            {/* Algorithm pipeline */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16,
                background: 'linear-gradient(135deg,rgba(15,118,110,0.06),rgba(26,50,99,0.06))',
                borderRadius: 12, padding: '12px 20px', border: '1px solid rgba(15,118,110,0.15)',
            }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginRight: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Algorithm</span>
                {ALG_STEPS.map((step, i) => {
                    const done = phase === 'ready' || algStep > i || algStep === -1
                    const active = phase === 'solving' && algStep === i
                    const Icon = step.icon
                    return (
                        <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
                                background: active ? '#0f766e' : done ? '#0f766e18' : '#f3f4f6',
                                color: active ? '#fff' : done ? '#0f766e' : '#6b7280',
                                border: `1.5px solid ${active ? '#0f766e' : done ? '#0f766e40' : '#e5e7eb'}`,
                                transition: 'all 0.25s', fontWeight: 600, fontSize: 12,
                                boxShadow: active ? '0 0 12px rgba(15,118,110,0.4)' : 'none',
                            }}>
                                <Icon size={14} />
                                <div>
                                    <div>{step.label}</div>
                                    <div style={{ fontSize: 10, fontWeight: 400, opacity: 0.8 }}>{step.sub}</div>
                                </div>
                            </div>
                            {i < 2 && <div style={{ width: 24, height: 2, background: done ? '#0f766e' : '#e5e7eb', margin: '0 2px', borderRadius: 2, transition: 'background 0.3s' }} />}
                        </div>
                    )
                })}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, fontSize: 13 }}>
                    {[
                        { label: 'Episode', value: episode || '—', color: '#6366f1' },
                        { label: 'Global Reward', value: reward !== '—' ? `${reward} pts` : '—', color: '#0f766e' },
                        { label: 'Convergence', value: convergence !== '—' ? `${convergence}%` : '—', color: '#f59e0b' },
                        { label: 'Avg Speed', value: avgSpeed !== '—' ? `${avgSpeed} km/h` : '—', color: '#3b82f6' },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
                            <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Convergence bar */}
            {pct > 0 && (
                <div style={{ marginBottom: 16, background: '#f3f4f6', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', width: `${pct}%`,
                        background: 'linear-gradient(90deg,#0f766e,#1a3263)',
                        borderRadius: 6, transition: 'width 0.6s ease',
                    }} />
                </div>
            )}

            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                <Filter size={13} style={{ color: 'var(--color-text-muted)' }} />
                {['all', 'active', 'idle'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
                {timestamp !== '—' && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>
                        Last optimised: {timestamp}
                    </span>
                )}
            </div>

            {/* Map + Side panels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>

                {/* Map */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-header" style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}>
                        <span className="card-title">Live Route Map — Coimbatore</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Radio size={10} style={{ color: '#10b981' }} />
                            DRL-computed routes via OSRM · TomTom traffic overlay
                        </span>
                    </div>
                    <div style={{ height: 480 }}>
                        <MapContainer center={[11.02, 76.97]} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Site markers */}
                            {filtered.map(s => (
                                <Marker key={s.id} position={[s.lat, s.lng]} icon={siteIcon(s.status)}>
                                    <Popup>
                                        <div style={{ minWidth: 160, fontFamily: 'Inter,sans-serif' }}>
                                            <strong>{s.name}</strong><br />
                                            <span style={{ fontSize: 12, color: '#555' }}>{s.type} · {s.demand}T demand</span><br />
                                            {s.truckColor !== '#6b7280' && (
                                                <span style={{ fontSize: 11, color: s.truckColor, fontWeight: 600 }}>● Assigned</span>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* DRL Route polylines (real OSRM roads) */}
                            {routes.map(r => {
                                const geom = routeGeometries[r.truck.id]
                                if (!geom || geom.length < 2) return null
                                return (
                                    <Polyline
                                        key={r.truck.id}
                                        positions={geom}
                                        pathOptions={{ color: r.color, weight: 4, opacity: 0.85, dashArray: '10,5' }}
                                    />
                                )
                            })}

                            {/* Traffic checkpoint markers */}
                            {trafficSpeeds.map(t => (
                                <Marker key={t.id} position={[t.lat, t.lng]} icon={trafficIcon(t.congestion)}>
                                    <Popup>
                                        <div style={{ fontSize: 12, fontFamily: 'Inter,sans-serif', minWidth: 140 }}>
                                            <strong>{t.name}</strong><br />
                                            <span style={{ color: congestionColor(t.congestion), fontWeight: 600 }}>
                                                {congestionLabel(t.congestion)}
                                            </span><br />
                                            {t.currentSpeed} km/h (free: {t.freeFlowSpeed} km/h)
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Right panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Truck route cards */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="card-header">
                            <span className="card-title">Optimised Routes</span>
                            <span style={{ fontSize: 11, color: '#9ca3af' }}>{routes.length} trucks</span>
                        </div>
                        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                            {phase !== 'ready' ? (
                                <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                                    {phaseInfo.text}…
                                </div>
                            ) : routes.map(r => (
                                <div key={r.truck.id} style={{
                                    padding: '12px 16px', borderBottom: '1px solid #f0f2f5',
                                    borderLeft: `3px solid ${r.color}`,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e' }}>{r.truck.plate}</span>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                                            background: r.color + '18', color: r.color,
                                        }}>{r.utilisation}% load</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#5a6478' }}>
                                        {r.truck.driver} · {r.totalLoad}T / {r.truck.capacity}T
                                    </div>
                                    <div style={{ fontSize: 11, color: '#5a6478', marginTop: 2 }}>
                                        🗺️ {r.assignedSites.map(s => s.id).join(' → ')}
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 11 }}>
                                        <span style={{ color: '#0f766e', fontWeight: 600 }}>ETA {r.eta}</span>
                                        <span style={{ color: '#9ca3af' }}>{Math.round(r.totalTimeSec / 60)} min</span>
                                        <span style={{ color: '#9ca3af' }}>{(r.totalDistM / 1000).toFixed(1)} km</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Traffic — redesigned as clean horizontal rows */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="card-header">
                            <span className="card-title">Live Traffic — Coimbatore</span>
                            <span style={{
                                fontSize: 11, background: '#e8f9f0', color: '#1a9c55',
                                padding: '3px 9px', borderRadius: 10, fontWeight: 700,
                            }}>TomTom</span>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                            {trafficSpeeds.length === 0 ? (
                                <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '12px 16px' }}>Loading…</div>
                            ) : trafficSpeeds.map(t => {
                                const barW = Math.round(t.congestion * 100)
                                const col = congestionColor(t.congestion)
                                const lbl = congestionLabel(t.congestion)
                                return (
                                    <div key={t.id} style={{ padding: '8px 16px', borderBottom: '1px solid #f5f6f8' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                                                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e' }}>{t.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 11.5, fontWeight: 700, color: col }}>{t.currentSpeed} km/h</span>
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 8,
                                                    background: col + '18', color: col, minWidth: 60, textAlign: 'center',
                                                }}>{lbl}</span>
                                            </div>
                                        </div>
                                        {/* Progress bar showing flow vs free-flow */}
                                        <div style={{ background: '#f0f2f5', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${barW}%`, background: col, borderRadius: 4, transition: 'width 0.5s ease' }} />
                                        </div>
                                        <div style={{ fontSize: 10, color: '#b0b8c8', marginTop: 3 }}>
                                            Free flow: {t.freeFlowSpeed} km/h · {barW}% of capacity
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Site list */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="card-header">
                            <span className="card-title">Sites ({filtered.length})</span>
                        </div>
                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                            {filtered.map(s => (
                                <div key={s.id} style={{ padding: '9px 16px', borderBottom: '1px solid #f5f6f8' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e' }}>{s.name}</div>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: s.truckColor }}>{s.id}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#8899aa', marginTop: 1 }}>{s.type} · {s.demand}T</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
      `}</style>
        </div>
    )
}
