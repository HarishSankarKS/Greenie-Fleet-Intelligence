import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Battery, Zap, AlertTriangle, Video, MapPin, Truck } from 'lucide-react';
import clsx from 'clsx';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom AI glowing line style for paths
const aiPathOptions = { color: '#10b981', weight: 4, opacity: 0.8, dashArray: '10, 10', className: 'animate-pulse' };
const standardPathOptions = { color: '#3b82f6', weight: 3, opacity: 0.6 };

const mockVehicles = [
    { id: 'V-001', lat: 13.0827, lng: 80.2707, status: 'active', aiMode: true, battery: 84, payload: '12t', type: 'Autonomous', speed: '45 km/h' },
    { id: 'V-014', lat: 13.06, lng: 80.24, status: 'maintenance', aiMode: false, battery: 12, payload: '0t', type: 'Human-Driven', speed: '0 km/h' },
    { id: 'V-042', lat: 13.1, lng: 80.29, status: 'idle', aiMode: true, battery: 98, payload: '2t', type: 'Autonomous', speed: '0 km/h' },
];

const mockRoute = [
    [13.0827, 80.2707],
    [13.085, 80.275],
    [13.09, 80.28],
    [13.1, 80.29] // Path from V-001 to V-042 area
];

const MonitoringMap = () => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)] w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Map Area */}
            <div className={clsx("bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden relative transition-all duration-300", selectedVehicle ? 'w-2/3' : 'w-full')}>

                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 z-[1000] flex gap-2">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Live Telemetry</span>
                    </div>
                </div>

                <MapContainer center={[13.0827, 80.2707]} zoom={12} className="h-full w-full z-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        className="map-tiles"
                    />
                    {/* Example AI Route Line */}
                    <Polyline pathOptions={aiPathOptions} positions={mockRoute} />

                    {mockVehicles.map(vehicle => (
                        <Marker
                            key={vehicle.id}
                            position={[vehicle.lat, vehicle.lng]}
                            eventHandlers={{
                                click: () => setSelectedVehicle(vehicle),
                            }}
                        >
                            <Popup className="rounded-xl">
                                <div className="font-semibold">{vehicle.id}</div>
                                <div className="text-xs text-emerald-600 font-bold">{vehicle.aiMode ? 'AI Pilot Active' : 'Manual'}</div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* AI Telemetry Sidebar */}
            {selectedVehicle && (
                <div className="w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex flex-col overflow-y-auto animate-in slide-in-from-right-8">
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Truck size={20} className="text-emerald-500" />
                                {selectedVehicle.id}
                            </h3>
                            <span className="text-sm text-slate-500">{selectedVehicle.type}</span>
                        </div>
                        <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
                    </div>

                    {/* Live Camera Feed (PiP) */}
                    <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 relative">
                        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[10px] px-2 py-1 rounded font-mono flex items-center gap-1 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                            LIVE CAM
                        </div>
                        <div className="absolute top-2 right-2 z-10 bg-emerald-500/90 text-white text-[10px] px-2 py-1 rounded font-bold">
                            CV: ACTIVE
                        </div>
                        <div className="h-40 flex items-center justify-center relative">
                            <Video size={32} className="text-slate-600 mb-2 absolute opacity-30" />
                            {/* Mock AI Bounding Box */}
                            <div className="absolute w-24 h-24 border-2 border-amber-400 rounded-sm top-8 left-12 flex flex-col justify-end">
                                <span className="bg-amber-400 text-black text-[9px] font-bold px-1 w-max">Concrete 89%</span>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                                <Battery size={16} className={selectedVehicle.battery < 20 ? 'text-rose-500' : 'text-emerald-500'} />
                                <span className="text-xs font-semibold uppercase">Battery</span>
                            </div>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedVehicle.battery}%</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                                <Zap size={16} className="text-amber-500" />
                                <span className="text-xs font-semibold uppercase">Speed</span>
                            </div>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedVehicle.speed}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 col-span-2">
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                    <MapPin size={16} />
                                    <span className="text-xs font-semibold uppercase">Payload Weight</span>
                                </div>
                                <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Target: 14t</span>
                            </div>
                            <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedVehicle.payload}</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex flex-col gap-2">
                        {selectedVehicle.aiMode && (
                            <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-rose-500/20">
                                <AlertTriangle size={18} />
                                TAKE OVERRIDE CONTROL
                            </button>
                        )}
                        <button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-3 rounded-xl transition-colors">
                            Dispatch Instructions
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonitoringMap;
