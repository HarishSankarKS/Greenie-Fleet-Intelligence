import { useState, useMemo } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import {
    ShoppingBag, Plus, FileText, Download, X, AlertTriangle,
    Package, TrendingUp, IndianRupee, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react'
import { initialInventory, CATEGORY_COLORS, CATEGORY_HSN } from '../utils/siteInventory'

// ─── Helpers ────────────────────────────────────────────────────────────────

const INV_PREFIX = 'GRN-INV'
const GST_RATE = 18  // 9% CGST + 9% SGST

function nextInvoiceNo(invoices) {
    return `${INV_PREFIX}-${String(invoices.length + 1).padStart(4, '0')}`
}

function formatCurrency(val) {
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Sample Invoices ─────────────────────────────────────────────────────────

const sampleInvoices = [
    {
        invoiceNo: 'GRN-INV-0001', date: '2026-02-14', dueDate: '2026-03-14',
        buyer: 'R&D Recycling Plant Pvt Ltd', site: 'Ukkadam Sorting Yard', siteId: 'CBE-03',
        category: 'Concrete Rubble', qty: 20, rate: 850, gstPct: 18, status: 'Paid',
    },
    {
        invoiceNo: 'GRN-INV-0002', date: '2026-02-20', dueDate: '2026-03-20',
        buyer: 'Coimbatore Road Works Ltd', site: 'RS Puram C&D Site', siteId: 'CBE-01',
        category: 'Steel', qty: 3, rate: 3200, gstPct: 18, status: 'Pending',
    },
    {
        invoiceNo: 'GRN-INV-0003', date: '2026-03-01', dueDate: '2026-03-31',
        buyer: 'Lakshmi Construction Materials', site: 'Gandhipuram Collection Pt', siteId: 'CBE-02',
        category: 'Brick', qty: 10, rate: 620, gstPct: 18, status: 'Pending',
    },
    {
        invoiceNo: 'GRN-INV-0004', date: '2026-03-08', dueDate: '2026-04-07',
        buyer: 'SRM Infra Projects', site: 'Singanallur Depot', siteId: 'CBE-05',
        category: 'Sand & Aggregate', qty: 15, rate: 580, gstPct: 18, status: 'Draft',
    },
]

// ─── PDF Generator ────────────────────────────────────────────────────────────

function generateInvoicePDF(inv) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const subtotal = inv.qty * inv.rate
    const cgst = subtotal * (inv.gstPct / 2) / 100
    const sgst = subtotal * (inv.gstPct / 2) / 100
    const grand = subtotal + cgst + sgst

    // Header background
    doc.setFillColor(26, 50, 99)
    doc.rect(0, 0, pageW, 38, 'F')

    // Brand
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(255, 255, 255)
    doc.text('GREENIE', 14, 15)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(200, 169, 81)
    doc.text('Fleet & Waste Intelligence', 14, 21)

    // TAX INVOICE label
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.text('TAX INVOICE', pageW - 14, 15, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice No: ${inv.invoiceNo}`, pageW - 14, 22, { align: 'right' })
    doc.text(`Date: ${inv.date}`, pageW - 14, 27, { align: 'right' })
    doc.text(`Due: ${inv.dueDate}`, pageW - 14, 32, { align: 'right' })

    // Divider
    doc.setDrawColor(200, 169, 81)
    doc.setLineWidth(0.5)
    doc.line(14, 42, pageW - 14, 42)

    // Seller block
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(26, 50, 99)
    doc.text('SELLER', 14, 50)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(9)
    doc.text('Greenie Fleet Intelligence Pvt Ltd', 14, 56)
    doc.text('No. 12, Avinashi Road, Peelamedu,', 14, 61)
    doc.text('Coimbatore – 641 004, Tamil Nadu', 14, 66)
    doc.text('GSTIN: 33AABCG1234A1Z5', 14, 71)
    doc.text('Email: billing@greenie.ac.in', 14, 76)

    // Buyer block
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(26, 50, 99)
    doc.text('BILL TO', pageW / 2 + 10, 50)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(9)
    doc.text(inv.buyer, pageW / 2 + 10, 56)
    doc.text('Coimbatore, Tamil Nadu', pageW / 2 + 10, 61)
    doc.text('GSTIN: (As provided by buyer)', pageW / 2 + 10, 66)

    // Separator
    doc.setDrawColor(220, 225, 234)
    doc.setLineWidth(0.3)
    doc.line(14, 82, pageW - 14, 82)

    // Items table
    autoTable(doc, {
        startY: 86,
        head: [['S.No', 'Description of Goods', 'HSN Code', 'Qty (T)', 'Unit Rate (₹)', 'Amount (₹)']],
        body: [
            [
                '01',
                `${inv.category} — ${inv.site}`,
                CATEGORY_HSN[inv.category] || '3825',
                inv.qty.toFixed(2),
                Number(inv.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                Number(subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            ]
        ],
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [26, 50, 99], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        alternateRowStyles: { fillColor: [244, 245, 247] },
        margin: { left: 14, right: 14 },
        columnStyles: {
            0: { cellWidth: 12 },
            1: { cellWidth: 65 },
            2: { cellWidth: 22 },
            3: { cellWidth: 18, halign: 'right' },
            4: { cellWidth: 28, halign: 'right' },
            5: { cellWidth: 28, halign: 'right' },
        },
    })

    const afterTable = doc.lastAutoTable.finalY + 6

    // Tax summary box
    const boxX = pageW / 2 + 10
    const boxW = pageW - 14 - boxX
    doc.setFillColor(244, 245, 247)
    doc.roundedRect(boxX, afterTable, boxW, 42, 2, 2, 'F')

    const rowH = 8
    const labelX = boxX + 4
    const valX = pageW - 16

    const taxRows = [
        ['Sub-total', subtotal],
        [`CGST @ ${inv.gstPct / 2}%`, cgst],
        [`SGST @ ${inv.gstPct / 2}%`, sgst],
    ]

    let ty = afterTable + 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    taxRows.forEach(([label, val]) => {
        doc.text(label, labelX, ty)
        doc.text(Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 }), valX, ty, { align: 'right' })
        ty += rowH
    })

    // Grand total row
    doc.setDrawColor(200, 169, 81)
    doc.setLineWidth(0.4)
    doc.line(boxX + 2, ty - 2, pageW - 16, ty - 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(26, 50, 99)
    doc.text('GRAND TOTAL', labelX, ty + 5)
    doc.text(Number(grand).toLocaleString('en-IN', { minimumFractionDigits: 2 }), valX, ty + 5, { align: 'right' })

    // Terms
    const termY = afterTable + 52
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(26, 50, 99)
    doc.text('Terms & Conditions', 14, termY)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(8)
    doc.text([
        '1. Payment is due within 30 days of invoice date.',
        '2. Goods once sold are not returnable unless under dispute.',
        '3. Subject to Coimbatore jurisdiction.',
        '4. This is a computer-generated invoice and does not require a physical signature.',
    ], 14, termY + 6)

    // Signature block
    const signY = termY + 38
    doc.setDrawColor(200, 169, 81)
    doc.line(pageW - 14 - 55, signY, pageW - 14, signY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(26, 50, 99)
    doc.text('Authorised Signatory', pageW - 14 - 27, signY + 5, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text('Greenie Fleet Intelligence Pvt Ltd', pageW - 14 - 27, signY + 10, { align: 'center' })

    // Footer
    doc.setFillColor(244, 245, 247)
    doc.rect(0, 282, pageW, 15, 'F')
    doc.setFontSize(7.5)
    doc.setTextColor(130, 130, 130)
    doc.text('Greenie Fleet Intelligence Pvt Ltd  ·  billing@greenie.ac.in  ·  www.greenie.ac.in', pageW / 2, 289, { align: 'center' })

    // Manual Blob download — guaranteed to work in Vite/browser environments
    const pdfBlob = doc.output('blob')
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${inv.invoiceNo}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Marketplace() {
    const [inventory, setInventory] = useState(initialInventory)
    const [invoices, setInvoices] = useState(sampleInvoices)
    const [expandedSites, setExpandedSites] = useState({})
    const [filterSite, setFilterSite] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({
        siteId: '', category: '', qty: '', rate: '', gstPct: 18, buyer: '', dueDate: ''
    })
    const [formError, setFormError] = useState('')

    // Derived KPIs
    const totalStockTonnes = useMemo(() =>
        inventory.reduce((s, site) =>
            s + site.materials.reduce((m, mat) => m + mat.availableTonnes, 0), 0), [inventory])

    const revenueThisMonth = useMemo(() =>
        invoices
            .filter(inv => inv.date.startsWith('2026-03'))
            .reduce((s, inv) => {
                const sub = inv.qty * inv.rate
                return s + sub + sub * inv.gstPct / 100
            }, 0), [invoices])

    const activeListings = useMemo(() =>
        inventory.reduce((s, site) =>
            s + site.materials.filter(m => m.availableTonnes > 0).length, 0), [inventory])

    // Filtered invoices
    const filteredInvoices = invoices.filter(inv => {
        const siteMatch = filterSite === 'All' || inv.site === filterSite
        const statusMatch = filterStatus === 'All' || inv.status === filterStatus
        return siteMatch && statusMatch
    })

    // Form helpers
    const selectedSite = inventory.find(s => s.siteId === form.siteId)
    const availableMaterials = selectedSite
        ? selectedSite.materials.filter(m => m.availableTonnes > 0)
        : []
    const selectedMat = selectedSite?.materials.find(m => m.category === form.category)
    const maxQty = selectedMat ? selectedMat.availableTonnes : 0
    const isOutOfStock = form.category && selectedMat && selectedMat.availableTonnes === 0

    const subtotal = (parseFloat(form.qty) || 0) * (parseFloat(form.rate) || 0)
    const cgst = subtotal * (form.gstPct / 2) / 100
    const grandTotal = subtotal + cgst * 2

    function handleRaiseInvoice() {
        setFormError('')
        if (!form.siteId || !form.category || !form.qty || !form.rate || !form.buyer || !form.dueDate) {
            setFormError('Please fill in all required fields.')
            return
        }
        if (isOutOfStock) { setFormError('Selected material is out of stock.'); return }
        const qty = parseFloat(form.qty)
        if (qty <= 0 || qty > maxQty) {
            setFormError(`Quantity must be between 0.01 and ${maxQty} tonnes.`)
            return
        }
        const site = inventory.find(s => s.siteId === form.siteId)
        const newInv = {
            invoiceNo: nextInvoiceNo(invoices),
            date: new Date().toISOString().slice(0, 10),
            dueDate: form.dueDate,
            buyer: form.buyer,
            site: site.siteName,
            siteId: form.siteId,
            category: form.category,
            qty,
            rate: parseFloat(form.rate),
            gstPct: form.gstPct,
            status: 'Draft',
        }
        // Deduct stock
        setInventory(prev => prev.map(s => {
            if (s.siteId !== form.siteId) return s
            return {
                ...s,
                materials: s.materials.map(m =>
                    m.category === form.category
                        ? { ...m, availableTonnes: Math.max(0, m.availableTonnes - qty) }
                        : m
                )
            }
        }))
        setInvoices(prev => [newInv, ...prev])
        setShowModal(false)
        setForm({ siteId: '', category: '', qty: '', rate: '', gstPct: 18, buyer: '', dueDate: '' })
    }

    function toggleSite(id) {
        setExpandedSites(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const statusColors = { Paid: 'completed', Pending: 'pending', Draft: 'idle' }

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Waste Marketplace</div>
                    <div className="page-subtitle">
                        Sell C&amp;D waste materials from collection sites · Billing gated by live site stock
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={15} /> Raise Invoice
                </button>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 28 }}>
                {[
                    { label: 'Active Stock Listings', value: activeListings, color: 'green', icon: Package, sub: 'materials with stock > 0' },
                    { label: 'Total Stock Available', value: `${totalStockTonnes.toFixed(1)} T`, color: 'teal', icon: TrendingUp, sub: 'across all sites' },
                    { label: 'Revenue This Month', value: formatCurrency(revenueThisMonth), color: 'amber', icon: IndianRupee, sub: 'incl. GST' },
                    { label: 'Invoices Raised', value: invoices.length, color: 'blue', icon: FileText, sub: 'all time' },
                ].map(({ label, value, color, icon: Icon, sub }) => (
                    <div key={label} className={`kpi-card ${color}`}>
                        <div className="kpi-header">
                            <span className="kpi-label">{label}</span>
                            <div className={`kpi-icon ${color}`}><Icon size={18} /></div>
                        </div>
                        <div className="kpi-value" style={{ fontSize: 24 }}>{value}</div>
                        <div className="kpi-sub">{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Site Stock Overview ── */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <span className="card-title">Site Stock Overview</span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Live material availability per site — Out of Stock materials cannot be billed
                    </span>
                </div>
                <div className="card-body" style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {inventory.map(site => {
                        const isExpanded = expandedSites[site.siteId]
                        const totalAvail = site.materials.reduce((s, m) => s + m.availableTonnes, 0)
                        const hasStock = totalAvail > 0
                        return (
                            <div key={site.siteId} style={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 8,
                                overflow: 'hidden',
                            }}>
                                {/* Site Header Row */}
                                <div
                                    onClick={() => toggleSite(site.siteId)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 16px', cursor: 'pointer',
                                        background: isExpanded ? 'rgba(26,50,99,0.04)' : '#fff',
                                        userSelect: 'none',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: hasStock ? 'var(--color-success)' : 'var(--color-danger)',
                                            flexShrink: 0,
                                        }} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{site.siteName}</div>
                                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{site.location}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>
                                                {totalAvail.toFixed(1)} T
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                                {site.materials.filter(m => m.availableTonnes > 0).length} / {site.materials.length} materials
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
                                    </div>
                                </div>

                                {/* Expanded Material Rows */}
                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, background: '#fafbfc' }}>
                                        {site.materials.map(mat => {
                                            const pct = mat.maxTonnes > 0 ? (mat.availableTonnes / mat.maxTonnes) * 100 : 0
                                            const outOfStock = mat.availableTonnes === 0
                                            return (
                                                <div key={mat.category} style={{
                                                    background: '#fff', border: '1px solid var(--color-border)',
                                                    borderRadius: 8, padding: '12px 14px',
                                                    opacity: outOfStock ? 0.7 : 1,
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <span style={{
                                                                width: 10, height: 10, borderRadius: 2,
                                                                background: CATEGORY_COLORS[mat.category] || '#ccc',
                                                                display: 'inline-block', flexShrink: 0
                                                            }} />
                                                            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{mat.category}</span>
                                                        </div>
                                                        {outOfStock
                                                            ? <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'var(--color-danger)', borderRadius: 20, padding: '2px 8px' }}>Out of Stock</span>
                                                            : <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--color-success)' }}>{mat.availableTonnes}T avail</span>
                                                        }
                                                    </div>
                                                    <div style={{ height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                                                        <div style={{
                                                            width: `${pct}%`, height: '100%', borderRadius: 4,
                                                            background: outOfStock ? 'var(--color-danger)' : CATEGORY_COLORS[mat.category] || 'var(--color-primary)',
                                                            transition: 'width 0.3s',
                                                        }} />
                                                    </div>
                                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                                                        {mat.availableTonnes} / {mat.maxTonnes} tonnes
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Billing & Invoices ── */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Billing &amp; Invoices</span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            value={filterSite}
                            onChange={e => setFilterSite(e.target.value)}
                        >
                            <option value="All">All Sites</option>
                            {inventory.map(s => <option key={s.siteId} value={s.siteName}>{s.siteName}</option>)}
                        </select>
                        <select
                            className="form-select"
                            style={{ padding: '6px 10px', fontSize: 12 }}
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice No.</th>
                                <th>Buyer Company</th>
                                <th>Site</th>
                                <th>Material</th>
                                <th>Qty (T)</th>
                                <th>Rate (₹/T)</th>
                                <th>GST</th>
                                <th>Grand Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.length === 0 && (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 24 }}>
                                        No invoices match the selected filters.
                                    </td>
                                </tr>
                            )}
                            {filteredInvoices.map(inv => {
                                const sub = inv.qty * inv.rate
                                const gstAmt = sub * inv.gstPct / 100
                                const grand = sub + gstAmt
                                return (
                                    <tr key={inv.invoiceNo}>
                                        <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{inv.invoiceNo}</strong></td>
                                        <td style={{ fontWeight: 500 }}>{inv.buyer}</td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{inv.site}</td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                                fontSize: 12, fontWeight: 500,
                                            }}>
                                                <span style={{
                                                    width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                                                    background: CATEGORY_COLORS[inv.category] || '#ccc'
                                                }} />
                                                {inv.category}
                                            </span>
                                        </td>
                                        <td>{inv.qty.toFixed(2)}</td>
                                        <td>{formatCurrency(inv.rate)}</td>
                                        <td style={{ fontSize: 12 }}>{inv.gstPct}% ({formatCurrency(gstAmt)})</td>
                                        <td style={{ fontWeight: 700 }}>{formatCurrency(grand)}</td>
                                        <td>
                                            <span className={`status-badge ${statusColors[inv.status] || 'idle'}`}>
                                                <span className="dot" />{inv.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline btn-sm"
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px' }}
                                                onClick={() => generateInvoicePDF(inv)}
                                                title="Download PDF Invoice"
                                            >
                                                <Download size={13} /> PDF
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Raise Invoice Modal ── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                                Raise Invoice
                            </span>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
                        </div>

                        <div className="modal-body" style={{ padding: '20px 24px' }}>
                            {formError && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.2)',
                                    borderRadius: 6, padding: '10px 14px', marginBottom: 14,
                                    color: 'var(--color-danger)', fontSize: 13,
                                }}>
                                    <AlertTriangle size={15} /> {formError}
                                </div>
                            )}

                            <div className="form-grid" style={{ gap: 16 }}>
                                {/* Buyer Company */}
                                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                    <label className="form-label">Buyer Company Name *</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. R&D Recycling Plant Pvt Ltd"
                                        value={form.buyer}
                                        onChange={e => setForm(p => ({ ...p, buyer: e.target.value }))}
                                    />
                                </div>

                                {/* Site */}
                                <div className="form-group">
                                    <label className="form-label">Collection Site *</label>
                                    <select
                                        className="form-select"
                                        value={form.siteId}
                                        onChange={e => setForm(p => ({ ...p, siteId: e.target.value, category: '' }))}
                                    >
                                        <option value="">— Select Site —</option>
                                        {inventory.map(s => (
                                            <option key={s.siteId} value={s.siteId}>{s.siteName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Material */}
                                <div className="form-group">
                                    <label className="form-label">Material *</label>
                                    <select
                                        className="form-select"
                                        value={form.category}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value, qty: '' }))}
                                        disabled={!form.siteId}
                                    >
                                        <option value="">— Select Material —</option>
                                        {selectedSite?.materials.map(m => (
                                            <option
                                                key={m.category}
                                                value={m.category}
                                                disabled={m.availableTonnes === 0}
                                            >
                                                {m.category} {m.availableTonnes === 0 ? '(Out of Stock)' : `— ${m.availableTonnes}T avail`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Out of stock warning */}
                                {isOutOfStock && (
                                    <div style={{
                                        gridColumn: '1/-1',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.18)',
                                        borderRadius: 6, padding: '8px 12px',
                                        color: 'var(--color-danger)', fontSize: 12.5, fontWeight: 500
                                    }}>
                                        <AlertTriangle size={14} />
                                        <strong>Out of Stock</strong> — No {form.category} available at this site. Billing is blocked.
                                    </div>
                                )}

                                {/* Available stock hint */}
                                {form.category && !isOutOfStock && selectedMat && (
                                    <div style={{
                                        gridColumn: '1/-1',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: 'rgba(26,122,74,0.07)', border: '1px solid rgba(26,122,74,0.2)',
                                        borderRadius: 6, padding: '8px 12px',
                                        color: 'var(--color-success)', fontSize: 12.5,
                                    }}>
                                        <CheckCircle size={14} />
                                        <strong>{selectedMat.availableTonnes} tonnes</strong>&nbsp;of {form.category} available at this site.
                                    </div>
                                )}

                                {/* Qty */}
                                <div className="form-group">
                                    <label className="form-label">Quantity (Tonnes) *</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="0.01"
                                        max={maxQty}
                                        step="0.01"
                                        placeholder={maxQty ? `Max ${maxQty} T` : 'Select site & material'}
                                        value={form.qty}
                                        disabled={!form.category || isOutOfStock}
                                        onChange={e => setForm(p => ({ ...p, qty: e.target.value }))}
                                    />
                                </div>

                                {/* Rate */}
                                <div className="form-group">
                                    <label className="form-label">Agreed Rate (₹ / Tonne) *</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 850"
                                        value={form.rate}
                                        disabled={!form.category || isOutOfStock}
                                        onChange={e => setForm(p => ({ ...p, rate: e.target.value }))}
                                    />
                                </div>

                                {/* GST */}
                                <div className="form-group">
                                    <label className="form-label">GST %</label>
                                    <select
                                        className="form-select"
                                        value={form.gstPct}
                                        onChange={e => setForm(p => ({ ...p, gstPct: Number(e.target.value) }))}
                                    >
                                        <option value={5}>5%</option>
                                        <option value={12}>12%</option>
                                        <option value={18}>18% (standard)</option>
                                        <option value={28}>28%</option>
                                    </select>
                                </div>

                                {/* Due Date */}
                                <div className="form-group">
                                    <label className="form-label">Payment Due Date *</label>
                                    <input
                                        className="form-input"
                                        type="date"
                                        value={form.dueDate}
                                        onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                                    />
                                </div>

                                {/* Live Total Preview */}
                                {subtotal > 0 && (
                                    <div style={{
                                        gridColumn: '1/-1',
                                        background: 'rgba(26,50,99,0.04)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 8, padding: '14px 16px',
                                    }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Invoice Preview
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {[
                                                ['Sub-total', formatCurrency(subtotal)],
                                                [`CGST (${form.gstPct / 2}%)`, formatCurrency(cgst)],
                                                [`SGST (${form.gstPct / 2}%)`, formatCurrency(cgst)],
                                            ].map(([label, val]) => (
                                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                                    <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                                                    <span>{val}</span>
                                                </div>
                                            ))}
                                            <div style={{ borderTop: '1.5px solid var(--color-border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Grand Total</span>
                                                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-primary)' }}>{formatCurrency(grandTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer" style={{ padding: '14px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button className="btn btn-outline" onClick={() => { setShowModal(false); setFormError('') }}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleRaiseInvoice}
                                disabled={isOutOfStock}
                            >
                                <FileText size={15} /> Raise Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
