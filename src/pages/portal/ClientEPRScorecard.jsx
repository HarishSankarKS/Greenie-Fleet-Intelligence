import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Leaf, TrendingUp, AlertTriangle, Download, FileText, Award, Shield, Wind } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const monthlyEPR = [
    { month: 'Sep', score: 72 }, { month: 'Oct', score: 78 },
    { month: 'Nov', score: 74 }, { month: 'Dec', score: 82 },
    { month: 'Jan', score: 85 }, { month: 'Feb', score: 88 },
]

const wasteBreakdown = [
    { name: 'Concrete Rubble', value: 42, color: '#1a3263' },
    { name: 'Mixed Debris',    value: 28, color: '#c8a951' },
    { name: 'Metal Scrap',     value: 15, color: '#10b981' },
    { name: 'Wood',            value: 10, color: '#7c3aed' },
    { name: 'Other',           value: 5,  color: '#9ca3af' },
]

// ─── Milestones from C&D Rules 2025 ──────────────────────────────────────────
const EPR_MILESTONES = [
    { label: 'Phase 1 (2026–28)', target: 5,  achieved: 76.4, rule: 'C&D Rules 2025 — Initial Target' },
    { label: 'Phase 2 (2028–30)', target: 15, achieved: 76.4, rule: 'C&D Rules 2025 — Scale-Up Target' },
    { label: 'Phase 3 (2030+)',   target: 25, achieved: 76.4, rule: 'C&D Rules 2025 — Mandatory Target' },
]

