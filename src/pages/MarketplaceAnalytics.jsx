import { useState, useMemo } from 'react'
import {
    BarChart, Bar, AreaChart, Area, LineChart, Line,
    PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import {
    TrendingUp, IndianRupee, FileText, Package, Edit2, X,
    AlertTriangle, CheckCircle, Lock, Zap, BarChart2, Clock,
    Download, ShieldCheck, ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react'
import {
    revenueByMaterial, revenueByZone, gmvTrend, GMV_MONTHLY_TARGET,
    turnoverData, topBuyers, soldVsAvailable, initialPricing,
    priceTrend, informalBaseline, complianceData, summaryKPIs
} from '../utils/analyticsData'
import { initialInventory, CATEGORY_COLORS } from '../utils/siteInventory'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(val, compact = false) {
    if (compact && val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' L'
    if (compact && val >= 1000) return '₹' + (val / 1000).toFixed(1) + 'K'
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0 })
}

function premiumPct(price, baseline) {
    return (((price - baseline) / baseline) * 100).toFixed(1)
}

function premiumColor(pct) {
    const p = parseFloat(pct)
    if (p >= 10) return 'var(--color-success)'
    if (p >= 5)  return 'var(--color-warning)'
    return 'var(--color-danger)'
}

function daysColor(d) {
    if (d < 4) return '#10b981'
    if (d < 7) return '#f59e0b'
    return '#ef4444'
}

function daysUntil(dateStr) {
    const diff = new Date(dateStr) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const MATERIAL_COLORS = {
    'Concrete Rubble': '#6b7280', Steel: '#3b82f6', Brick: '#ef4444',
    Timber: '#92400e', Plastic: '#8b5cf6', Glass: '#06b6d4',
}

const ZONE_COLORS = ['#1a3263', '#0f766e', '#c8a951', '#6b7280']

const TABS = ['Revenue & Sales', 'Inventory & Turnover', 'Pricing Control']

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = '₹' }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 8, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>{label}</div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: 'inline-block' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>{p.name}:</span>
                    <span style={{ fontWeight: 600 }}>{prefix}{Number(p.value).toLocaleString('en-IN')}</span>
                </div>
            ))}
        </div>
    )
}

