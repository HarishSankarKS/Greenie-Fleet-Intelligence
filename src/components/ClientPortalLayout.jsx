import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Map, FileText, BarChart2, CreditCard, AlertCircle, User, LogOut, ChevronDown, Bell, Leaf, PackagePlus } from 'lucide-react'
import { useState } from 'react'

const NAV = [
    { to: '/portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/portal/map', icon: Map, label: 'Live Map' },
    { to: '/portal/activity', icon: FileText, label: 'Activity Log' },
    { to: '/portal/sla', icon: BarChart2, label: 'SLA Reports' },
    { to: '/portal/billing', icon: CreditCard, label: 'Billing' },
    { to: '/portal/complaints', icon: AlertCircle, label: 'Complaints' },
    { to: '/portal/notifications', icon: Bell, label: 'Notifications' },
    { to: '/portal/epr', icon: Leaf, label: 'EPR Scorecard' },
    { to: '/portal/request', icon: PackagePlus, label: 'Request Pickup' },
    { to: '/portal/profile', icon: User, label: 'Profile' },
]

export default function ClientPortalLayout({ children }) {
    const navigate = useNavigate()
    const [orgOpen, setOrgOpen] = useState(false)

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f0f4f8', fontFamily: "'Inter', sans-serif" }}>

            {/* Sidebar */}
            <aside style={{
                width: 232, background: '#0f2544', display: 'flex', flexDirection: 'column',
                boxShadow: '2px 0 12px rgba(0,0,0,0.18)', flexShrink: 0,
            }}>
                {/* Logo */}
                <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src="/Fleetmanagement/greenie-logo.png" alt="GREENIE" style={{
                            width: 34, height: 34, borderRadius: 8, objectFit: 'contain',
                        }} />
                        <div>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>GREENIE</div>
                            <div style={{ color: '#c8a951', fontSize: 10, fontWeight: 600, letterSpacing: 1 }}>CLIENT PORTAL</div>
                        </div>
                    </div>
                </div>

                {/* Org switcher */}
                <button
                    onClick={() => setOrgOpen(o => !o)}
                    style={{
                        margin: '12px 12px 4px', padding: '10px 12px',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 6, background: '#c8a951',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0f2544', fontWeight: 800, fontSize: 11, flexShrink: 0,
                    }}>AB</div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>Acme Builders</div>
                        <div style={{ color: '#8899aa', fontSize: 10 }}>Project Manager</div>
                    </div>
                    <ChevronDown size={13} color="#8899aa" style={{ transform: orgOpen ? 'rotate(180deg)' : 'none', transition: '0.15s' }} />
                </button>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto' }}>
                    {NAV.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to} to={to}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 12px', borderRadius: 8, marginBottom: 2,
                                textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
                                color: isActive ? '#fff' : '#8899bb',
                                background: isActive ? 'rgba(200,169,81,0.18)' : 'transparent',
                                borderLeft: isActive ? '3px solid #c8a951' : '3px solid transparent',
                                transition: 'all 0.15s',
                            })}
                        >
                            <Icon size={15} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Sign out */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%', padding: '9px 12px', borderRadius: 8,
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#ff6b6b', fontSize: 13.5, fontWeight: 500,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Top bar */}
                <header style={{
                    background: '#fff', borderBottom: '1px solid #e5e9f0',
                    padding: '0 28px', height: 56,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)', flexShrink: 0,
                }}>
                    <div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Acme Builders Pvt. Ltd.</span>
                        <span style={{
                            marginLeft: 10, fontSize: 11, fontWeight: 600, padding: '2px 8px',
                            borderRadius: 20, background: '#e8f5ee', color: '#1a9c55',
                        }}>● Active Subscription</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: '#5a6478' }}>Plan renews: <b>31 Mar 2027</b></span>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#1a3263',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#c8a951', fontWeight: 700, fontSize: 12,
                        }}>MO</div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
                    {children}
                </main>
            </div>
        </div>
    )
}
