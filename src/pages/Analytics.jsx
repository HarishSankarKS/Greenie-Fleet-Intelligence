import { useState } from 'react'
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Download, TrendingUp, Calendar, Shield, AlertTriangle, CheckCircle, Award, Leaf } from 'lucide-react'

// ─── Existing Data ────────────────────────────────────────────────────────────

const monthly = [
    { month: 'Sep', collections: 310, waste: 42, revenue: 84200 },
    { month: 'Oct', collections: 380, waste: 55, revenue: 102000 },
    { month: 'Nov', collections: 420, waste: 61, revenue: 113500 },
    { month: 'Dec', collections: 395, waste: 58, revenue: 107000 },
    { month: 'Jan', collections: 450, waste: 67, revenue: 121000 },
    { month: 'Feb', collections: 488, waste: 72, revenue: 131500 },
]

const wasteByType = [
    { type: 'Concrete', tons: 280 },
    { type: 'Rubble', tons: 195 },
    { type: 'Mixed C&D', tons: 320 },
    { type: 'Metals', tons: 110 },
    { type: 'Wood', tons: 85 },
    { type: 'Other', tons: 65 },
]

const sitePerf = [
    { site: 'North TS — Thudiyalur',    color: '#1a3263', zone: 'North', efficiency: 96, collections: 148, turnaround: '2.8d' },
    { site: 'South TS — Singanallur',   color: '#0f766e', zone: 'South', efficiency: 91, collections: 182, turnaround: '3.1d' },
    { site: 'East TS — Irugur',         color: '#c8a951', zone: 'East',  efficiency: 94, collections: 160, turnaround: '2.4d' },
    { site: 'West TS — Kuniyamuthur',   color: '#6b7280', zone: 'West',  efficiency: 82, collections: 62,  turnaround: '3.8d' },
]

// ─── EPR Data ─────────────────────────────────────────────────────────────────

// Total construction material tonnage handled regionally (basis for EPR %)
const TOTAL_CONSTRUCTION_MATERIAL_TONNES = 4200   // tonnes, FY 2025-26 estimate
const TONNES_RECYCLED = 355   // from KPI — actual recycled/diverted tonnes

// C&D Rules 2025 mandatory recycled content targets (% of total construction material)
const EPR_MILESTONES = [
    { year: '2026–28', targetPct: 5,  label: 'Phase 1', rule: 'C&D Rules 2025 — Initial Target' },
    { year: '2028–30', targetPct: 15, label: 'Phase 2', rule: 'C&D Rules 2025 — Scale-Up Target' },
    { year: '2030+',   targetPct: 25, label: 'Phase 3', rule: 'C&D Rules 2025 — Mandatory Target (Roads)' },
]

// EPR certificate data per station
const STATION_EPR = [
    { siteId: 'TS-N', site: 'North Transfer Station — Thudiyalur',   color: '#1a3263', recycled: 142, total: 550, certNo: 'GRN-EPR-2026-TS-N' },
    { siteId: 'TS-S', site: 'South Transfer Station — Singanallur',  color: '#0f766e', recycled: 178, total: 640, certNo: 'GRN-EPR-2026-TS-S' },
    { siteId: 'TS-E', site: 'East Transfer Station — Irugur',        color: '#c8a951', recycled: 156, total: 500, certNo: 'GRN-EPR-2026-TS-E' },
    { siteId: 'TS-W', site: 'West Transfer Station — Kuniyamuthur',  color: '#6b7280', recycled: 58,  total: 280, certNo: 'GRN-EPR-2026-TS-W' },
]

// Voluntary carbon credit rate (₹/tonne CO₂ avoided — C&D diversion factor ~0.42 t CO₂/t waste)
const CO2_FACTOR = 0.42
const CARBON_CREDIT_RATE = 600  // ₹/tonne CO₂

function calcEPRPct(recycled, total) {
    return total > 0 ? ((recycled / total) * 100).toFixed(1) : 0
}

