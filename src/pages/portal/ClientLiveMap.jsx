import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Truck, RefreshCw, Brain, Navigation, Zap } from 'lucide-react'
import { useDRLRoutes, SITES, TRUCKS, TRUCK_COLORS } from '../../utils/drlCVRP'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const truckMarker = (color) => L.divIcon({
    className: '',
    html: `<div style="position:relative">
    <div style="width:16px;height:16px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);z-index:2;position:relative"></div>
    <div style="position:absolute;top:-5px;left:-5px;width:26px;height:26px;border-radius:50%;border:2px solid ${color};opacity:0.35;animation:ripple 2s infinite"></div>
  </div>`,
    iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -14],
})

const siteMarker = (status) => {
    const colors = { collected: '#10b981', 'in-progress': '#f59e0b', scheduled: '#6b7280', missed: '#ef4444' }
    const c = colors[status] || '#6b7280'
    return L.divIcon({
        className: '',
        html: `<div style="width:11px;height:11px;border-radius:2px;background:${c};border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.25);transform:rotate(45deg)"></div>`,
        iconSize: [11, 11], iconAnchor: [5, 5], popupAnchor: [0, -10],
    })
}

const siteColors = { collected: '#10b981', 'in-progress': '#f59e0b', scheduled: '#6b7280', missed: '#ef4444' }
const siteLabels = { collected: 'Collected', 'in-progress': 'In Progress', scheduled: 'Scheduled', missed: 'Missed' }
const truckLabels = { active: 'En Route', idle: 'Idle', loading: 'Loading', returning: 'Returning' }

// Interpolate truck position along route geometry
function interpolate(geom, progress) {
    if (!geom || geom.length < 2) return null
    const maxIdx = geom.length - 1
    const raw = progress * maxIdx
    const i = Math.min(Math.floor(raw), maxIdx - 1)
    const t = raw - i
    const [la1, lo1] = geom[i], [la2, lo2] = geom[i + 1]
    return [la1 + (la2 - la1) * t, lo1 + (lo2 - lo1) * t]
}

const congColor = (c) => c >= 0.8 ? '#10b981' : c >= 0.5 ? '#f59e0b' : '#ef4444'

