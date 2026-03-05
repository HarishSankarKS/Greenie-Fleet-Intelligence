import { useState } from 'react'
import { MapPin, Truck, Calendar, Clock, Package, Send, CheckCircle, Calculator } from 'lucide-react'

const siteOptions = [
    'Anna Nagar Collection Point', 'Adyar Transit Hub', 'T. Nagar Market Site',
    'Velachery Depot', 'Porur Industrial Area', 'Guindy Transfer Station',
    'Perambur Sorting Yard', 'Sholinganallur Hub', 'Custom Location',
]
const wasteTypes = ['C&D Waste', 'Concrete Rubble', 'Mixed Debris', 'Metal Scrap', 'Wood Waste', 'Other']

export default function ClientCollectionRequest() {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({
        site: '', customAddr: '', wasteType: 'C&D Waste', estWeight: '',
        date: '', time: 'morning', notes: '', urgent: false,
    })
    const [submitted, setSubmitted] = useState(null)

    const pricePerTon = form.wasteType === 'Metal Scrap' ? 800 : form.wasteType === 'C&D Waste' ? 1200 : 1000
    const estCost = form.estWeight ? (parseFloat(form.estWeight) * pricePerTon).toLocaleString() : '—'

    const handleSubmit = () => {
        const reqId = `REQ-${2000 + Math.floor(Math.random() * 100)}`
        setSubmitted({ id: reqId, eta: '45 min' })
    }

    const inputStyle = {
        width: '100%', padding: '10px 12px', border: '1.5px solid #dce1ea', borderRadius: 8,
        fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    }
    const labelStyle = { fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 6, display: 'block' }

    if (submitted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <div style={{ textAlign: 'center', background: '#fff', borderRadius: 16, padding: '48px 40px', border: '1px solid #e5e9f0', maxWidth: 420 }}>
                    <CheckCircle size={52} color="#10b981" />
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginTop: 16 }}>Collection Requested!</h2>
                    <p style={{ color: '#5a6478', fontSize: 14, margin: '8px 0 20px' }}>Your request has been submitted successfully</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
                        {[
                            { label: 'Request ID', value: submitted.id },
                            { label: 'Est. ETA', value: submitted.eta },
                            { label: 'Waste Type', value: form.wasteType },
                            { label: 'Est. Cost', value: `₹${estCost}` },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ padding: '10px 14px', background: '#f8f9fb', borderRadius: 8 }}>
                                <div style={{ fontSize: 11, color: '#5a6478', fontWeight: 600 }}>{label}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginTop: 2 }}>{value}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => { setSubmitted(null); setStep(1); setForm({ site: '', customAddr: '', wasteType: 'C&D Waste', estWeight: '', date: '', time: 'morning', notes: '', urgent: false }) }}
                        style={{ marginTop: 24, padding: '10px 24px', background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        New Request
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Request Collection</h1>
                <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Schedule an on-demand waste pickup</p>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {[{ n: 1, label: 'Location & Waste' }, { n: 2, label: 'Schedule' }, { n: 3, label: 'Review & Submit' }].map(s => (
                    <div key={s.n} style={{
                        flex: 1, padding: '10px 16px', borderRadius: 8, textAlign: 'center',
                        background: step >= s.n ? '#1a3263' : '#f0f2f5',
                        color: step >= s.n ? '#fff' : '#5a6478',
                        fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                    }}>Step {s.n}: {s.label}</div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                {/* Form */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e9f0' }}>
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}><MapPin size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />Collection Site</label>
                                <select value={form.site} onChange={e => setForm({ ...form, site: e.target.value })} style={inputStyle}>
                                    <option value="">Select a site...</option>
                                    {siteOptions.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            {form.site === 'Custom Location' && (
                                <div>
                                    <label style={labelStyle}>Custom Address</label>
                                    <input value={form.customAddr} onChange={e => setForm({ ...form, customAddr: e.target.value })} placeholder="Enter full address" style={inputStyle} />
                                </div>
                            )}
                            <div>
                                <label style={labelStyle}><Package size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />Waste Type</label>
                                <select value={form.wasteType} onChange={e => setForm({ ...form, wasteType: e.target.value })} style={inputStyle}>
                                    {wasteTypes.map(w => <option key={w}>{w}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Estimated Weight (tonnes)</label>
                                <input type="number" min="0.5" step="0.5" value={form.estWeight} onChange={e => setForm({ ...form, estWeight: e.target.value })} placeholder="e.g. 5" style={inputStyle} />
                            </div>
                            <button onClick={() => setStep(2)} disabled={!form.site || !form.estWeight} style={{
                                padding: '10px 20px', background: form.site && form.estWeight ? '#1a3263' : '#ccc', color: '#fff',
                                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: form.site && form.estWeight ? 'pointer' : 'not-allowed', alignSelf: 'flex-end',
                            }}>Next →</button>
                        </div>
                    )}
                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}><Calendar size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />Preferred Date</label>
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}><Clock size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />Time Slot</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[{ key: 'morning', label: '6 AM – 12 PM' }, { key: 'afternoon', label: '12 PM – 6 PM' }, { key: 'evening', label: '6 PM – 10 PM' }].map(t => (
                                        <button key={t.key} onClick={() => setForm({ ...form, time: t.key })} style={{
                                            flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                            cursor: 'pointer', border: '1.5px solid',
                                            background: form.time === t.key ? '#1a3263' : '#fff',
                                            color: form.time === t.key ? '#fff' : '#5a6478',
                                            borderColor: form.time === t.key ? '#1a3263' : '#dce1ea',
                                        }}>{t.label}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Notes (optional)</label>
                                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Any special instructions..." style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1a1a2e', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.urgent} onChange={e => setForm({ ...form, urgent: e.target.checked })} />
                                <span style={{ fontWeight: 600 }}>🚨 Mark as Urgent</span>
                                <span style={{ fontSize: 11, color: '#5a6478' }}>(+20% surcharge)</span>
                            </label>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                                <button onClick={() => setStep(1)} style={{ padding: '10px 20px', background: '#f0f2f5', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#5a6478' }}>← Back</button>
                                <button onClick={() => setStep(3)} disabled={!form.date} style={{
                                    padding: '10px 20px', background: form.date ? '#1a3263' : '#ccc', color: '#fff',
                                    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: form.date ? 'pointer' : 'not-allowed',
                                }}>Review →</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Confirm Details</div>
                            {[
                                { label: 'Site', value: form.site === 'Custom Location' ? form.customAddr : form.site },
                                { label: 'Waste Type', value: form.wasteType },
                                { label: 'Est. Weight', value: `${form.estWeight} T` },
                                { label: 'Date', value: form.date },
                                { label: 'Time', value: form.time.charAt(0).toUpperCase() + form.time.slice(1) },
                                { label: 'Urgent', value: form.urgent ? 'Yes (+20%)' : 'No' },
                                { label: 'Est. Cost', value: `₹${estCost}${form.urgent ? ' + 20%' : ''}` },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f5', fontSize: 13 }}>
                                    <span style={{ color: '#5a6478' }}>{label}</span>
                                    <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 20 }}>
                                <button onClick={() => setStep(2)} style={{ padding: '10px 20px', background: '#f0f2f5', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#5a6478' }}>← Back</button>
                                <button onClick={handleSubmit} style={{
                                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
                                    background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                                }}><Send size={14} /> Submit Request</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Price estimator */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0', alignSelf: 'start' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14 }}>
                        <Calculator size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />Price Estimate
                    </div>
                    <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 12 }}>Based on selected waste type and weight</div>
                    {[
                        { label: 'Rate', value: `₹${pricePerTon}/ton` },
                        { label: 'Weight', value: form.estWeight ? `${form.estWeight} T` : '—' },
                        { label: 'Subtotal', value: `₹${estCost}` },
                        ...(form.urgent ? [{ label: 'Urgent surcharge (20%)', value: form.estWeight ? `₹${(parseFloat(form.estWeight) * pricePerTon * 0.2).toLocaleString()}` : '—' }] : []),
                    ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderBottom: '1px solid #f5f6f8' }}>
                            <span style={{ color: '#5a6478' }}>{label}</span>
                            <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{value}</span>
                        </div>
                    ))}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 8,
                        fontSize: 15, fontWeight: 800, borderTop: '2px solid #1a3263',
                    }}>
                        <span style={{ color: '#1a1a2e' }}>Total</span>
                        <span style={{ color: '#1a3263' }}>
                            {form.estWeight
                                ? `₹${(parseFloat(form.estWeight) * pricePerTon * (form.urgent ? 1.2 : 1)).toLocaleString()}`
                                : '—'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
