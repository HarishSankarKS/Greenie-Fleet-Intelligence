import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Truck, MapPin, RefreshCw, Clock, CheckCircle, AlertTriangle, Navigation } from 'lucide-react'

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Truck icon (moving vehicle dot with pulsing ring)
const truckIcon = (color) => L.divIcon({
    className: '',
    html: `<div style="position:relative">
        <div style="width:16px;height:16px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;z-index:2"></div>
        <div style="position:absolute;top:-4px;left:-4px;width:24px;height:24px;border-radius:50%;border:2px solid ${color};opacity:0.4;animation:pulse 2s infinite"></div>
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -14],
})

// Site icon (pin marker)
const siteIcon = (color) => L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:3px;background:${color};border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,0.2);transform:rotate(45deg)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -10],
})

// Mock data: Collection sites
const sites = [
    { id: 'S-01', name: 'Anna Nagar Collection Point', lat: 13.0850, lng: 80.2101, status: 'collected', time: '09:42 AM' },
    { id: 'S-02', name: 'Adyar Transit Hub', lat: 13.0012, lng: 80.2565, status: 'collected', time: '10:15 AM' },
    { id: 'S-03', name: 'T. Nagar Market Site', lat: 13.0418, lng: 80.2341, status: 'in-progress', time: '11:00 AM' },
    { id: 'S-04', name: 'Velachery Depot', lat: 12.9815, lng: 80.2180, status: 'scheduled', time: '11:30 AM' },
    { id: 'S-05', name: 'Tambaram Zone B', lat: 12.9249, lng: 80.1000, status: 'missed', time: '08:20 AM' },
    { id: 'S-06', name: 'Porur Industrial Area', lat: 13.0382, lng: 80.1564, status: 'scheduled', time: '12:15 PM' },
    { id: 'S-07', name: 'Guindy Transfer Station', lat: 13.0067, lng: 80.2206, status: 'collected', time: '08:55 AM' },
    { id: 'S-08', name: 'Perambur Sorting Yard', lat: 13.1143, lng: 80.2423, status: 'scheduled', time: '01:30 PM' },
]

// Mock data: Trucks with live GPS positions
const initialTrucks = [
    { id: 'TK-101', plate: 'TN 09 AB 1234', driver: 'Rajan K.', lat: 13.0620, lng: 80.2350, speed: 32, heading: 'SE', load: '4.2 T', status: 'active', dest: 'T. Nagar Market Site' },
    { id: 'TK-102', plate: 'TN 09 CD 5678', driver: 'Murugan S.', lat: 13.0190, lng: 80.2400, speed: 0, heading: '—', load: '6.8 T', status: 'loading', dest: 'Adyar Transit Hub' },
    { id: 'TK-103', plate: 'TN 09 EF 9012', driver: 'Selvam R.', lat: 13.0500, lng: 80.1900, speed: 45, heading: 'NE', load: '1.5 T', dest: 'Porur Industrial Area', status: 'active' },
    { id: 'TK-104', plate: 'TN 09 GH 3456', driver: 'Karthik P.', lat: 12.9600, lng: 80.1500, speed: 28, heading: 'N', load: '0 T', status: 'returning', dest: 'Base Depot' },
    { id: 'TK-105', plate: 'TN 09 IJ 7890', driver: 'Unassigned', lat: 13.1000, lng: 80.2600, speed: 0, heading: '—', load: '0 T', status: 'idle', dest: '—' },
]

const siteColors = {
    collected: '#10b981',
    'in-progress': '#f59e0b',
    scheduled: '#6b7280',
    missed: '#ef4444',
}
const truckColors = {
    active: '#1a3263',
    loading: '#f59e0b',
    returning: '#7c3aed',
    idle: '#9ca3af',
}
const siteLabels = { collected: 'Collected', 'in-progress': 'In Progress', scheduled: 'Scheduled', missed: 'Missed' }
const truckLabels = { active: 'En Route', loading: 'Loading', returning: 'Returning', idle: 'Idle' }

export default function ClientLiveMap() {
    const [trucks, setTrucks] = useState(initialTrucks)
    const [selectedTruck, setSelectedTruck] = useState(null)
    const [siteFilter, setSiteFilter] = useState('all')
    const [countdown, setCountdown] = useState(60)
    const [lastRefresh, setLastRefresh] = useState(new Date())

    // Simulate truck movement every 5 seconds
    useEffect(() => {
        const iv = setInterval(() => {
            setTrucks(prev => prev.map(t => {
                if (t.speed === 0) return t
                const jitter = () => (Math.random() - 0.5) * 0.003
                return { ...t, lat: t.lat + jitter(), lng: t.lng + jitter() }
            }))
        }, 5000)
        return () => clearInterval(iv)
    }, [])

    // Countdown timer
    useEffect(() => {
        const iv = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) { setLastRefresh(new Date()); return 60 }
                return c - 1
            })
        }, 1000)
        return () => clearInterval(iv)
    }, [])

    const filteredSites = siteFilter === 'all' ? sites : sites.filter(s => s.status === siteFilter)
    const siteCounts = {
        all: sites.length,
        collected: sites.filter(s => s.status === 'collected').length,
        'in-progress': sites.filter(s => s.status === 'in-progress').length,
        scheduled: sites.filter(s => s.status === 'scheduled').length,
        missed: sites.filter(s => s.status === 'missed').length,
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Live Collection Map</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>
                        Real-time truck positions and site collection status
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                        background: '#e8f9f0', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#1a9c55',
                    }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a9c55', animation: 'pulse 1.5s infinite' }} />
                        LIVE
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                        background: '#f0f2f5', borderRadius: 20, fontSize: 12, color: '#5a6478',
                    }}>
                        <RefreshCw size={11} /> Refresh in {countdown}s
                    </div>
                </div>
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {Object.entries(siteCounts).map(([key, count]) => (
                    <button
                        key={key}
                        onClick={() => setSiteFilter(key)}
                        style={{
                            padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                            cursor: 'pointer', border: '1.5px solid',
                            background: siteFilter === key ? (key === 'all' ? '#1a3263' : siteColors[key] || '#1a3263') : '#fff',
                            color: siteFilter === key ? '#fff' : '#5a6478',
                            borderColor: siteFilter === key ? 'transparent' : '#dce1ea',
                            transition: 'all 0.15s',
                        }}
                    >
                        {key === 'all' ? 'All Sites' : siteLabels[key]} ({count})
                    </button>
                ))}
            </div>

            {/* Main grid: Map + Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

                {/* Map */}
                <div style={{
                    background: '#fff', borderRadius: 12, overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0',
                }}>
                    <div style={{ height: 520 }}>
                        <MapContainer center={[13.04, 80.21]} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Site markers */}
                            {filteredSites.map(s => (
                                <Marker key={s.id} position={[s.lat, s.lng]} icon={siteIcon(siteColors[s.status])}>
                                    <Popup>
                                        <div style={{ minWidth: 160, fontFamily: 'Inter, sans-serif' }}>
                                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.name}</div>
                                            <div style={{ fontSize: 12, color: '#5a6478' }}>Status: <span style={{ color: siteColors[s.status], fontWeight: 600 }}>{siteLabels[s.status]}</span></div>
                                            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 2 }}>Scheduled: {s.time}</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Truck markers */}
                            {trucks.map(t => (
                                <Marker
                                    key={t.id}
                                    position={[t.lat, t.lng]}
                                    icon={truckIcon(truckColors[t.status])}
                                    eventHandlers={{ click: () => setSelectedTruck(t) }}
                                >
                                    <Popup>
                                        <div style={{ minWidth: 180, fontFamily: 'Inter, sans-serif' }}>
                                            <div style={{ fontWeight: 700, fontSize: 13 }}>🚛 {t.plate}</div>
                                            <div style={{ fontSize: 12, color: '#5a6478', marginTop: 2 }}>Driver: {t.driver}</div>
                                            <div style={{ fontSize: 12, color: '#5a6478' }}>Load: {t.load} · {t.speed} km/h</div>
                                            <div style={{
                                                marginTop: 4, fontSize: 11, fontWeight: 600, padding: '2px 8px',
                                                borderRadius: 10, display: 'inline-block',
                                                background: truckColors[t.status] + '18', color: truckColors[t.status],
                                            }}>{truckLabels[t.status]}</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Side Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Truck list */}
                    <div style={{
                        background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #e5e9f0', overflow: 'hidden',
                    }}>
                        <div style={{
                            padding: '12px 16px', borderBottom: '1px solid #e5e9f0',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ fontWeight: 700, fontSize: 13.5, color: '#1a1a2e' }}>
                                <Truck size={13} style={{ marginRight: 6, verticalAlign: '-1px' }} />
                                Trucks ({trucks.length})
                            </span>
                            <span style={{ fontSize: 11, color: '#5a6478' }}>
                                {trucks.filter(t => t.status === 'active').length} en route
                            </span>
                        </div>
                        <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                            {trucks.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTruck(t)}
                                    style={{
                                        padding: '10px 16px', borderBottom: '1px solid #f0f2f5',
                                        cursor: 'pointer', transition: 'background 0.12s',
                                        background: selectedTruck?.id === t.id ? 'rgba(26,50,99,0.05)' : 'transparent',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,50,99,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = selectedTruck?.id === t.id ? 'rgba(26,50,99,0.05)' : 'transparent'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e' }}>{t.plate}</div>
                                            <div style={{ fontSize: 11, color: '#5a6478', marginTop: 1 }}>{t.driver}</div>
                                        </div>
                                        <span style={{
                                            fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                                            background: truckColors[t.status] + '15', color: truckColors[t.status],
                                        }}>{truckLabels[t.status]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected truck detail */}
                    {selectedTruck && (
                        <div style={{
                            background: '#fff', borderRadius: 12, padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0',
                        }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
                                🚛 {selectedTruck.plate}
                            </div>
                            {[
                                { label: 'Driver', value: selectedTruck.driver },
                                { label: 'Speed', value: `${selectedTruck.speed} km/h ${selectedTruck.heading}` },
                                { label: 'Load', value: selectedTruck.load },
                                { label: 'Destination', value: selectedTruck.dest },
                                { label: 'Status', value: truckLabels[selectedTruck.status] },
                            ].map(({ label, value }) => (
                                <div key={label} style={{
                                    display: 'flex', justifyContent: 'space-between', padding: '5px 0',
                                    borderBottom: '1px solid #f5f6f8', fontSize: 12.5,
                                }}>
                                    <span style={{ color: '#5a6478' }}>{label}</span>
                                    <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Legend */}
                    <div style={{
                        background: '#fff', borderRadius: 12, padding: '14px 16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e9f0',
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Map Legend</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                            {Object.entries(siteColors).map(([key, color]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: color, transform: 'rotate(45deg)' }} />
                                    <span style={{ color: '#5a6478' }}>{siteLabels[key]}</span>
                                </div>
                            ))}
                            <div style={{ gridColumn: '1/-1', borderTop: '1px solid #f0f2f5', paddingTop: 6, marginTop: 4 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#8899aa', marginBottom: 4 }}>TRUCKS</div>
                            </div>
                            {Object.entries(truckColors).map(([key, color]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                    <span style={{ color: '#5a6478' }}>{truckLabels[key]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inject pulse animation */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    )
}