// ─── PDF: EPR Certificate ──────────────────────────────────────────────────────
function generateEPRCertificate(station) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const eprPct = ((station.recycled / station.total) * 100).toFixed(1)
    const today = new Date().toISOString().slice(0, 10)

    // Header
    doc.setFillColor(22, 101, 52)
    doc.rect(0, 0, pageW, 42, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(255, 255, 255)
    doc.text('GREENIE', 14, 16)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(187, 247, 208)
    doc.text('Fleet & Waste Intelligence · EPR Division', 14, 23)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(255, 255, 255)
    doc.text('EPR COMPLIANCE CERTIFICATE', pageW - 14, 16, { align: 'right' })
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.text(`Cert No: ${station.certNo}`, pageW - 14, 23, { align: 'right' })
    doc.text(`Issued: ${today}`, pageW - 14, 29, { align: 'right' })
    doc.text('FY 2025–26 · C&D Rules 2025', pageW - 14, 35, { align: 'right' })

    // Gold divider
    doc.setDrawColor(200, 169, 81)
    doc.setLineWidth(0.5)
    doc.line(14, 47, pageW - 14, 47)

    // Title block
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(22, 101, 52)
    doc.text('CERTIFICATE OF EPR TARGET COMPLIANCE', pageW / 2, 57, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    doc.text('Issued under the Environment (Construction and Demolition) Waste Management Rules, 2025', pageW / 2, 64, { align: 'center' })

    doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.2)
    doc.line(14, 70, pageW - 14, 70)

    // Station details
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 50, 99)
    doc.text('TRANSFER STATION DETAILS', 14, 79)
    const details = [
        ['Station Name', station.site],
        ['Station ID', station.siteId],
        ['Operating Entity', 'Greenie Fleet Intelligence Pvt Ltd'],
        ['Region', 'Coimbatore, Tamil Nadu'],
        ['GSTIN', '33AABCG1234A1Z5'],
    ]
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(40, 40, 40)
    let dy = 88
    details.forEach(([label, val]) => {
        doc.setFont('helvetica', 'bold'); doc.text(`${label}:`, 14, dy)
        doc.setFont('helvetica', 'normal'); doc.text(val, 70, dy)
        dy += 8
    })

    // Metrics table
    doc.setDrawColor(230, 230, 230); doc.setLineWidth(0.2)
    doc.line(14, dy + 4, pageW - 14, dy + 4)

    autoTable(doc, {
        startY: dy + 8,
        head: [['Metric', 'Value', 'Status']],
        body: [
            ['Total C&D Waste Handled (FY 2025–26)', `${station.total} tonnes`, '✓ Verified'],
            ['Tonnes Recycled / Diverted', `${station.recycled} tonnes`, '✓ Verified'],
            ['EPR Recycling Rate Achieved', `${eprPct}%`, eprPct >= 5 ? '✓ Compliant' : '⚠ Below Target'],
            ['Phase 1 Mandate (2026–28)', '5% minimum', eprPct >= 5 ? '✓ Met' : '✗ Pending'],
            ['Carbon Credits Earned (est.)', `${(station.recycled * CO2_FACTOR).toFixed(1)} t CO₂`, '— Voluntary'],
        ],
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [22, 101, 52], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 14, right: 14 },
        columnStyles: { 0: { cellWidth: 95 }, 1: { cellWidth: 40 }, 2: { cellWidth: 42 } },
    })

    const afterTable = doc.lastAutoTable.finalY + 10

    // Compliance declaration
    doc.setFillColor(240, 253, 244)
    doc.roundedRect(14, afterTable, pageW - 28, 28, 2, 2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(22, 101, 52)
    doc.text('COMPLIANCE DECLARATION', 20, afterTable + 8)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(40, 40, 40)
    doc.text(
        `This certifies that ${station.site} (${station.siteId}) has achieved an EPR recycling rate of ${eprPct}%`,
        20, afterTable + 16
    )
    doc.text(
        'for FY 2025–26, as mandated by the Environment (C&D) Waste Management Rules, 2025.',
        20, afterTable + 22
    )

    // Signature
    const signY = afterTable + 42
    doc.setDrawColor(200, 169, 81); doc.setLineWidth(0.4)
    doc.line(pageW - 14 - 60, signY, pageW - 14, signY)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(26, 50, 99)
    doc.text('EPR Officer — Greenie', pageW - 14 - 30, signY + 5, { align: 'center' })
    doc.setFont('helvetica', 'normal'); doc.text('Greenie Fleet Intelligence Pvt Ltd', pageW - 14 - 30, signY + 10, { align: 'center' })

    // Footer
    doc.setFillColor(240, 253, 244)
    doc.rect(0, 282, pageW, 15, 'F')
    doc.setFontSize(7.5); doc.setTextColor(80, 80, 80)
    doc.text('Valid for CPCB EPR Portal Submission · Greenie Fleet Intelligence Pvt Ltd · compliance@greenie.ac.in', pageW / 2, 289, { align: 'center' })

    const pdfBlob = doc.output('blob')
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${station.certNo}.pdf`
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Analytics() {
    const [eprTab, setEprTab] = useState('overview')

    const currentEPRPct = ((TONNES_RECYCLED / TOTAL_CONSTRUCTION_MATERIAL_TONNES) * 100)
    const phase1Target = EPR_MILESTONES[0].targetPct
    const compliant = currentEPRPct >= phase1Target
    const finePerTonne = TOTAL_CONSTRUCTION_MATERIAL_TONNES * (phase1Target / 100) * 800 // ₹800/T penalty rate
    const fineAvoided = compliant ? finePerTonne : 0
    const carbonTonnes = TONNES_RECYCLED * CO2_FACTOR
    const carbonCredits = carbonTonnes * CARBON_CREDIT_RATE

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Analytics &amp; Reports</div>
                    <div className="page-subtitle">Performance metrics · Waste data · EPR compliance · Operational insights</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline"><Calendar size={14} /> Date Range</button>
                    <button className="btn btn-primary"><Download size={14} /> Export Report</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: 'Total Collections', value: '2,443', change: '+18%', color: 'teal' },
                    { label: 'Total Waste Collected', value: '355 T', change: '+12%', color: 'green' },
                    { label: 'Avg. per Site/Day', value: '14.2', change: '+5%', color: 'blue' },
                    { label: 'Revenue Generated', value: '₹659K', change: '+22%', color: 'amber' },
                ].map(k => (
                    <div key={k.label} className={`kpi-card ${k.color}`}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value">{k.value}</div>
                        <div className="kpi-footer">
                            <span className="kpi-change up"><TrendingUp size={12} /> {k.change}</span>
                            <span className="kpi-sub">vs last 6 months</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="card">
                    <div className="card-header"><span className="card-title">Monthly Collections Trend</span></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={monthly}>
                                <defs>
                                    <linearGradient id="colG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="collections" stroke="#0f766e" strokeWidth={2.5} fill="url(#colG)" name="Collections" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span className="card-title">Waste by Type (Tons)</span></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={wasteByType} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="tons" fill="#0f766e" radius={[0, 4, 4, 0]} name="Tons" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

                <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <span className="card-title">Transfer Station Performance Comparison</span>
                    <button className="btn btn-outline btn-sm"><Download size={13} /> Export CSV</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Transfer Station</th>
                                <th>Zone</th>
                                <th>Total Pickups (T)</th>
                                <th>Efficiency Score</th>
                                <th>Avg Turnaround</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sitePerf.map(row => (
                                <tr key={row.site}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: row.color, display: 'inline-block', flexShrink: 0 }} />
                                            <span style={{ fontWeight: 600 }}>{row.site}</span>
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: 11.5, fontWeight: 700, color: row.color }}>{row.zone}</span></td>
                                    <td style={{ fontWeight: 700 }}>{row.collections}T</td>
                                    <td>{row.efficiency}%</td>
                                    <td><span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(row.turnaround) < 3 ? '#10b981' : parseFloat(row.turnaround) < 4 ? '#f59e0b' : '#ef4444' }}>{row.turnaround}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ flex: 1, height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${row.efficiency}%`, height: '100%', borderRadius: 4,
                                                    background: row.efficiency >= 90 ? '#10b981' : row.efficiency >= 80 ? '#f59e0b' : '#ef4444'
                                                }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, minWidth: 35 }}>{row.efficiency}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                EPR COMPLIANCE TRACKER
            ══════════════════════════════════════════════════════════════════ */}
            <div className="card">
                {/* EPR Header */}
                <div className="card-header" style={{ borderBottom: '2px solid #dcfce7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={17} color="#166534" />
                        </div>
                        <div>
                            <span className="card-title">EPR Compliance Tracker</span>
                            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 1 }}>
                                Environment (C&amp;D) Waste Management Rules, 2025 · FY 2025–26
                            </div>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div style={{ display: 'flex', background: '#f4f5f7', borderRadius: 8, padding: 3, gap: 2 }}>
                        {['overview', 'stations'].map(t => (
                            <button key={t} onClick={() => setEprTab(t)}
                                style={{
                                    padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                    fontSize: 12, fontWeight: 600,
                                    background: eprTab === t ? '#fff' : 'transparent',
                                    color: eprTab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    boxShadow: eprTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                                    transition: 'all 0.15s',
                                }}>
                                {t === 'overview' ? 'Overview' : 'By Station'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="card-body" style={{ padding: '20px 24px' }}>

                    {eprTab === 'overview' && (
                        <>
                            {/* Compliance status banner */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '14px 18px', borderRadius: 10, marginBottom: 24,
                                background: compliant ? '#f0fdf4' : '#fef2f2',
                                border: `1.5px solid ${compliant ? '#bbf7d0' : '#fecaca'}`,
                            }}>
                                {compliant
                                    ? <CheckCircle size={22} color="#16a34a" />
                                    : <AlertTriangle size={22} color="#dc2626" />
                                }
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: compliant ? '#15803d' : '#dc2626' }}>
                                        {compliant ? '✓ Phase 1 EPR Target Met' : '⚠ Phase 1 EPR Target Not Yet Met'}
                                    </div>
                                    <div style={{ fontSize: 12.5, color: compliant ? '#166534' : '#b91c1c', marginTop: 2 }}>
                                        Current rate: <strong>{currentEPRPct.toFixed(1)}%</strong> of construction material recycled ·
                                        Phase 1 mandate: <strong>5%</strong> · Verified by GREENIE Edge AI
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: compliant ? '#16a34a' : '#dc2626' }}>{currentEPRPct.toFixed(1)}%</div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{TONNES_RECYCLED}T / {TOTAL_CONSTRUCTION_MATERIAL_TONNES}T</div>
                                </div>
                            </div>

                            {/* Milestone progress */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 14 }}>
                                    Regulatory Milestones — C&amp;D Rules 2025
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {EPR_MILESTONES.map((ms) => {
                                        const achieved = currentEPRPct >= ms.targetPct
                                        const barPct = Math.min((currentEPRPct / ms.targetPct) * 100, 100)
                                        return (
                                            <div key={ms.year}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                    <div>
                                                        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-text)' }}>
                                                            {ms.label} · {ms.year}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 8 }}>{ms.rule}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontSize: 13, fontWeight: 700, color: achieved ? '#16a34a' : 'var(--color-text-muted)' }}>
                                                            {currentEPRPct.toFixed(1)}% / {ms.targetPct}%
                                                        </span>
                                                        {achieved
                                                            ? <span style={{ fontSize: 10.5, fontWeight: 700, background: '#dcfce7', color: '#166534', borderRadius: 20, padding: '2px 9px' }}>✓ Met</span>
                                                            : <span style={{ fontSize: 10.5, fontWeight: 700, background: '#fef3c7', color: '#92400e', borderRadius: 20, padding: '2px 9px' }}>Pending</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div style={{ height: 10, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                                                    <div style={{
                                                        width: `${barPct}%`, height: '100%', borderRadius: 6,
                                                        background: achieved ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)',
                                                        transition: 'width 0.4s ease',
                                                    }} />
                                                    {/* Target line */}
                                                    <div style={{
                                                        position: 'absolute', top: 0, left: '100%', height: '100%',
                                                        width: 2, background: '#dc2626', opacity: achieved ? 0 : 1,
                                                    }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Summary KPIs */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                                {[
                                    {
                                        label: 'EPR Credits Earned',
                                        value: `${(TONNES_RECYCLED * CO2_FACTOR).toFixed(0)} t CO₂`,
                                        sub: `≈ ₹${(carbonCredits / 1000).toFixed(0)}K carbon credit value`,
                                        icon: Leaf, bg: '#f0fdf4', color: '#166534', border: '#bbf7d0',
                                    },
                                    {
                                        label: 'Fine Avoided (est.)',
                                        value: compliant ? `₹${(fineAvoided / 100000).toFixed(1)}L` : '₹0',
                                        sub: compliant ? 'Non-compliance penalty avoided (₹800/T)' : 'Compliance needed to avoid penalty',
                                        icon: Shield, bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe',
                                    },
                                    {
                                        label: 'Recycling Rate',
                                        value: `${currentEPRPct.toFixed(1)}%`,
                                        sub: `${TONNES_RECYCLED}T recycled of ${TOTAL_CONSTRUCTION_MATERIAL_TONNES}T handled`,
                                        icon: Award, bg: '#fefce8', color: '#854d0e', border: '#fde68a',
                                    },
                                ].map(({ label, value, sub, icon: Icon, bg, color, border }) => (
                                    <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <Icon size={15} color={color} />
                                            <span style={{ fontSize: 11.5, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                                        </div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{sub}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {eprTab === 'stations' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                                EPR recycling rates per transfer station · Download individual CPCB-ready certificates
                            </div>
                            {STATION_EPR.map(station => {
                                const pct = parseFloat(calcEPRPct(station.recycled, station.total))
                                const ok = pct >= phase1Target
                                return (
                                    <div key={station.siteId} style={{
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        border: '1px solid var(--color-border)', borderRadius: 10,
                                        padding: '14px 16px', background: '#fff',
                                    }}>
                                        {/* Status dot */}
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: ok ? '#16a34a' : '#f59e0b', flexShrink: 0 }} />

                                        {/* Station info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                <div>
                                                    <span style={{ fontWeight: 600, fontSize: 13 }}>{station.site}</span>
                                                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 8 }}>{station.siteId}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: ok ? '#16a34a' : '#f59e0b' }}>{pct}%</span>
                                                    <span style={{
                                                        fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                                                        background: ok ? '#dcfce7' : '#fef3c7',
                                                        color: ok ? '#166534' : '#92400e',
                                                    }}>{ok ? '✓ Compliant' : 'Below 5%'}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ flex: 1, height: 7, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${Math.min(pct * 4, 100)}%`, height: '100%', borderRadius: 4,
                                                        background: ok ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)',
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                                                    {station.recycled}T / {station.total}T · Cert: {station.certNo}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Certificate button */}
                                        <button
                                            className="btn btn-outline btn-sm"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', flexShrink: 0, borderColor: '#bbf7d0', color: '#166534' }}
                                            onClick={() => generateEPRCertificate(station)}
                                        >
                                            <Award size={13} /> Certificate PDF
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
