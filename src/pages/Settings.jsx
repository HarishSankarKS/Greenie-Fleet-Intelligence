import { useState } from 'react'
import { User, Bell, Lock, Globe, Palette, Save, Building } from 'lucide-react'

export default function Settings() {
    const [profile, setProfile] = useState({
        name: 'Fleet Admin',
        email: 'admin@greenie.ac.in',
        role: 'System Administrator',
        organization: 'GREENIE Fleet Solutions',
        phone: '021-99203099',
    })

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        maintenanceDue: true,
        collectionComplete: true,
        systemReports: false,
        smsAlerts: false,
    })

    const [saved, setSaved] = useState(false)
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

    const Toggle = ({ checked, onChange }) => (
        <div
            onClick={() => onChange(!checked)}
            style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: checked ? 'var(--color-primary)' : '#d1d5db',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0
            }}
        >
            <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: checked ? 23 : 3,
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
        </div>
    )

    const sections = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'security', icon: Lock, label: 'Security' },
        { id: 'system', icon: Globe, label: 'System' },
    ]
    const [activeSection, setActiveSection] = useState('profile')

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Settings</div>
                    <div className="page-subtitle">System configuration and account preferences</div>
                </div>
                {saved && (
                    <div className="alert-strip success" style={{ marginBottom: 0 }}>
                        <Save size={14} /> Settings saved successfully!
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
                {/* Sidebar */}
                <div className="card" style={{ padding: '12px 0', height: 'fit-content' }}>
                    {sections.map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            style={{
                                width: '100%', padding: '11px 20px', border: 'none', cursor: 'pointer',
                                background: activeSection === id ? 'rgba(15,118,110,0.06)' : 'transparent',
                                color: activeSection === id ? 'var(--color-primary)' : 'var(--color-text)',
                                fontWeight: activeSection === id ? 600 : 500,
                                fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                                borderLeft: activeSection === id ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                                transition: 'all 0.15s',
                            }}
                        >
                            <Icon size={15} /> {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div>
                    {activeSection === 'profile' && (
                        <div className="card">
                            <div className="card-header">
                                <span className="card-title">Profile Information</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Building size={14} style={{ color: 'var(--color-text-muted)' }} />
                                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{profile.organization}</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: '16px', background: 'var(--color-bg)', borderRadius: 12 }}>
                                    <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#0f766e,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, flexShrink: 0 }}>
                                        AD
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.name}</div>
                                        <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{profile.role}</div>
                                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{profile.email}</div>
                                    </div>
                                </div>
                                <div className="form-grid" style={{ gap: 16 }}>
                                    {[
                                        { label: 'Full Name', key: 'name' },
                                        { label: 'Email Address', key: 'email' },
                                        { label: 'Role', key: 'role' },
                                        { label: 'Phone Number', key: 'phone' },
                                        { label: 'Organization', key: 'organization' },
                                    ].map(f => (
                                        <div key={f.key} className="form-group" style={f.key === 'organization' ? { gridColumn: '1 / -1' } : {}}>
                                            <label className="form-label">{f.label}</label>
                                            <input className="form-input" value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="card">
                            <div className="card-header"><span className="card-title">Notification Preferences</span></div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {Object.entries(notifications).map(([key, val]) => {
                                    const labels = {
                                        emailAlerts: { title: 'Email Alerts', desc: 'Receive operational alerts via email' },
                                        maintenanceDue: { title: 'Maintenance Due Reminders', desc: 'Notified when service is due' },
                                        collectionComplete: { title: 'Collection Completed', desc: 'Alerts when collections are finished' },
                                        systemReports: { title: 'Weekly System Reports', desc: 'Automated weekly performance reports' },
                                        smsAlerts: { title: 'SMS Alerts', desc: 'Critical alerts via SMS to your phone' },
                                    }
                                    return (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--color-border)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{labels[key].title}</div>
                                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{labels[key].desc}</div>
                                            </div>
                                            <Toggle checked={val} onChange={v => setNotifications(p => ({ ...p, [key]: v }))} />
                                        </div>
                                    )
                                })}
                                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Preferences</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="card">
                            <div className="card-header"><span className="card-title">Security Settings</span></div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="alert-strip success"><Lock size={14} /> Your account is secured with strong authentication.</div>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input className="form-input" type="password" placeholder="Enter current password" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input className="form-input" type="password" placeholder="Enter new password" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input className="form-input" type="password" placeholder="Repeat new password" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" onClick={handleSave}><Lock size={14} /> Update Password</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'system' && (
                        <div className="card">
                            <div className="card-header"><span className="card-title">System Configuration</span></div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">System Name</label>
                                        <input className="form-input" defaultValue="Smart C&D Waste Monitoring" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time Zone</label>
                                        <select className="form-select" defaultValue="PKT">
                                            <option value="PKT">Asia/Karachi (PKT, UTC+5)</option>
                                            <option value="UTC">UTC</option>
                                            <option value="IST">Asia/Kolkata (IST, UTC+5:30)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Language</label>
                                        <select className="form-select" defaultValue="en">
                                            <option value="en">English</option>
                                            <option value="ur">اردو (Urdu)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Data Refresh Rate</label>
                                        <select className="form-select" defaultValue="30">
                                            <option value="15">Every 15 seconds</option>
                                            <option value="30">Every 30 seconds</option>
                                            <option value="60">Every 60 seconds</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save System Config</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
