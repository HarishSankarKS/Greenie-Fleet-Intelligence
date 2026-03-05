import { useState } from 'react'
import { MessageCircle, Plus, Clock, CheckCircle, AlertTriangle, ChevronRight, Send, X } from 'lucide-react'

const existingComplaints = [
    { id: 'TKT-1042', date: '01 Mar 2026', subject: 'Missed collection at Tambaram Zone B', category: 'Missed Collection', status: 'open', priority: 'high', lastUpdate: '2 hours ago' },
    { id: 'TKT-1041', date: '27 Feb 2026', subject: 'Truck arrived 3 hours late at Porur', category: 'Late Collection', status: 'in-progress', priority: 'medium', lastUpdate: '1 day ago' },
    { id: 'TKT-1040', date: '24 Feb 2026', subject: 'Weight measurement discrepancy in invoice', category: 'Billing Dispute', status: 'resolved', priority: 'low', lastUpdate: '5 days ago' },
    { id: 'TKT-1039', date: '20 Feb 2026', subject: 'Driver behaviour complaint at Anna Nagar', category: 'Service Quality', status: 'resolved', priority: 'medium', lastUpdate: '9 days ago' },
]

const statusCfg = {
    open: { label: 'Open', color: '#ef4444', bg: '#fef2f2' },
    'in-progress': { label: 'In Progress', color: '#f59e0b', bg: '#fff8e6' },
    resolved: { label: 'Resolved', color: '#10b981', bg: '#e8f9f0' },
}
const prioCfg = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' }

export default function ClientComplaints() {
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ subject: '', category: 'Missed Collection', site: '', description: '', priority: 'medium' })
    const [complaints, setComplaints] = useState(existingComplaints)
    const [submitted, setSubmitted] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        const newId = `TKT-${1043 + complaints.length}`
        setSubmitted(newId)
        setComplaints(prev => [{
            id: newId, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            subject: form.subject, category: form.category, status: 'open',
            priority: form.priority, lastUpdate: 'Just now',
        }, ...prev])
        setTimeout(() => { setShowForm(false); setSubmitted(null); setForm({ subject: '', category: 'Missed Collection', site: '', description: '', priority: 'medium' }) }, 2000)
    }

    const inputStyle = {
        width: '100%', padding: '9px 12px', border: '1.5px solid #dce1ea', borderRadius: 8,
        fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Issues & Complaints</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Raise and track service issues</p>
                </div>
                <button onClick={() => setShowForm(true)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}><Plus size={14} /> Raise Issue</button>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Open Issues', value: complaints.filter(c => c.status === 'open').length, color: '#ef4444' },
                    { label: 'In Progress', value: complaints.filter(c => c.status === 'in-progress').length, color: '#f59e0b' },
                    { label: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length, color: '#10b981' },
                ].map(c => (
                    <div key={c.label} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #e5e9f0' }}>
                        <div style={{ fontSize: 11.5, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase' }}>{c.label}</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: c.color, marginTop: 4 }}>{c.value}</div>
                    </div>
                ))}
            </div>

            {/* New complaint form */}
            {showForm && (
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20,
                    border: '2px solid #1a3263', boxShadow: '0 4px 16px rgba(26,50,99,0.1)',
                }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: 20 }}>
                            <CheckCircle size={40} color="#10b981" />
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginTop: 10 }}>Issue Raised Successfully</div>
                            <div style={{ fontSize: 14, color: '#5a6478', marginTop: 4 }}>Tracking ID: <strong>{submitted}</strong></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>New Issue</div>
                                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#9aa3b2" /></button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, display: 'block' }}>Subject *</label>
                                    <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of the issue" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, display: 'block' }}>Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                        {['Missed Collection', 'Late Collection', 'Billing Dispute', 'Service Quality', 'Vehicle Issue', 'Other'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, display: 'block' }}>Priority</label>
                                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
                                        {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, display: 'block' }}>Site (optional)</label>
                                    <input value={form.site} onChange={e => setForm({ ...form, site: e.target.value })} placeholder="e.g. Anna Nagar Collection Point" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 4, display: 'block' }}>Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Provide details about the issue..." style={{ ...inputStyle, resize: 'vertical' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#f0f2f5', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#5a6478' }}>Cancel</button>
                                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><Send size={13} /> Submit Issue</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Complaints list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {complaints.map(c => {
                    const sc = statusCfg[c.status]
                    return (
                        <div key={c.id} style={{
                            background: '#fff', borderRadius: 12, padding: '16px 20px',
                            border: '1px solid #e5e9f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderLeft: `4px solid ${prioCfg[c.priority]}`,
                            transition: 'box-shadow 0.15s', cursor: 'pointer',
                        }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3263' }}>{c.id}</span>
                                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginTop: 6 }}>{c.subject}</div>
                                <div style={{ fontSize: 12, color: '#5a6478', marginTop: 3 }}>{c.category} · {c.date} · Updated {c.lastUpdate}</div>
                            </div>
                            <ChevronRight size={16} color="#9aa3b2" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
