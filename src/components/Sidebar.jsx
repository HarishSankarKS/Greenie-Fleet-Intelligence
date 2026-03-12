import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, MapPin, Map, BarChart3, Truck, Users,
    Wrench, Settings, ShoppingBag
} from 'lucide-react'

const navItems = [
    {
        group: 'Main', items: [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/collection-sites', icon: MapPin, label: 'Collection Sites' },
            { to: '/monitoring', icon: Map, label: 'Monitoring / Map' },
            { to: '/analytics', icon: BarChart3, label: 'Analytics / Reports' },
        ]
    },
    {
        group: 'Fleet', items: [
            { to: '/vehicles', icon: Truck, label: 'Vehicles' },
            { to: '/drivers', icon: Users, label: 'Drivers' },
            { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
        ]
    },
    {
        group: 'Commerce', items: [
            { to: '/marketplace', icon: ShoppingBag, label: 'Waste Marketplace' },
        ]
    },
    {
        group: 'Account', items: [
            { to: '/settings', icon: Settings, label: 'Settings' },
        ]
    },
]

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <img
                        src="/Fleetmanagement/greenie-logo.png"
                        alt="GREENIE"
                        style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }}
                    />
                </div>
                <div className="sidebar-brand-text">
                    <span className="sidebar-brand-name">Smart C&D Waste</span>
                    <span className="sidebar-brand-sub">Monitoring System</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((group) => (
                    <div className="sidebar-section" key={group.group}>
                        <div className="sidebar-section-label">{group.group}</div>
                        {group.items.map(({ to, icon: Icon, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={16} className="nav-icon" />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 4,
                        background: 'var(--color-primary-dark)',
                        border: '2px solid var(--color-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 12, fontWeight: 700
                    }}>AD</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Fleet Admin</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>admin@greenie.ac.in</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