export default function ClientLiveMap() {
    const { phase, routes, routeGeometries, trafficSpeeds, episode, reward, convergence, timestamp, reOptimise } = useDRLRoutes()
    const [progress, setProgress] = useState({})
    const [siteFilter, setSiteFilter] = useState('all')
    const [selectedTruck, setSelectedTruck] = useState(null)
    const [countdown, setCountdown] = useState(120)

    // Advance truck positions along routes
    useEffect(() => {
        const iv = setInterval(() => {
            setProgress(prev => {
                const next = { ...prev }
                routes.forEach(r => {
                    const p = (prev[r.truck.id] ?? 0) + 0.0025
                    next[r.truck.id] = p >= 1 ? 0 : p
                })
                return next
            })
        }, 400)
        return () => clearInterval(iv)
    }, [routes])

    // Reset truck progress on new routes
    useEffect(() => { if (routes.length) setProgress({}) }, [routes])

    // Countdown timer
    useEffect(() => {
        const iv = setInterval(() => setCountdown(c => c <= 1 ? 120 : c - 1), 1000)
        return () => clearInterval(iv)
    }, [])

    // Map sites with status (based on route assignment)
    const enrichedSites = SITES.map((s, i) => {
        const route = routes.find(r => r.assignedSites.some(a => a.id === s.id))
        const order = route ? route.assignedSites.findIndex(a => a.id === s.id) : -1
        const p = route ? (progress[route.truck.id] ?? 0) : 0
        const assignedCount = route?.assignedSites.length ?? 1
        const siteProgress = order / Math.max(assignedCount, 1)
        let status = 'scheduled'
        if (route) status = p > siteProgress + 0.05 ? 'collected' : p > siteProgress - 0.05 ? 'in-progress' : 'scheduled'
        return { ...s, status, routeColor: route?.color }
    })
    const filtered = siteFilter === 'all' ? enrichedSites : enrichedSites.filter(s => s.status === siteFilter)
    const siteCounts = ['all', 'collected', 'in-progress', 'scheduled', 'missed']
        .reduce((acc, k) => ({ ...acc, [k]: k === 'all' ? enrichedSites.length : enrichedSites.filter(s => s.status === k).length }), {})

    const phaseReady = phase === 'ready'

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>
                        Live Collection Map — Coimbatore
                    </h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>
                        AI-optimised truck routes with live TomTom traffic · OSRM road geometry
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* AI badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                        background: 'linear-gradient(135deg,#0f766e,#1a3263)', borderRadius: 20,
                        fontSize: 12, fontWeight: 700, color: '#fff',
                    }}>
                        <Brain size={12} /> 🤖 AI Optimised
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                        background: '#e8f9f0', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#1a9c55',
                    }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a9c55', animation: 'ripple 1.5s infinite' }} />
                        LIVE
                    </div>
                    <div style={{ padding: '6px 12px', background: '#f0f2f5', borderRadius: 20, fontSize: 12, color: '#5a6478', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <RefreshCw size={10} /> {countdown}s
                    </div>
                </div>
            </div>

            {/* DRL Engine status bar */}
            <div style={{
                display: 'flex', gap: 20, alignItems: 'center', marginBottom: 14, padding: '10px 18px',
                background: 'linear-gradient(135deg,rgba(15,118,110,0.07),rgba(26,50,99,0.07))',
                borderRadius: 10, border: '1px solid rgba(15,118,110,0.18)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: phaseReady ? '#0f766e' : '#f59e0b' }}>
                    <Zap size={13} />
                    {phaseReady ? 'Routes Optimised' : phase.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + '…'}
                </div>
                {[
                    { label: 'Episode', value: episode || '—', color: '#6366f1' },
                    { label: 'Reward', value: reward !== '—' ? `${reward} pts` : '—', color: '#0f766e' },
                    { label: 'Convergence', value: convergence !== '—' ? `${convergence}%` : '—', color: '#f59e0b' },
                    { label: 'Updated', value: timestamp, color: '#6b7280' },
                ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color }}>{value}</div>
                        <div style={{ fontSize: 9.5, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                    </div>
                ))}
                <div style={{
                    marginLeft: 'auto', padding: '5px 14px', borderRadius: 8,
                    background: phaseReady ? '#e8f9f0' : '#f5f5f5',
                    color: phaseReady ? '#1a9c55' : '#9ca3af',
                    fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                }}>
                    <RefreshCw size={10} /> Auto-refreshes every 2 min
                </div>
            </div>

            {/* Site filter chips */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {Object.entries(siteCounts).map(([key, count]) => (
                    <button key={key} onClick={() => setSiteFilter(key)} style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                        cursor: 'pointer', border: '1.5px solid',
                        background: siteFilter === key ? (key === 'all' ? '#1a3263' : siteColors[key] || '#1a3263') : '#fff',
                        color: siteFilter === key ? '#fff' : '#5a6478',
                        borderColor: siteFilter === key ? 'transparent' : '#dce1ea',
                    }}>
                        {key === 'all' ? 'All Sites' : siteLabels[key]} ({count})
                    </button>
                ))}
            </div>

            {/* Map + Side panel grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 14 }}>

                {/* Map */}
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e5e9f0' }}>
                    <div style={{ height: 540 }}>
                        <MapContainer center={[11.02, 76.97]} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Site markers */}
                            {filtered.map(s => (
                                <Marker key={s.id} position={[s.lat, s.lng]} icon={siteMarker(s.status)}>
                                    <Popup>
                                        <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 160 }}>
                                            <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                                            <div style={{ fontSize: 12, color: '#5a6478', marginTop: 2 }}>
                                                Status: <span style={{ color: siteColors[s.status], fontWeight: 600 }}>{siteLabels[s.status]}</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.type} · {s.demand}T demand</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* DRL route polylines (real OSRM geometry) */}
                            {routes.map(r => {
                                const geom = routeGeometries[r.truck.id]
                                if (!geom || geom.length < 2) return null
                                return (
                                    <Polyline
                                        key={r.truck.id}
                                        positions={geom}
                                        pathOptions={{ color: r.color, weight: 3.5, opacity: 0.8, dashArray: '8,5' }}
                                    />
                                )
                            })}

                            {/* Animated truck markers along routes */}
                            {routes.map(r => {
                                const geom = routeGeometries[r.truck.id]
                                const pos = interpolate(geom, progress[r.truck.id] ?? 0)
                                if (!pos) return null
                                return (
                                    <Marker
                                        key={r.truck.id}
                                        position={pos}
                                        icon={truckMarker(r.color)}
                                        eventHandlers={{ click: () => setSelectedTruck(r) }}
                                    >
                                        <Popup>
                                            <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 180 }}>
                                                <div style={{ fontWeight: 700, fontSize: 13 }}>🚛 {r.truck.plate}</div>
                                                <div style={{ fontSize: 12, color: '#5a6478', marginTop: 2 }}>
                                                    Driver: {r.truck.driver}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#5a6478' }}>
                                                    Load: {r.totalLoad}T / {r.truck.capacity}T
                                                </div>
                                                <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: r.color }}>
                                                    🤖 AI-optimised route · ETA {r.eta}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </MapContainer>
                    </div>
                </div>

                {/* Side panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Truck ETAs */}
                    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0', overflow: 'hidden' }}>
                        <div style={{ padding: '11px 16px', borderBottom: '1px solid #e5e9f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Truck size={13} /> Fleet ETA
                            </span>
                            <span style={{
                                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                                background: 'linear-gradient(135deg,#0f766e,#1a3263)', color: '#fff',
                            }}>🤖 AI</span>
                        </div>
                        <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                            {!phaseReady ? (
                                <div style={{ padding: 16, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                                    Computing routes…
                                </div>
                            ) : routes.map(r => (
                                <div
                                    key={r.truck.id}
                                    onClick={() => setSelectedTruck(r)}
                                    style={{
                                        padding: '11px 16px', borderBottom: '1px solid #f5f6f8', cursor: 'pointer',
                                        background: selectedTruck?.truck.id === r.truck.id ? r.color + '0d' : 'transparent',
                                        borderLeft: `3px solid ${r.color}`, transition: 'background 0.12s',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>{r.truck.plate}</div>
                                            <div style={{ fontSize: 11, color: '#5a6478' }}>{r.truck.driver}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: r.color }}>ETA {r.eta}</div>
                                            <div style={{ fontSize: 10, color: '#9ca3af' }}>{r.assignedSites.length} stops</div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 5, background: '#f5f6f8', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(progress[r.truck.id] ?? 0) * 100}%`, background: r.color, borderRadius: 4, transition: 'width 0.4s ease' }} />
                                    </div>
                                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
                                        {r.utilisation}% capacity · {Math.round(r.totalTimeSec / 60)} min route
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected truck detail */}
                    {selectedTruck && (
                        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: `1px solid ${selectedTruck.color}30` }}>
                            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#1a1a2e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                🚛 {selectedTruck.truck.plate}
                                <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: selectedTruck.color + '18', color: selectedTruck.color }}>
                                    {truckLabels[selectedTruck.truck.status]}
                                </span>
                            </div>
                            {[
                                { label: 'Driver', value: selectedTruck.truck.driver },
                                { label: 'Capacity', value: `${selectedTruck.totalLoad}T / ${selectedTruck.truck.capacity}T (${selectedTruck.utilisation}%)` },
                                { label: 'Route', value: selectedTruck.assignedSites.map(s => s.id).join(' → ') || '—' },
                                { label: 'ETA', value: selectedTruck.eta },
                                { label: 'Distance', value: `${(selectedTruck.totalDistM / 1000).toFixed(1)} km` },
                                { label: 'Route Score', value: `${selectedTruck.reward} pts` },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f6f8', fontSize: 12 }}>
                                    <span style={{ color: '#5a6478' }}>{label}</span>
                                    <span style={{ color: '#1a1a2e', fontWeight: 600, maxWidth: 160, textAlign: 'right', fontSize: 11 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Traffic panel */}
                    <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Navigation size={12} /> Live Traffic
                            <span style={{ marginLeft: 'auto', fontSize: 10, color: '#10b981', fontWeight: 700 }}>TomTom</span>
                        </div>
                        {trafficSpeeds.length === 0 ? (
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>Fetching…</div>
                        ) : trafficSpeeds.map(t => (
                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid #f5f6f8', fontSize: 11.5 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: congColor(t.congestion), flexShrink: 0 }} />
                                <span style={{ flex: 1, color: '#5a6478' }}>{t.name}</span>
                                <span style={{ fontWeight: 700, color: congColor(t.congestion) }}>{t.currentSpeed} km/h</span>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Map Legend</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 10px' }}>
                            {Object.entries(siteColors).map(([k, c]) => (
                                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                                    <div style={{ width: 7, height: 7, background: c, borderRadius: 1.5, transform: 'rotate(45deg)', flexShrink: 0 }} />
                                    <span style={{ color: '#5a6478' }}>{siteLabels[k]}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px solid #f0f2f5', marginTop: 7, paddingTop: 7 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 5 }}>TRUCKS (DRL Routes)</div>
                            {TRUCKS.map((t, i) => (
                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, marginBottom: 3 }}>
                                    <div style={{ width: 18, height: 3, background: TRUCK_COLORS[i], borderRadius: 2 }} />
                                    <span style={{ color: '#5a6478' }}>{t.plate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
        </div>
    )
}
