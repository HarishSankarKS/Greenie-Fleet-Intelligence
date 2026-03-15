import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MapPin, Truck, Calendar, Clock, Package, Send, CheckCircle, Calculator, Download } from 'lucide-react'

// ─── Booking Receipt PDF ──────────────────────────────────────────────────────
function generateBookingReceipt({ submitted, form, rateInfo, baseRate, subtotal, gstAmt, total }) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10)
    const timeStr = today.toLocaleTimeString('en-IN', { hour12: false })

    // ── Header ──
    doc.setFillColor(26, 50, 99)
    doc.rect(0, 0, pageW, 44, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(255, 255, 255)
    doc.text('GREENIE', 14, 17)
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 200, 255)
    doc.text('Fleet & Waste Intelligence  ·  Client Portal  ·  Collection Services', 14, 25)
    doc.text('Coimbatore, Tamil Nadu  ·  GSTIN: 33AABCG1234A1Z5  ·  ops@greenie.ac.in', 14, 31)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(255, 255, 255)
    doc.text('BOOKING CONFIRMATION RECEIPT', pageW - 14, 17, { align: 'right' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(180, 200, 255)
    doc.text(`Receipt No: ${submitted.id}-RCT`, pageW - 14, 25, { align: 'right' })
    doc.text(`Issued: ${dateStr}  ${timeStr}`, pageW - 14, 31, { align: 'right' })

    // ── Accent line ──
    doc.setDrawColor(200, 169, 81); doc.setLineWidth(0.6); doc.line(14, 48, pageW - 14, 48)

    // ── Booking Reference Box ──
    doc.setFillColor(240, 245, 255)
    doc.roundedRect(14, 53, pageW - 28, 20, 2, 2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(26, 50, 99)
    doc.text('BOOKING REFERENCE', 20, 61)
    doc.setFontSize(14); doc.setTextColor(26, 50, 99)
    doc.text(submitted.id, 20, 69)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80)
    doc.text(`${submitted.isTipping ? 'Tipping Fee Request' : 'Waste Collection Request'}  ·  ${dateStr}`, pageW - 20, 65, { align: 'right' })

    // ── Service Details ──
    autoTable(doc, {
        startY: 82,
        head: [['Field', 'Details']],
        body: [
            ['Collection Site',    form.site || form.customAddr || '—'],
            ['Waste Type',         form.wasteType],
            ['Estimated Weight',   form.estWeight ? `${form.estWeight} T` : '—'],
            ['Preferred Date',     form.date || '—'],
            ['Preferred Time',     form.time === 'morning' ? 'Morning (6 AM – 12 PM)' : form.time === 'afternoon' ? 'Afternoon (12 PM – 6 PM)' : 'Evening (6 PM – 9 PM)'],
            ['Urgent Request',     form.urgent ? 'Yes – Priority dispatch (+20% surcharge)' : 'No'],
            ['Client Notes',       form.notes || '—'],
            ['Est. ETA',           submitted.eta],
        ],
        styles: { fontSize: 9.5, cellPadding: 4.5 },
        headStyles: { fillColor: [26, 50, 99], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 248, 252] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55 } },
        margin: { left: 14, right: 14 },
    })

    const afterDetails = doc.lastAutoTable.finalY + 8

    // ── Price Breakdown ──
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(26, 50, 99)
    doc.text('PRICE BREAKDOWN', 14, afterDetails)
    autoTable(doc, {
        startY: afterDetails + 5,
        body: [
            [`Rate (${rateInfo.unit})`,                    `₹${baseRate.toLocaleString('en-IN')}`],
            ['Estimated Weight',                            form.estWeight ? `${form.estWeight} T` : '—'],
            ['Subtotal',                                    subtotal ? `₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'],
            ...(form.urgent ? [['Urgent Surcharge (+20%)', `₹${(subtotal * 0.2 / (form.urgent ? 1.2 : 1)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`]] : []),
            [`GST @ ${rateInfo.gst}%`,                    rateInfo.gst === 0 ? 'Exempt' : gstAmt ? `₹${gstAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'],
            ['TOTAL (incl. GST)',                           total ? `₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'],
        ],
        styles: { fontSize: 9.5, cellPadding: 4 },
        headStyles: { fillColor: [26, 50, 99], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 248, 252] },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 80 },
            1: { halign: 'right' },
        },
        bodyStyles: { textColor: [40, 40, 40] },
        // Bold last row (TOTAL)
        didParseCell(data) {
            const isLast = data.row.index === (form.urgent ? 4 : 3)
            if (isLast) {
                data.cell.styles.fontStyle = 'bold'
                data.cell.styles.fillColor = [240, 245, 255]
                data.cell.styles.textColor = [26, 50, 99]
                data.cell.styles.fontSize = 11
            }
        },
        margin: { left: 14, right: 14 },
    })

    const afterPrice = doc.lastAutoTable.finalY + 10

    // ── Service Commitment ──
    doc.setFillColor(240, 253, 244); doc.roundedRect(14, afterPrice, pageW - 28, 28, 2, 2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(22, 101, 52)
    doc.text('GREENIE SERVICE COMMITMENT', 20, afterPrice + 9)
    doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40)
    doc.text('• Greenie ops team will confirm collection within 30 minutes of this booking.', 20, afterPrice + 17)
    doc.text('• Digital Waste Transfer Note (WTN) will be issued upon collection completion.', 20, afterPrice + 23)

    // ── Footer ──
    doc.setFillColor(240, 245, 255); doc.rect(0, 281, pageW, 16, 'F')
    doc.setFontSize(7.5); doc.setTextColor(100, 100, 100)
    doc.text(
        `${submitted.id}-RCT  ·  ${dateStr} ${timeStr}  ·  Greenie Fleet Intelligence Pvt Ltd  ·  ops@greenie.ac.in  ·  +91 98400 00000`,
        pageW / 2, 290, { align: 'center' }
    )

    doc.output('save', `GRN-${submitted.id}-RECEIPT.pdf`)
}

// 12 active demolition / construction pickup sites in Coimbatore
const siteOptions = [
    { id: 'CBE-S01', label: 'RS Puram Old Residential Block (Ward 70)',    zone: 'South' },
    { id: 'CBE-S02', label: 'Gandhipuram Commercial Teardown (Ward 67)',   zone: 'North' },
    { id: 'CBE-S03', label: 'Peelamedu Junction Warehouse Site (Ward 36)', zone: 'East'  },
    { id: 'CBE-S04', label: 'Ramanathapuram Layout Demo (Ward 33)',        zone: 'South' },
    { id: 'CBE-S05', label: 'Ondipudur Bypass Road Works (Ward 29)',       zone: 'East'  },
    { id: 'CBE-S06', label: 'Ganapathy 4th Cross Site (Ward 55)',          zone: 'North' },
    { id: 'CBE-S07', label: 'Kovaipudur Hill Access Road (Ward 82)',       zone: 'West'  },
    { id: 'CBE-S08', label: 'Saibaba Colony Junction Demo (Ward 69)',      zone: 'North' },
    { id: 'CBE-S09', label: 'Kalapatti IT Corridor (Ward 23)',             zone: 'East'  },
    { id: 'CBE-S10', label: 'Podanur Railway-Adjacent Site (Ward 90)',     zone: 'South' },
    { id: 'CBE-S11', label: 'Sowripalayam Old Factory (Ward 45)',          zone: 'South' },
    { id: 'CBE-S12', label: 'Mettupalayam Rd Flyover Site (Ward 2)',       zone: 'North' },
    { id: 'CUSTOM',  label: 'Other / Custom Location',                     zone: null    },
]

// Each zone routes to its Transfer Station
const ZONE_TO_TS = {
    North: 'Greenie North Transfer Station — Thudiyalur',
    South: 'Greenie South Transfer Station — Singanallur',
    East:  'Greenie East Transfer Station — Irugur / Avinashi Rd',
    West:  'Greenie West Transfer Station — Kuniyamuthur',
}

const wasteTypes = ['Concrete Rubble', 'Steel / Metal Scrap', 'Brick', 'Timber', 'Mixed C&D Debris', 'Sand & Aggregate', 'Plastic Waste', 'Tipping Fee Request']

const RATES = {
    'Concrete Rubble':        { rate: 1100, unit: '/T', gst: 18, tip: false },
    'Steel / Metal Scrap':    { rate: 800,  unit: '/T', gst: 18, tip: false },
    'Brick':                  { rate: 950,  unit: '/T', gst: 18, tip: false },
    'Timber':                 { rate: 1000, unit: '/T', gst: 18, tip: false },
    'Mixed C&D Debris':       { rate: 1200, unit: '/T', gst: 18, tip: false },
    'Sand & Aggregate':       { rate: 700,  unit: '/T', gst: 18, tip: false },
    'Plastic Waste':          { rate: 600,  unit: '/T', gst: 18, tip: false },
    'Tipping Fee Request':    { rate: 400,  unit: '/T', gst: 0,  tip: true  },
}


export default function ClientCollectionRequest() {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({
        site: '', customAddr: '', wasteType: 'C&D Waste', estWeight: '',
        date: '', time: 'morning', notes: '', urgent: false,
    })
    const [submitted, setSubmitted] = useState(null)

    const rateInfo = RATES[form.wasteType] || RATES['C&D Waste']
    const baseRate = rateInfo.rate
    const urgentMultiplier = form.urgent ? 1.2 : 1
    const subtotal = form.estWeight ? parseFloat(form.estWeight) * baseRate * urgentMultiplier : 0
    const gstAmt = subtotal * (rateInfo.gst / 100)
    const total = subtotal + gstAmt
    const isTipping = rateInfo.tip

    const handleSubmit = () => {
        const reqId = `REQ-${2000 + Math.floor(Math.random() * 100)}`
        setSubmitted({ id: reqId, eta: isTipping ? 'Next working day' : '45 min', total: total.toLocaleString('en-IN', { maximumFractionDigits: 0 }), isTipping })
    }

    const inputStyle = {
        width: '100%', padding: '10px 12px', border: '1.5px solid #dce1ea', borderRadius: 8,
        fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    }
    const labelStyle = { fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 6, display: 'block' }

    if (submitted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <div style={{ textAlign: 'center', background: '#fff', borderRadius: 16, padding: '48px 40px', border: '1px solid #e5e9f0', maxWidth: 460 }}>
                    <CheckCircle size={52} color="#10b981" />
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginTop: 16 }}>{submitted.isTipping ? 'Tipping Request Submitted!' : 'Collection Requested!'}</h2>
                    <p style={{ color: '#5a6478', fontSize: 14, margin: '8px 0 20px' }}>Your request has been confirmed. Greenie ops team will follow up.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
                        {[
                            { label: 'Request ID', value: submitted.id },
                            { label: 'Est. ETA', value: submitted.eta },
                            { label: 'Waste Type', value: form.wasteType },
                            { label: 'Total (incl. GST)', value: `₹${submitted.total}` },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ padding: '10px 14px', background: '#f8f9fb', borderRadius: 8 }}>
                                <div style={{ fontSize: 11, color: '#5a6478', fontWeight: 600 }}>{label}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginTop: 2 }}>{value}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                        <button
                            onClick={() => generateBookingReceipt({ submitted, form, rateInfo, baseRate, subtotal, gstAmt, total })}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#166534', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                        >
                            <Download size={14} /> Download Receipt PDF
                        </button>
                        <button onClick={() => { setSubmitted(null); setStep(1); setForm({ site: '', customAddr: '', wasteType: 'C&D Waste', estWeight: '', date: '', time: 'morning', notes: '', urgent: false }) }}
                            style={{ padding: '10px 20px', background: '#1a3263', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            New Request
                        </button>
                    </div>
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
                                <label style={labelStyle}><MapPin size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />Pickup Site (where waste is located)</label>
                                <select value={form.site} onChange={e => setForm({ ...form, site: e.target.value })} style={inputStyle}>
                                    <option value="">Select a demolition / construction site...</option>
                                    {siteOptions.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                            </div>
                            {form.site === 'CUSTOM' && (
                                <div>
                                    <label style={labelStyle}>Custom Site Address</label>
                                    <input value={form.customAddr} onChange={e => setForm({ ...form, customAddr: e.target.value })} placeholder="Enter full address" style={inputStyle} />
                                </div>
                            )}
                            {form.site && form.site !== 'CUSTOM' && (() => {
                                const siteObj = siteOptions.find(s => s.id === form.site)
                                const ts = siteObj?.zone ? ZONE_TO_TS[siteObj.zone] : null
                                return ts ? (
                                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#0369a1' }}>
                                        🏭 <strong>Assigned Transfer Station:</strong> {ts}<br />
                                        <span style={{ fontSize: 11, color: '#5a6478', marginTop: 2, display: 'block' }}>Greenie will collect from this site and process waste at the above station.</span>
                                    </div>
                                ) : null
                            })()}
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
                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Note: Collection sites are pickup points only. Inventory &amp; pricing are managed at Transfer Stations.</div>
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
                            {(() => {
                                const siteObj = siteOptions.find(s => s.id === form.site)
                                const siteLabel = form.site === 'CUSTOM' ? form.customAddr : (siteObj?.label || form.site)
                                const ts = siteObj?.zone ? ZONE_TO_TS[siteObj.zone] : 'To be assigned'
                                return [
                                    { label: 'Pickup Site', value: siteLabel },
                                    { label: '→ Transfer Station', value: ts },
                                    { label: 'Waste Type', value: form.wasteType },
                                    { label: 'Est. Weight', value: `${form.estWeight} T` },
                                    { label: 'Date', value: form.date },
                                    { label: 'Time Slot', value: form.time.charAt(0).toUpperCase() + form.time.slice(1) },
                                    { label: 'Urgent', value: form.urgent ? 'Yes (+20%)' : 'No' },
                                ]
                            })().map(({ label, value }) => (
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
                        <Calculator size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />Upfront Price Quote
                    </div>
                    {isTipping && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#166534', fontWeight: 600, marginBottom: 12 }}>
                            🏗️ Tipping Fee — You pay Greenie for disposal
                        </div>
                    )}
                    <div style={{ fontSize: 11, color: '#5a6478', marginBottom: 12 }}>Binding quote · GST included</div>
                    {[
                        { label: `Rate (${rateInfo.unit})`, value: `₹${baseRate.toLocaleString('en-IN')}` },
                        { label: 'Weight', value: form.estWeight ? `${form.estWeight} T` : '—' },
                        { label: 'Subtotal', value: subtotal ? `₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—' },
                        ...(form.urgent ? [{ label: 'Urgent surcharge (+20%)', value: subtotal ? `+₹${(subtotal * 0.2 / urgentMultiplier).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—' }] : []),
                        { label: `GST @ ${rateInfo.gst}%`, value: gstAmt ? `₹${gstAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : rateInfo.gst === 0 ? 'Exempt' : '—' },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderBottom: '1px solid #f5f6f8' }}>
                            <span style={{ color: '#5a6478' }}>{label}</span>
                            <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{value}</span>
                        </div>
                    ))}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: 8,
                        fontSize: 16, fontWeight: 800, borderTop: '2.5px solid #1a3263',
                    }}>
                        <span style={{ color: '#1a1a2e' }}>Total</span>
                        <span style={{ color: '#1a3263' }}>
                            {total ? `₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'}
                        </span>
                    </div>
                    {total > 0 && (
                        <div style={{ marginTop: 8, background: '#f0fdf4', borderRadius: 8, padding: '8px 12px', fontSize: 11.5, color: '#166534' }}>
                            ✓ This is a binding quote valid for 24 hours
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
