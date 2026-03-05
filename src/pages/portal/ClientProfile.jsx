import { useState } from 'react'
import { User, Mail, Phone, Building2, MapPin, Lock, Users, Shield, Save, Edit3 } from 'lucide-react'

export default function ClientProfile() {
    const [editing, setEditing] = useState(false)
    const [profile, setProfile] = useState({
        name: 'Rajesh Krishnan',
        role: 'Project Manager',
        email: 'rajesh.k@acmebuilders.in',
        phone: '+91 98765 43210',
        company: 'Acme Builders Pvt. Ltd.',
        address: '42, Industrial Estate, Guindy, Chennai - 600032',
        gst: '33AABCA1234F1Z5',
        pan: 'AABCA1234F',
    })
    const [saved, setSaved] = useState(false)

    const teamMembers = [
        { name: 'Rajesh Krishnan', email: 'rajesh.k@acmebuilders.in', role: 'Admin', status: 'active' },
        { name: 'Priya Sharma', email: 'priya.s@acmebuilders.in', role: 'Viewer', status: 'active' },
        { name: 'Arun Kumar', email: 'arun.k@acmebuilders.in', role: 'Viewer', status: 'invited' },
    ]

    const handleSave = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000) }

    const inputStyle = {
        width: '100%', padding: '9px 12px', border: '1.5px solid #dce1ea', borderRadius: 8,
        fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        background: editing ? '#fff' : '#f8f9fb', color: '#1a1a2e',
    }
    const labelStyle = { fontSize: 12, fontWeight: 600, color: '#5a6478', marginBottom: 4, display: 'block' }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Profile & Access</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Manage your account and team access</p>
                </div>
                {saved && <span style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>✓ Changes saved</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                {/* Profile form */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e9f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Account Details</div>
                        <button onClick={() => editing ? handleSave() : setEditing(true)} style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                            background: editing ? '#10b981' : '#f0f2f5', color: editing ? '#fff' : '#5a6478',
                            border: 'none', borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        }}>{editing ? <><Save size={13} /> Save Changes</> : <><Edit3 size={13} /> Edit</>}</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} disabled={!editing} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Role</label>
                            <input value={profile.role} disabled style={{ ...inputStyle, background: '#f8f9fb' }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} disabled={!editing} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} disabled={!editing} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Company</label>
                            <input value={profile.company} disabled style={{ ...inputStyle, background: '#f8f9fb' }} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Address</label>
                            <input value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} disabled={!editing} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>GST Number</label>
                            <input value={profile.gst} disabled style={{ ...inputStyle, background: '#f8f9fb', fontFamily: 'monospace' }} />
                        </div>
                        <div>
                            <label style={labelStyle}>PAN</label>
                            <input value={profile.pan} disabled style={{ ...inputStyle, background: '#f8f9fb', fontFamily: 'monospace' }} />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #e5e9f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <Lock size={14} color="#5a6478" />
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Security</span>
                        </div>
                        <button style={{
                            padding: '8px 16px', background: '#f0f2f5', border: 'none', borderRadius: 8,
                            fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#5a6478',
                        }}>Change Password</button>
                    </div>
                </div>

                {/* Team */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}><Users size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />Team Members</div>
                        <button style={{
                            padding: '5px 12px', background: '#1a3263', color: '#fff', border: 'none',
                            borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}>+ Invite</button>
                    </div>
                    {teamMembers.map(m => (
                        <div key={m.email} style={{
                            padding: '12px 0', borderBottom: '1px solid #f0f2f5',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{m.name}</div>
                                <div style={{ fontSize: 11.5, color: '#5a6478' }}>{m.email}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                                    background: m.role === 'Admin' ? '#e8f0fe' : '#f0f2f5',
                                    color: m.role === 'Admin' ? '#1a3263' : '#5a6478',
                                }}>{m.role}</span>
                                {m.status === 'invited' && (
                                    <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, marginTop: 3 }}>Pending invite</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
