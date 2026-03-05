import { useState } from 'react'
import { Bell, Check, CheckCheck, Truck, AlertTriangle, CreditCard, FileText, Settings, Trash2, Filter } from 'lucide-react'

const initialNotifications = [
    { id: 1, type: 'collection', title: 'Collection completed at Anna Nagar', message: 'Truck TN 09 AB 1234 collected 4.2T of C&D waste.', time: '12 min ago', read: false },
    { id: 2, type: 'alert', title: 'Missed collection at Tambaram Zone B', message: 'Scheduled pickup at 08:20 AM was missed. No driver assigned.', time: '1 hour ago', read: false },
    { id: 3, type: 'billing', title: 'Invoice INV-2026-012 generated', message: 'Total amount: ₹2,18,300 due by 15 Mar 2026.', time: '2 hours ago', read: false },
    { id: 4, type: 'sla', title: 'SLA breach logged: Late Collection', message: 'Porur Industrial Area — truck arrived 3 hours late. Penalty: ₹2,000.', time: '5 hours ago', read: true },
    { id: 5, type: 'collection', title: 'Collection completed at Adyar Transit Hub', message: 'Truck TN 09 CD 5678 collected 6.8T of mixed debris.', time: '6 hours ago', read: true },
    { id: 6, type: 'system', title: 'Plan renewal reminder', message: 'Your Enterprise subscription renews on 31 Mar 2027.', time: '1 day ago', read: true },
    { id: 7, type: 'alert', title: 'Vehicle breakdown: TN 09 GH 3456', message: 'Truck reported engine issue near Velachery. Replacement dispatched.', time: '1 day ago', read: true },
    { id: 8, type: 'collection', title: 'Collection completed at Guindy', message: 'Truck TN 09 KL 2345 collected 3.1T.', time: '2 days ago', read: true },
]

const typeCfg = {
    collection: { icon: Truck, color: '#10b981', bg: '#e8f9f0', label: 'Collection' },
    alert: { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', label: 'Alert' },
    billing: { icon: CreditCard, color: '#7c3aed', bg: '#f0e8fe', label: 'Billing' },
    sla: { icon: FileText, color: '#f59e0b', bg: '#fff8e6', label: 'SLA' },
    system: { icon: Settings, color: '#6b7280', bg: '#f0f2f5', label: 'System' },
}

export default function ClientNotifications() {
    const [notifications, setNotifications] = useState(initialNotifications)
    const [filter, setFilter] = useState('all')
    const [prefs, setPrefs] = useState({ email: true, sms: false, push: true })
    const [showPrefs, setShowPrefs] = useState(false)

    const unread = notifications.filter(n => !n.read).length
    const filtered = filter === 'all' ? notifications
        : filter === 'unread' ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter)

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>
                        Notifications
                        {unread > 0 && (
                            <span style={{
                                marginLeft: 10, fontSize: 13, padding: '2px 10px', borderRadius: 20,
                                background: '#ef4444', color: '#fff', fontWeight: 700, verticalAlign: 'middle',
                            }}>{unread} new</span>
                        )}
                    </h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Stay updated on collections, alerts, and billing</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={markAllRead} style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                        background: '#f0f2f5', border: 'none', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: '#5a6478',
                    }}><CheckCheck size={14} /> Mark all read</button>
                    <button onClick={() => setShowPrefs(!showPrefs)} style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px',
                        background: showPrefs ? '#1a3263' : '#f0f2f5', border: 'none', borderRadius: 8,
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: showPrefs ? '#fff' : '#5a6478',
                    }}><Settings size={14} /> Preferences</button>
                </div>
            </div>

            {/* Preferences panel */}
            {showPrefs && (
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20,
                    border: '1px solid #e5e9f0', display: 'flex', gap: 24, alignItems: 'center',
                }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>Notification Channels:</span>
                    {[
                        { key: 'email', label: '📧 Email' },
                        { key: 'sms', label: '📱 SMS' },
                        { key: 'push', label: '🔔 Push' },
                    ].map(ch => (
                        <label key={ch.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                            <input type="checkbox" checked={prefs[ch.key]} onChange={e => setPrefs({ ...prefs, [ch.key]: e.target.checked })}
                                style={{ accentColor: '#1a3263' }}
                            />
                            <span style={{ fontWeight: 600 }}>{ch.label}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: `All (${notifications.length})` },
                    { key: 'unread', label: `Unread (${unread})` },
                    ...Object.entries(typeCfg).map(([k, v]) => ({ key: k, label: v.label })),
                ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)} style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', border: '1.5px solid',
                        background: filter === f.key ? '#1a3263' : '#fff',
                        color: filter === f.key ? '#fff' : '#5a6478',
                        borderColor: filter === f.key ? 'transparent' : '#dce1ea',
                    }}>{f.label}</button>
                ))}
            </div>

            {/* Notification list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filtered.map(n => {
                    const cfg = typeCfg[n.type]
                    const Icon = cfg.icon
                    return (
                        <div key={n.id} onClick={() => markRead(n.id)} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
                            background: n.read ? '#fff' : '#f7f9ff', borderRadius: 10,
                            border: `1px solid ${n.read ? '#e5e9f0' : '#c8d4f0'}`,
                            cursor: 'pointer', transition: 'all 0.12s',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 8, background: cfg.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Icon size={18} color={cfg.color} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 13.5, fontWeight: n.read ? 500 : 700, color: '#1a1a2e' }}>{n.title}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 11, color: '#9aa3b2' }}>{n.time}</span>
                                        {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a3263' }} />}
                                    </div>
                                </div>
                                <div style={{ fontSize: 12.5, color: '#5a6478', marginTop: 3, lineHeight: 1.4 }}>{n.message}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                    <span style={{
                                        fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                                        background: cfg.bg, color: cfg.color,
                                    }}>{cfg.label}</span>
                                    <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id) }} style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                                    }}><Trash2 size={12} color="#ccc" /></button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#9aa3b2', fontSize: 14 }}>
                        <Bell size={28} color="#dce1ea" style={{ marginBottom: 8 }} /><br />
                        No notifications to show
                    </div>
                )}
            </div>
        </div>
    )
}