// ─── PDF Certificate Generator ───────────────────────────────────────────────
function generateCPCBReport() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const today = new Date().toISOString().slice(0, 10)
    const certNo = `GRN-EPR-CLIENT-${today.replace(/-/g, '')}`

    // Header
    doc.setFillColor(16, 66, 52)
    doc.rect(0, 0, pageW, 42, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(255, 255, 255)
    doc.text('GREENIE', 14, 16)
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(187, 247, 208)
    doc.text('Fleet & Waste Intelligence · Client Portal · EPR Division', 14, 23)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(255, 255, 255)
    doc.text('CLIENT EPR COMPLIANCE REPORT', pageW - 14, 16, { align: 'right' })
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(187, 247, 208)
    doc.text(`Cert No: ${certNo}`, pageW - 14, 23, { align: 'right' })
    doc.text(`Issued: ${today} · FY 2025–26 · Q4`, pageW - 14, 29, { align: 'right' })

    doc.setDrawColor(200, 169, 81); doc.setLineWidth(0.5); doc.line(14, 47, pageW - 14, 47)

    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(16, 66, 52)
    doc.text('CERTIFICATE OF EPR SCORECARD COMPLIANCE', pageW / 2, 57, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80)
    doc.text('Issued under Environment (C&D) Waste Management Rules, 2025 · CPCB Portal Submission', pageW / 2, 64, { align: 'center' })

    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.2); doc.line(14, 70, pageW - 14, 70)

    // Client Details
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 50, 99)
    doc.text('CLIENT DETAILS', 14, 79)
    const details = [
        ['Client Entity', 'XYZ Constructions Pvt Ltd'],
        ['Client ID', 'GRN-CLI-004'],
        ['GSTIN', '33XYZCO1234B1Z7'],
        ['Greenie Contract', 'GRN-SLA-2025-04'],
        ['Service Region', 'Coimbatore, Tamil Nadu'],
    ]
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(40, 40, 40)
    let dy = 88
    details.forEach(([label, val]) => {
        doc.setFont('helvetica', 'bold'); doc.text(`${label}:`, 14, dy)
        doc.setFont('helvetica', 'normal'); doc.text(val, 70, dy)
        dy += 7
    })

    // EPR Metrics Table
    autoTable(doc, {
        startY: dy + 8,
        head: [['Metric', 'Value', 'Status']],
        body: [
            ['Total Waste Processed (FY 2025–26)', '1,248 T', '✓ Verified'],
            ['Recycled / Diverted Waste', '953.9 T', '✓ Verified'],
            ['Recycling Rate Achieved', '76.4%', '✓ CPCB Compliant'],
            ['Phase 1 Mandate (5% minimum)', '76.4% > 5%', '✓ Exceeded'],
            ['EPR Score', '88/100', '✓ Above Target (80)'],
            ['Pending Certificates', '2', '— Await TSPCB'],
            ['Penalty Forecast', '₹0', '✓ No Penalties'],
        ],
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [16, 66, 52], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 14, right: 14 },
    })

    const afterTable = doc.lastAutoTable.finalY + 10

    // Milestone status
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 50, 99)
    doc.text('C&D RULES 2025 — MILESTONE STATUS', 14, afterTable)
    const milestones = [
        ['Phase 1 (2026–28)', '5% target', '76.4% achieved', '✓ Met'],
        ['Phase 2 (2028–30)', '15% target', '76.4% achieved', '✓ Met'],
        ['Phase 3 (2030+)',   '25% target', '76.4% achieved', '✓ Met'],
    ]
    autoTable(doc, {
        startY: afterTable + 6,
        head: [['Milestone', 'Mandate', 'Achieved', 'Status']],
        body: milestones,
        styles: { fontSize: 8.5, cellPadding: 3.5 },
        headStyles: { fillColor: [26, 50, 99], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        margin: { left: 14, right: 14 },
    })

    // Footer
    doc.setFillColor(240, 253, 244); doc.rect(0, 282, pageW, 15, 'F')
    doc.setFontSize(7.5); doc.setTextColor(80, 80, 80)
    doc.text(`${certNo} · Valid for CPCB Portal Submission · compliance@greenie.ac.in`, pageW / 2, 289, { align: 'center' })

    doc.output('save', `${certNo}.pdf`)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ClientEPRScorecard() {
    const currentScore = 88
    const target = 80
    const circumference = 2 * Math.PI * 65
    const offset = circumference - (currentScore / 100) * circumference
    const recyclingRate = 76.4
    const carbonTonnes = (1248 * 0.76 * 0.42).toFixed(1)
    const creditValue = (parseFloat(carbonTonnes) * 600).toLocaleString('en-IN')

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>EPR Scorecard</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Extended Producer Responsibility compliance — FY 2025–26 · C&D Rules 2025</p>
                </div>
                <button onClick={generateCPCBReport} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: '#166534', color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}><Download size={14} /> CPCB Report PDF</button>
            </div>

            {/* Gauge + KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginBottom: 20 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e9f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="65" fill="none" stroke="#f0f2f5" strokeWidth="12" />
                        <circle cx="80" cy="80" r="65" fill="none" stroke={currentScore >= target ? '#10b981' : '#ef4444'}
                            strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset}
                            strokeLinecap="round" transform="rotate(-90 80 80)"
                            style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                        <text x="80" y="72" textAnchor="middle" fontSize="28" fontWeight="800" fill="#1a1a2e">{currentScore}%</text>
                        <text x="80" y="92" textAnchor="middle" fontSize="11" fill="#5a6478">EPR Score</text>
                    </svg>
                    <div style={{ marginTop: 12, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#e8f9f0', color: '#10b981' }}>
                        ✓ Above CPCB Target ({target}%)
                    </div>
                    <div style={{ fontSize: 12, color: '#5a6478', marginTop: 8 }}>FY 2025-26 · Q4 Progress</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                        { label: 'Total Waste Processed',  value: '1,248 T', sub: 'This financial year',       color: '#1a3263', icon: Leaf },
                        { label: 'Recycling Rate',         value: `${recyclingRate}%`, sub: '↑ 3.2% from Q3', color: '#10b981', icon: TrendingUp },
                        { label: 'Carbon Credits Earned',  value: `${carbonTonnes} t CO₂`, sub: `≈ ₹${creditValue} value`, color: '#166534', icon: Wind },
                        { label: 'Penalty Forecast',       value: '₹0',      sub: 'No penalties projected',   color: '#10b981', icon: AlertTriangle },
                    ].map(c => (
                        <div key={c.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', border: '1px solid #e5e9f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: 11.5, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase' }}>{c.label}</div>
                                <c.icon size={16} color={c.color} style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginTop: 4 }}>{c.value}</div>
                            <div style={{ fontSize: 12, color: '#5a6478', marginTop: 4 }}>{c.sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EPR Milestones */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Shield size={16} color="#166534" /> C&amp;D Rules 2025 — Milestone Progress
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {EPR_MILESTONES.map(ms => {
                        const barPct = Math.min((ms.achieved / ms.target) * 100, 100)
                        return (
                            <div key={ms.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                    <div>
                                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>{ms.label}</span>
                                        <span style={{ fontSize: 11, color: '#5a6478', marginLeft: 8 }}>{ms.rule}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{ms.achieved}% / {ms.target}%</span>
                                        <span style={{ fontSize: 10.5, fontWeight: 700, background: '#dcfce7', color: '#166534', borderRadius: 20, padding: '2px 9px' }}>✓ Exceeded</span>
                                    </div>
                                </div>
                                <div style={{ height: 9, background: '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
                                    <div style={{ width: `${barPct}%`, height: '100%', borderRadius: 5, background: 'linear-gradient(90deg,#16a34a,#22c55e)' }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>EPR Score Trend (6 Months)</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={monthlyEPR}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                            <XAxis dataKey="month" tick={{ fill: '#5a6478', fontSize: 12 }} />
                            <YAxis domain={[60, 100]} tick={{ fill: '#5a6478', fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e9f0' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Waste Category Breakdown</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie data={wasteBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                                    {wasteBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {wasteBreakdown.map(w => (
                                <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: w.color }} />
                                    <span style={{ color: '#5a6478' }}>{w.name}</span>
                                    <span style={{ fontWeight: 700, color: '#1a1a2e', marginLeft: 'auto' }}>{w.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
