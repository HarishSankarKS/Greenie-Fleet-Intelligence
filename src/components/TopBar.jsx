import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, RefreshCw, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const titles = {
    '/dashboard': { title: 'Dashboard', sub: 'Overview · Real-time monitoring' },
    '/collection-sites': { title: 'Collection Sites', sub: 'Manage waste collection points' },
    '/monitoring': { title: 'Monitoring / Map', sub: 'Live tracking · Site status' },
    '/analytics': { title: 'Analytics & Reports', sub: 'Performance insights · Data export' },
    '/vehicles': { title: 'Vehicles', sub: 'Fleet management · Vehicle registry' },
    '/drivers': { title: 'Drivers', sub: 'Driver management · Assignments' },
    '/maintenance': { title: 'Maintenance', sub: 'Schedules · Cost tracking' },
    '/subscriptions': { title: 'Subscriptions', sub: 'Plans · Billing · Access' },
    '/settings': { title: 'Settings', sub: 'System configuration · Preferences' },
}

export default function TopBar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const meta = titles[pathname] || { title: 'Smart C&D Waste', sub: 'Monitoring System' }
    const [search, setSearch] = useState('')
    const [dropOpen, setDropOpen] = useState(false)
    const dropRef = useRef(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="topbar">
            <div className="topbar-left">
                <span className="topbar-title">{meta.title}</span>
                <span className="topbar-breadcrumb">{meta.sub}</span>
            </div>
            <div className="topbar-right">
                <div className="search-bar">
                    <Search size={14} className="search-icon" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search anything..."
                    />
                </div>
                <button className="icon-btn" title="Refresh">
                    <RefreshCw size={15} />
                </button>
                <button className="icon-btn" title="Notifications">
                    <Bell size={15} />
                    <span className="badge">3</span>
                </button>

                {/* Avatar + Dropdown */}
                <div ref={dropRef} style={{ position: 'relative' }}>
                    <div
                        className="avatar"
                        title="Fleet Admin"
                        onClick={() => setDropOpen(o => !o)}
                        style={{
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: 4, width: 'auto', padding: '0 10px',
                        }}
                    >
                        AD
                        <ChevronDown
                            size={11}
                            style={{
                                opacity: 0.7, transition: 'transform 0.18s',
                                transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                        />
                    </div>

                    {dropOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                            background: '#fff', borderRadius: 10,
                            border: '1px solid #dce1ea',
                            boxShadow: '0 8px 32px rgba(26,50,99,0.14)',
                            minWidth: 200, zIndex: 300, overflow: 'hidden',
                            animation: 'fadeSlideDown 0.15s ease',
                        }}>
                            {/* User info */}
                            <div style={{
                                padding: '12px 16px', borderBottom: '1px solid #eaecf0',
                                background: '#f8f9fb',
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Fleet Admin</div>
                                <div style={{ fontSize: 11.5, color: '#5a6478', marginTop: 2 }}>admin@greenie.ac.in</div>
                            </div>

                            {/* Items */}
                            <div style={{ padding: '6px 0' }}>
                                <button
                                    onClick={() => { setDropOpen(false); navigate('/settings') }}
                                    style={{
                                        width: '100%', padding: '10px 16px',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 13.5, color: '#1a1a2e', fontWeight: 500,
                                        transition: 'background 0.15s', textAlign: 'left',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f4f5f7'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <Settings size={14} color="#5a6478" />
                                    Account Settings
                                </button>

                                <div style={{ height: 1, background: '#eaecf0', margin: '4px 0' }} />

                                <button
                                    onClick={() => { setDropOpen(false); navigate('/login') }}
                                    style={{
                                        width: '100%', padding: '10px 16px',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 13.5, color: '#b91c1c', fontWeight: 500,
                                        transition: 'background 0.15s', textAlign: 'left',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fff1f1'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <LogOut size={14} color="#b91c1c" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    )
}