// ─── TAB 1: Revenue & Sales ───────────────────────────────────────────────────
function RevenueTab() {
    const materialKeys = ['Concrete Rubble', 'Steel', 'Brick', 'Timber', 'Plastic', 'Glass']
    const revenueChange = (((summaryKPIs.revenueThisMonth - summaryKPIs.revenueLastMonth) / summaryKPIs.revenueLastMonth) * 100).toFixed(1)
    const gmvPct = ((summaryKPIs.gmvAllTime / 2500000) * 100).toFixed(1)

    // Calculated revenue split (tipping fee + material sales)
    const tippingRev = 142800
    const materialRev = summaryKPIs.revenueThisMonth - tippingRev
    const totalRev = summaryKPIs.revenueThisMonth
    const tipPct = totalRev > 0 ? ((tippingRev / totalRev) * 100).toFixed(0) : 0
    const matPct = totalRev > 0 ? (100 - tipPct) : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* ── Revenue Split Banner + Donut Chart ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 16, alignItems: 'stretch' }}>
                {/* Split Banner */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
                    borderRadius: 12, overflow: 'hidden', border: '1.5px solid #e5e9f0',
                }}>
                    {/* Tipping Inbound */}
                    <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', padding: '18px 22px', borderRight: '1px solid #bbf7d0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <ArrowDownToLine size={16} color="#166534" />
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipping Revenue — Inbound</span>
                            <span style={{ fontSize: 10.5, background: '#bbf7d0', color: '#166534', borderRadius: 20, padding: '1px 8px', fontWeight: 700 }}>GRN-TIP</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#166534' }}>{formatCurrency(tippingRev, true)}</div>
                        <div style={{ fontSize: 12, color: '#166534', opacity: 0.75, marginTop: 4 }}>
                            {tipPct}% of total · ₹400/T avg · Contractors pay Greenie
                        </div>
                        <div style={{ marginTop: 10, height: 6, background: '#bbf7d0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${tipPct}%`, height: '100%', background: 'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius: 4 }} />
                        </div>
                    </div>
                    {/* Material Sales Outbound */}
                    <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', padding: '18px 22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <ArrowUpFromLine size={16} color="#1e40af" />
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material Sales — Outbound</span>
                            <span style={{ fontSize: 10.5, background: '#bfdbfe', color: '#1e40af', borderRadius: 20, padding: '1px 8px', fontWeight: 700 }}>GRN-INV</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#1e40af' }}>{formatCurrency(materialRev, true)}</div>
                        <div style={{ fontSize: 12, color: '#1e40af', opacity: 0.75, marginTop: 4 }}>
                            {matPct}% of total · Recycled materials sold to builders
                        </div>
                        <div style={{ marginTop: 10, height: 6, background: '#bfdbfe', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${matPct}%`, height: '100%', background: 'linear-gradient(90deg,#2563eb,#60a5fa)', borderRadius: 4 }} />
                        </div>
                    </div>
                </div>

                {/* Revenue Composition Donut */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e5e9f0', padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>Revenue Composition</div>
                    <div style={{ fontSize: 11.5, color: '#5a6478', marginBottom: 12 }}>Three Greenie revenue streams · This month</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Tipping Fees', value: tippingRev, pct: tipPct },
                                        { name: 'Material Sales', value: materialRev, pct: matPct },
                                        { name: 'EPR Credits', value: Math.round(totalRev * 0.04), pct: 4 },
                                    ]}
                                    cx="50%" cy="50%" innerRadius={46} outerRadius={70}
                                    dataKey="value" paddingAngle={3}
                                >
                                    <Cell fill="#16a34a" />
                                    <Cell fill="#2563eb" />
                                    <Cell fill="#c8a951" />
                                </Pie>
                                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                            {[
                                { label: 'Tipping Fees',   pct: tipPct, val: tippingRev,                      color: '#16a34a', bg: '#f0fdf4' },
                                { label: 'Material Sales', pct: matPct, val: materialRev,                     color: '#2563eb', bg: '#eff6ff' },
                                { label: 'EPR Credits',    pct: 4,      val: Math.round(totalRev * 0.04),    color: '#c8a951', bg: '#fffbeb' },
                            ].map(s => (
                                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a2e' }}>{s.label}</div>
                                        <div style={{ fontSize: 10.5, color: '#5a6478' }}>₹{s.val.toLocaleString('en-IN')} · {s.pct}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                    { label: 'Revenue This Month', value: formatCurrency(summaryKPIs.revenueThisMonth, true), change: `+${revenueChange}%`, up: true, color: 'green', icon: IndianRupee, sub: 'incl. GST' },
                    { label: 'GMV All Time',        value: formatCurrency(summaryKPIs.gmvAllTime, true),       change: `${gmvPct}% of ₹2.5Cr`, up: true, color: 'teal', icon: TrendingUp, sub: 'Year 1 target progress' },
                    { label: 'Orders This Month',   value: summaryKPIs.ordersThisMonth,  change: `${summaryKPIs.ordersPaid} paid`, up: true, color: 'blue', icon: FileText, sub: `${summaryKPIs.ordersPending} pending` },
                    { label: 'EPR Certs Issued',    value: summaryKPIs.eprThisMonth,     change: `${summaryKPIs.eprAllTime} total`, up: true, color: 'amber', icon: ShieldCheck, sub: 'this month' },
                ].map(({ label, value, change, up, color, sub, icon: Icon }) => (
                    <div key={label} className={`kpi-card ${color}`}>
                        <div className="kpi-header">
                            <span className="kpi-label">{label}</span>
                            <div className={`kpi-icon ${color}`}><Icon size={18} /></div>
                        </div>
                        <div className="kpi-value" style={{ fontSize: 26 }}>{value}</div>
                        <div className="kpi-footer">
                            <span className={`kpi-change ${up ? 'up' : 'down'}`}>{change}</span>
                            <span className="kpi-sub">{sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue by Material + GMV Trend */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Revenue by Material</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Oct 2025 – Mar 2026</span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={revenueByMaterial} margin={{ top: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                                {materialKeys.map(k => (
                                    <Bar key={k} dataKey={k} stackId="a" fill={MATERIAL_COLORS[k] || '#94a3b8'} radius={k === 'Glass' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Monthly GMV Trend</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success)', background: 'rgba(26,122,74,0.1)', padding: '2px 8px', borderRadius: 20 }}>
                            Year 1 Target: ₹2.5 Cr
                        </span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={gmvTrend}>
                                <defs>
                                    <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1a3263" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#1a3263" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <ReferenceLine y={GMV_MONTHLY_TARGET} stroke="#c8a951" strokeDasharray="5 3" label={{ value: 'Monthly Target', position: 'right', fontSize: 10, fill: '#c8a951' }} />
                                <Area type="monotone" dataKey="gmv" stroke="#1a3263" strokeWidth={2.5} fill="url(#gmvGrad)" name="GMV" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Revenue by Zone + Top Buyers */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-header"><span className="card-title">Revenue by Zone</span></div>
                    <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <ResponsiveContainer width="50%" height={200}>
                            <PieChart>
                                <Pie data={revenueByZone} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" nameKey="zone">
                                    {revenueByZone.map((entry, i) => (
                                        <Cell key={entry.zone} fill={ZONE_COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {revenueByZone.map((z, i) => {
                                const total = revenueByZone.reduce((s, r) => s + r.value, 0)
                                const pct = ((z.value / total) * 100).toFixed(1)
                                return (
                                    <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: 2, background: ZONE_COLORS[i], flexShrink: 0 }} />
                                        <div style={{ flex: 1, fontSize: 12.5 }}>{z.zone}</div>
                                        <div style={{ fontWeight: 700, fontSize: 13 }}>{formatCurrency(z.value, true)}</div>
                                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', minWidth: 36 }}>{pct}%</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Top Buyers by Revenue</span>
                        <button className="btn btn-outline btn-sm">View All</button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>#</th><th>Company</th><th>Orders</th><th>Total Spend</th><th>Last Order</th></tr>
                            </thead>
                            <tbody>
                                {topBuyers.map(b => (
                                    <tr key={b.rank} style={b.rank === 1 ? { background: 'rgba(200,169,81,0.06)' } : {}}>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                                                background: b.rank === 1 ? '#c8a951' : b.rank <= 3 ? 'var(--color-primary)' : 'var(--color-bg)',
                                                color: b.rank <= 3 ? '#fff' : 'var(--color-text-muted)',
                                            }}>{b.rank}</span>
                                        </td>
                                        <td style={{ fontWeight: 500, fontSize: 12.5 }}>{b.company}</td>
                                        <td style={{ textAlign: 'center' }}>{b.orders}</td>
                                        <td style={{ fontWeight: 700 }}>{formatCurrency(b.totalSpend, true)}</td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{b.lastOrder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Transfer Station Performance ── */}
            <div className="card" style={{ marginTop: 8 }}>
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="card-title">Transfer Station Performance</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '2px 8px' }}>Billing &middot; Intake &middot; Utilisation</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>March 2026</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Station</th>
                                <th>Zone</th>
                                <th>Intake (T)</th>
                                <th>Capacity Used</th>
                                <th>Tipping Revenue</th>
                                <th>Material Sales</th>
                                <th>Total Revenue</th>
                                <th>Invoices Raised</th>
                                <th>Avg Turnaround</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'TS-N', name: 'North TS \u2014 Thudiyalur',  zone: 'North', color: '#1a3263', intake: 148, cap: 150, tipRev: 38800,  matRev: 84200,  invoices: 14, turnaround: '2.8d' },
                                { id: 'TS-S', name: 'South TS \u2014 Singanallur', zone: 'South', color: '#0f766e', intake: 182, cap: 200, tipRev: 52400,  matRev: 121600, invoices: 21, turnaround: '3.1d' },
                                { id: 'TS-E', name: 'East TS \u2014 Irugur',       zone: 'East',  color: '#c8a951', intake: 160, cap: 180, tipRev: 44000,  matRev: 98800,  invoices: 18, turnaround: '2.4d' },
                                { id: 'TS-W', name: 'West TS \u2014 Kuniyamuthur', zone: 'West',  color: '#6b7280', intake: 62,  cap: 120, tipRev: 19200,  matRev: 32400,  invoices: 9,  turnaround: '3.8d' },
                            ].map(ts => {
                                const pct = Math.round((ts.intake / ts.cap) * 100)
                                const total = ts.tipRev + ts.matRev
                                return (
                                    <tr key={ts.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: ts.color, display: 'inline-block', flexShrink: 0 }} />
                                                <span style={{ fontWeight: 600, fontSize: 12.5 }}>{ts.name}</span>
                                            </div>
                                        </td>
                                        <td><span style={{ fontSize: 11.5, fontWeight: 700, color: ts.color }}>{ts.zone}</span></td>
                                        <td style={{ fontWeight: 700 }}>{ts.intake}T</td>
                                        <td style={{ minWidth: 140 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                                                    <div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? '#ef4444' : ts.color, borderRadius: 3 }} />
                                                </div>
                                                <span style={{ fontSize: 11.5, fontWeight: 700, color: pct > 85 ? '#ef4444' : 'var(--color-text-muted)' }}>{pct}%</span>
                                            </div>
                                        </td>
                                        <td style={{ color: '#166534', fontWeight: 600 }}>{formatCurrency(ts.tipRev, true)}</td>
                                        <td style={{ color: '#1a3263', fontWeight: 600 }}>{formatCurrency(ts.matRev, true)}</td>
                                        <td style={{ fontWeight: 800 }}>{formatCurrency(total, true)}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{ts.invoices}</td>
                                        <td><span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(ts.turnaround) < 3 ? '#10b981' : parseFloat(ts.turnaround) < 4 ? '#f59e0b' : '#ef4444' }}>{ts.turnaround}</span></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ─── TAB 2: Inventory & Turnover ──────────────────────────────────────────────
function InventoryTab() {
    const [filterSite, setFilterSite]   = useState('All')
    const [filterMat, setFilterMat]     = useState('All')

    // Flatten inventory to table rows
    const allRows = initialInventory.flatMap(site =>
        site.materials.map(mat => ({
            siteName: site.siteName,
            siteId:   site.siteId,
            ...mat,
            capacityTonnes: mat.maxTonnes,
            pctUsed: mat.maxTonnes > 0 ? ((1 - mat.availableTonnes / mat.maxTonnes) * 100).toFixed(0) : 100,
        }))
    )

    const filtered = allRows.filter(r => {
        const sm = filterSite === 'All' || r.siteName === filterSite
        const mm = filterMat  === 'All' || r.category === filterMat
        return sm && mm
    })

    const sites = [...new Set(allRows.map(r => r.siteName))]
    const mats  = [...new Set(allRows.map(r => r.category))]

    const stockStatus = (row) => {
        if (row.availableTonnes === 0) return { label: 'Out of Stock', cls: 'maintenance' }
        if (row.availableTonnes < 5)  return { label: 'Low Stock',     cls: 'idle' }
        return { label: 'In Stock', cls: 'active' }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Sub-KPIs */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                    { label: 'Total Stock Available', value: `${initialInventory.reduce((s, site) => s + site.materials.reduce((m, mat) => m + mat.availableTonnes, 0), 0).toFixed(1)} T`, color: 'teal', icon: Package, sub: 'across 4 transfer stations' },
                    { label: 'Pending Batches',        value: summaryKPIs.pendingBatches, color: 'amber', icon: Clock, sub: 'awaiting admin publish' },
                    { label: 'Sold This Month',         value: `${summaryKPIs.soldTonnesThisMonth} T`, color: 'green', icon: TrendingUp, sub: 'total offloaded' },
                    {
                        label: 'Avg. Days Before Sale', value: `${summaryKPIs.avgDaysBeforeSale}d`,
                        color: summaryKPIs.avgDaysBeforeSale < 4 ? 'green' : summaryKPIs.avgDaysBeforeSale < 7 ? 'amber' : 'red',
                        icon: BarChart2, sub: 'target: < 4 days'
                    },
                ].map(({ label, value, color, icon: Icon, sub }) => (
                    <div key={label} className={`kpi-card ${color}`}>
                        <div className="kpi-header">
                            <span className="kpi-label">{label}</span>
                            <div className={`kpi-icon ${color}`}><Icon size={18} /></div>
                        </div>
                        <div className="kpi-value" style={{ fontSize: 26 }}>{value}</div>
                        <div className="kpi-sub">{sub}</div>
                    </div>
                ))}
            </div>

            {/* Turnover Chart + Sold vs Available */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Inventory Turnover by Material</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Target: &lt;4 days</span>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={turnoverData} layout="vertical" margin={{ left: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                <XAxis type="number" domain={[0, 15]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit="d" />
                                <YAxis dataKey="material" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip formatter={(v) => [`${v} days`, 'Avg. Days to Sell']} />
                                <ReferenceLine x={4}  stroke="#10b981" strokeDasharray="4 2" label={{ value: 'Target 4d', position: 'insideTopRight', fontSize: 10, fill: '#10b981' }} />
                                <ReferenceLine x={14} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'Old 14d', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                                <Bar dataKey="avgDays" radius={[0, 4, 4, 0]} name="Avg Days">
                                    {turnoverData.map(entry => (
                                        <Cell key={entry.material} fill={daysColor(entry.avgDays)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span className="card-title">Sold vs Available — This Month</span></div>
                    <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                        {soldVsAvailable.slice(0, 8).map(item => {
                            const total = item.sold + item.available
                            const soldPct = total > 0 ? Math.round((item.sold / total) * 100) : 0
                            const color = CATEGORY_COLORS[item.material] || '#94a3b8'
                            return (
                                <div key={item.material} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <ResponsiveContainer width={64} height={64}>
                                        <PieChart>
                                            <Pie data={[{ value: item.sold }, { value: item.available }]} cx="50%" cy="50%" innerRadius={20} outerRadius={30} dataKey="value" startAngle={90} endAngle={-270}>
                                                <Cell fill={color} />
                                                <Cell fill="#f0f0f0" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div style={{ fontSize: 10.5, fontWeight: 700, color, textAlign: 'center', lineHeight: 1.3 }}>{item.material}</div>
                                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{soldPct}% sold</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Live Stock Table */}
            <div className="card">
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="card-title">Live Stock Levels</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-success)', background: 'rgba(26,122,74,0.08)', border: '1px solid rgba(26,122,74,0.2)', borderRadius: 20, padding: '2px 8px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} /> Live
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select className="form-select" style={{ padding: '5px 10px', fontSize: 12 }} value={filterSite} onChange={e => setFilterSite(e.target.value)}>
                            <option value="All">All Sites</option>
                            {sites.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <select className="form-select" style={{ padding: '5px 10px', fontSize: 12 }} value={filterMat} onChange={e => setFilterMat(e.target.value)}>
                            <option value="All">All Materials</option>
                            {mats.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Site</th><th>Material</th><th>Available (T)</th><th>Capacity (T)</th><th>% Used</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, i) => {
                                const st = stockStatus(row)
                                const isLow = row.availableTonnes > 0 && row.availableTonnes < 5
                                return (
                                    <tr key={i} style={isLow ? { background: 'rgba(245,158,11,0.05)' } : {}}>
                                        <td style={{ fontSize: 12.5, fontWeight: 500 }}>{row.siteName}</td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[row.category] || '#ccc' }} />
                                                <span style={{ fontSize: 12.5 }}>{row.category}</span>
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{row.availableTonnes}</td>
                                        <td style={{ color: 'var(--color-text-muted)' }}>{row.capacityTonnes}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
                                                    <div style={{ width: `${row.pctUsed}%`, height: '100%', borderRadius: 4, background: daysColor(row.availableTonnes < 4 ? 100 : row.availableTonnes < 10 ? 6 : 3) }} />
                                                </div>
                                                <span style={{ fontSize: 11, minWidth: 32 }}>{row.pctUsed}%</span>
                                            </div>
                                        </td>
                                        <td><span className={`status-badge ${st.cls}`}><span className="dot" />{st.label}</span></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ─── TAB 3: Pricing Control ───────────────────────────────────────────────────
function PricingTab() {
    const [pricing, setPricing] = useState(initialPricing)
    const [editRow, setEditRow] = useState(null)
    const [editPrice, setEditPrice] = useState('')
    const [editDate, setEditDate]   = useState('')
    const [activeMat, setActiveMat] = useState('Concrete Rubble')

    const openEdit = (row) => { setEditRow(row); setEditPrice(String(row.price)); setEditDate('') }
    const closeEdit = () => { setEditRow(null); setEditPrice(''); setEditDate('') }

    const saveEdit = () => {
        if (!editPrice || isNaN(editPrice)) return
        setPricing(prev => prev.map(r => r.id === editRow.id
            ? { ...r, price: parseFloat(editPrice), lastUpdated: editDate || new Date().toISOString().slice(0, 10) }
            : r
        ))
        closeEdit()
    }

    const applyRecommended = () => {
        setPricing(prev => prev.map(r => ({
            ...r,
            price: parseFloat((r.informalBaseline * 1.12).toFixed(0)),
            lastUpdated: new Date().toISOString().slice(0, 10),
        })))
    }

    const newPremium = editRow ? premiumPct(parseFloat(editPrice) || editRow.price, editRow.informalBaseline) : 0
    const trendMaterials = Object.keys(MATERIAL_COLORS)
    const trendColors = ['#3b82f6', '#6b7280', '#ef4444', '#92400e', '#8b5cf6', '#06b6d4']

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* AI Recommendation Banner */}
            <div style={{
                background: 'rgba(200,169,81,0.09)', border: '1px solid rgba(200,169,81,0.35)',
                borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Zap size={20} style={{ color: '#c8a951', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--color-text)' }}>
                            Rule-Based Price Recommendation Active
                            <span style={{ fontSize: 11, fontWeight: 500, color: '#8a6d10', background: 'rgba(200,169,81,0.18)', borderRadius: 20, padding: '2px 9px', marginLeft: 8 }}>Phase 1</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                            Recommended prices = informal market baseline × 1.12 (12% premium). ML pricing engine coming in Phase 3.
                        </div>
                    </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={applyRecommended} style={{ whiteSpace: 'nowrap' }}>
                    Apply Recommended Prices
                </button>
            </div>

            {/* Pricing Table */}
            <div className="card">
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="card-title">Pricing Control Panel</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-danger)', background: 'rgba(185,28,28,0.07)', borderRadius: 20, padding: '2px 8px' }}>
                            <Lock size={10} /> Admin Only
                        </span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>GREENIE sets price — buyers cannot modify</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Material</th><th>Grade</th><th>Unit</th><th>Our Price</th><th>Informal Baseline</th><th>Premium %</th><th>Last Updated</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {pricing.map(row => {
                                const pct = premiumPct(row.price, row.informalBaseline)
                                const col = premiumColor(pct)
                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[row.material] || '#ccc' }} />
                                                <span style={{ fontWeight: 500 }}>{row.material}</span>
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.grade}</td>
                                        <td style={{ fontSize: 12 }}>{row.unit}</td>
                                        <td style={{ fontWeight: 700 }}>
                                            ₹{Number(row.price).toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                                            ₹{Number(row.informalBaseline).toLocaleString('en-IN')}
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: col, fontSize: 13 }}>+{pct}%</span>
                                        </td>
                                        <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.lastUpdated}</td>
                                        <td>
                                            <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }} onClick={() => openEdit(row)}>
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Price Trend Chart */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Price Trend vs Informal Market</span>
                    <select className="form-select" style={{ padding: '5px 10px', fontSize: 12 }} value={activeMat} onChange={e => setActiveMat(e.target.value)}>
                        {trendMaterials.map(m => <option key={m}>{m}</option>)}
                    </select>
                </div>
                <div className="card-body">
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={priceTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip prefix="₹" />} />
                            <Line type="monotone" dataKey={activeMat} stroke={MATERIAL_COLORS[activeMat] || '#1a3263'} strokeWidth={2.5} dot={{ r: 4 }} name={`${activeMat} (GREENIE)`} />
                            <ReferenceLine y={informalBaseline[activeMat]} stroke="#ef4444" strokeDasharray="5 3"
                                label={{ value: 'Informal Baseline', position: 'right', fontSize: 10, fill: '#ef4444' }} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 16, height: 2, background: MATERIAL_COLORS[activeMat] || '#1a3263', display: 'inline-block' }} /> GREENIE Price</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 16, height: 2, background: '#ef4444', display: 'inline-block', borderTop: '2px dashed #ef4444' }} /> Informal Market Baseline</span>
                    </div>
                </div>
            </div>

            {/* Edit Price Modal */}
            {editRow && (
                <div className="modal-overlay" onClick={closeEdit}>
                    <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Edit2 size={16} style={{ color: 'var(--color-primary)' }} /> Edit Price
                            </span>
                            <button className="modal-close" onClick={closeEdit}><X size={16} /></button>
                        </div>
                        <div className="modal-body" style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 8, padding: '10px 14px' }}>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Material</div>
                                    <div style={{ fontWeight: 600, marginTop: 2 }}>{editRow.material}</div>
                                </div>
                                <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 8, padding: '10px 14px' }}>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Grade</div>
                                    <div style={{ fontWeight: 600, marginTop: 2 }}>{editRow.grade}</div>
                                </div>
                            </div>
                            <div className="form-grid" style={{ gap: 14 }}>
                                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                    <label className="form-label">New Price (₹ / {editRow.unit}) *</label>
                                    <input className="form-input" type="number" min="1" value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder={`Current: ₹${editRow.price}`} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                    <label className="form-label">Effective From</label>
                                    <input className="form-input" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
                                </div>

                                {/* Live Premium Preview */}
                                {editPrice && !isNaN(editPrice) && (
                                    <div style={{ gridColumn: '1/-1' }}>
                                        {parseFloat(editPrice) < editRow.informalBaseline
                                            ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--color-danger)' }}>
                                                <AlertTriangle size={15} />
                                                <span><strong>Price below informal baseline (₹{editRow.informalBaseline})</strong> — this undermines GREENIE's price premium strategy.</span>
                                              </div>
                                            : <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(26,122,74,0.07)', border: '1px solid rgba(26,122,74,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--color-success)' }}>
                                                <CheckCircle size={15} />
                                                <span>Premium vs informal market: <strong>+{newPremium}%</strong> · Informal baseline: ₹{Number(editRow.informalBaseline).toLocaleString('en-IN')}</span>
                                              </div>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '14px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button className="btn btn-outline" onClick={closeEdit}>Cancel</button>
                            <button className="btn btn-primary" onClick={saveEdit}><CheckCircle size={14} /> Save Price</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Compliance Panel ─────────────────────────────────────────────────────────
function CompliancePanel() {
    const daysLeft = daysUntil(complianceData.cpcbReportDue)
    return (
        <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
                    <span className="card-title">EPR & Compliance</span>
                </div>
                <button className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} /> Generate Monthly Report
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 20, padding: '1px 6px' }}>Phase 2</span>
                </button>
            </div>
            <div className="card-body">
                {/* Stat Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
                    {[
                        { label: 'WTNs This Month', value: complianceData.wtnThisMonth, sub: `${complianceData.wtnAllTime} total all time`, color: '#1a3263' },
                        { label: 'EPR Certs This Month', value: complianceData.eprThisMonth, sub: `${complianceData.eprAllTime} total all time`, color: 'var(--color-success)' },
                        { label: 'CPCB Report Due', value: `${daysLeft}d`, sub: complianceData.cpcbReportDue, color: daysLeft < 14 ? 'var(--color-danger)' : 'var(--color-warning)' },
                    ].map(s => (
                        <div key={s.label} style={{ background: 'var(--color-bg)', borderRadius: 8, padding: '14px 18px', border: '1px solid var(--color-border)' }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{s.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* cert ledger */}
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>Recent EPR Certificates</div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Cert No.</th><th>Buyer</th><th>Material</th><th>Qty (T)</th><th>Issued</th><th>Download</th></tr>
                        </thead>
                        <tbody>
                            {complianceData.recentCerts.map(c => (
                                <tr key={c.certNo}>
                                    <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.certNo}</strong></td>
                                    <td style={{ fontSize: 12.5 }}>{c.buyer}</td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                            <span style={{ width: 7, height: 7, borderRadius: 2, background: CATEGORY_COLORS[c.material] || '#ccc' }} />
                                            {c.material}
                                        </span>
                                    </td>
                                    <td>{c.qty}</td>
                                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.issued}</td>
                                    <td>
                                        <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                            <Download size={12} /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MarketplaceAnalytics() {
    const [activeTab, setActiveTab] = useState(0)

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Analytics &amp; Pricing Dashboard</div>
                    <div className="page-subtitle">
                        Revenue · Inventory Turnover · Pricing Control — GREENIE Admin Only · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(26,50,99,0.07)', border: '1px solid rgba(26,50,99,0.15)', borderRadius: 8, padding: '7px 14px' }}>
                    <Lock size={13} /> Restricted to Admin
                </div>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--color-bg)', padding: 4, borderRadius: 10, border: '1px solid var(--color-border)', width: 'fit-content' }}>
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        style={{
                            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                            transition: 'all 0.18s ease',
                            background: activeTab === i ? 'var(--color-primary)' : 'transparent',
                            color:      activeTab === i ? '#fff'                 : 'var(--color-text-muted)',
                            boxShadow:  activeTab === i ? '0 2px 8px rgba(26,50,99,0.25)' : 'none',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 0 && <RevenueTab />}
            {activeTab === 1 && <InventoryTab />}
            {activeTab === 2 && <PricingTab />}

            {/* Compliance always at bottom */}
            <CompliancePanel />
        </div>
    )
}
