import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Activity, Clock, AlertTriangle, Filter } from 'lucide-react'

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const makeIcon = (color) => L.divIcon({
    className: '',
    html: `<div style="
    width:22px;height:22px;border-radius:50%;background:${color};
    border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);
    transition:transform 0.2s
  "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -15],
})

const icons = {
    active: makeIcon('#10b981'),
    idle: makeIcon('#f59e0b'),
    maintenance: makeIcon('#ef4444'),
}

const sites = [
    { id: 'CS-001', name: 'Chennai Central Hub', lat: 13.0827, lng: 80.2707, status: 'active', type: 'C&D Waste', lastUpdate: '5 min ago' },
    { id: 'CS-002', name: 'Coimbatore North Depot', lat: 11.0168, lng: 76.9558, status: 'active', type: 'Mixed Debris', lastUpdate: '12 min ago' },
    { id: 'CS-003', name: 'Madurai South Site', lat: 9.9252, lng: 78.1198, status: 'idle', type: 'Concrete Rubble', lastUpdate: '1 hr ago' },
    { id: 'CS-004', name: 'Salem Industrial Hub', lat: 11.6643, lng: 78.1460, status: 'active', type: 'C&D Waste', lastUpdate: '2 min ago' },
    { id: 'CS-005', name: 'Trichy West Base', lat: 10.7905, lng: 78.7047, status: 'maintenance', type: 'Mixed Waste', lastUpdate: '3 hr ago' },
    { id: 'CS-006', name: 'Tirunelveli Gateway', lat: 8.7139, lng: 77.7567, status: 'active', type: 'C&D Waste', lastUpdate: '8 min ago' },
    { id: 'CS-007', name: 'Vellore Depot', lat: 12.9165, lng: 79.1325, status: 'idle', type: 'C&D Waste', lastUpdate: '45 min ago' },
    { id: 'CS-008', name: 'Erode Collection Site', lat: 11.3410, lng: 77.7172, status: 'active', type: 'Rubble', lastUpdate: '18 min ago' },
]

export default function Monitoring() {
    const [filter, setFilter] = useState('all')
    const [selected, setSelected] = useState(null)
    const filtered = filter === 'all' ? sites : sites.filter(s => s.status === filter)

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Monitoring / Map</div>
                    <div className="page-subtitle">Live status of all collection sites — {sites.length} sites tracked</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
                    {['all', 'active', 'idle', 'maintenance'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Legend */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {[
                    { label: 'Active', color: '#10b981', icon: Activity, count: sites.filter(s => s.status === 'active').length },
                    { label: 'Idle', color: '#f59e0b', icon: Clock, count: sites.filter(s => s.status === 'idle').length },
                    { label: 'Maintenance', color: '#ef4444', icon: AlertTriangle, count: sites.filter(s => s.status === 'maintenance').length },
                ].map(({ label, color, icon: Icon, count }) => (
                    <div key={label} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                        background: '#fff', borderRadius: 8, border: '1px solid var(--color-border)',
                        fontSize: 13, fontWeight: 500
                    }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                        <Icon size={13} style={{ color }} />
                        <span>{label}</span>
                        <strong style={{ marginLeft: 4 }}>{count}</strong>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                {/* Map */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 500 }}>
                    <div className="card-header" style={{ borderRadius: 'var(--radius) var(--radius) 0 0' }}>
                        <span className="card-title">Live Site Map</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginRight: 5, animation: 'pulse 1.5s infinite' }} />
                            Live feed · auto-refresh every 30s
                        </span>
                    </div>
                    <div style={{ height: 480 }}>
                        <MapContainer
                            center={[11.1, 78.6]}
                            zoom={7}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {filtered.map(site => (
                                <Marker key={site.id} position={[site.lat, site.lng]} icon={icons[site.status]}
                                    eventHandlers={{ click: () => setSelected(site) }}>
                                    <Popup>
                                        <div style={{ minWidth: 160 }}>
                                            <strong>{site.name}</strong><br />
                                            <span style={{ fontSize: 12 }}>{site.type}</span><br />
                                            <span className={`status-badge ${site.status}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                                                <span className="dot" />{site.status}
                                            </span><br />
                                            <span style={{ fontSize: 11, color: '#6b7280', marginTop: 4, display: 'block' }}>Updated {site.lastUpdate}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Site List Panel */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', maxHeight: 560, overflow: 'hidden' }}>
                    <div className="card-header">
                        <span className="card-title">Sites ({filtered.length})</span>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                        {filtered.map(site => (
                            <div
                                key={site.id}
                                onClick={() => setSelected(site)}
                                style={{
                                    padding: '12px 20px',
                                    borderBottom: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    background: selected?.id === site.id ? 'rgba(15,118,110,0.06)' : 'transparent',
                                    transition: 'background 0.15s',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>{site.name}</div>
                                        <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>{site.id} · {site.type}</div>
                                    </div>
                                    <span className={`status-badge ${site.status}`} style={{ fontSize: 11 }}>
                                        <span className="dot" />{site.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Updated {site.lastUpdate}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
