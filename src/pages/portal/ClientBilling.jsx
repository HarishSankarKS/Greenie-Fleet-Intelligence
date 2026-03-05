import { useState } from 'react'
import { Download, CreditCard, FileText, CheckCircle, Clock, AlertCircle, Receipt } from 'lucide-react'

const invoices = [
    { id: 'INV-2026-012', date: '01 Mar 2026', period: 'Feb 2026', amount: '₹1,85,000', gst: '₹33,300', total: '₹2,18,300', status: 'due', dueDate: '15 Mar 2026' },
    { id: 'INV-2026-011', date: '01 Feb 2026', period: 'Jan 2026', amount: '₹1,85,000', gst: '₹33,300', total: '₹2,18,300', status: 'paid', paidDate: '10 Feb 2026' },
    { id: 'INV-2026-010', date: '01 Jan 2026', period: 'Dec 2025', amount: '₹1,85,000', gst: '₹33,300', total: '₹2,18,300', status: 'paid', paidDate: '12 Jan 2026' },
    { id: 'INV-2025-009', date: '01 Dec 2025', period: 'Nov 2025', amount: '₹1,72,000', gst: '₹30,960', total: '₹2,02,960', status: 'paid', paidDate: '08 Dec 2025' },
    { id: 'INV-2025-008', date: '01 Nov 2025', period: 'Oct 2025', amount: '₹1,72,000', gst: '₹30,960', total: '₹2,02,960', status: 'paid', paidDate: '09 Nov 2025' },
    { id: 'INV-2025-007', date: '01 Oct 2025', period: 'Sep 2025', amount: '₹1,72,000', gst: '₹30,960', total: '₹2,02,960', status: 'overdue', dueDate: '15 Oct 2025' },
]

const statusCfg = {
    paid: { label: 'Paid', color: '#10b981', bg: '#e8f9f0', icon: CheckCircle },
    due: { label: 'Due', color: '#f59e0b', bg: '#fff8e6', icon: Clock },
    overdue: { label: 'Overdue', color: '#ef4444', bg: '#fef2f2', icon: AlertCircle },
}

export default function ClientBilling() {
    const [filter, setFilter] = useState('all')
    const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter)

    const totalDue = invoices.filter(i => i.status === 'due' || i.status === 'overdue')
        .reduce((s, i) => s + parseInt(i.total.replace(/[₹,]/g, '')), 0)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Billing & Invoices</h1>
                    <p style={{ margin: '4px 0 0', color: '#5a6478', fontSize: 13 }}>Manage your invoices and payment history</p>
                </div>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                <div style={{ background: 'linear-gradient(135deg, #1a3263, #2a4a8a)', borderRadius: 12, padding: '20px 22px', color: '#fff' }}>
                    <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase' }}>Outstanding Balance</div>
                    <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>₹{totalDue.toLocaleString()}</div>
                    <div style={{ fontSize: 12, marginTop: 8, opacity: 0.6 }}>{invoices.filter(i => i.status !== 'paid').length} invoice(s) pending</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, padding: '20px 22px', border: '1px solid #e5e9f0' }}>
                    <div style={{ fontSize: 12, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase' }}>Current Plan</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#1a3263', marginTop: 6 }}>Enterprise</div>
                    <div style={{ fontSize: 12, color: '#5a6478', marginTop: 6 }}>₹1,85,000/month + GST</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 12, padding: '20px 22px', border: '1px solid #e5e9f0' }}>
                    <div style={{ fontSize: 12, color: '#5a6478', fontWeight: 600, textTransform: 'uppercase' }}>Next Invoice</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed', marginTop: 6 }}>01 Apr 2026</div>
                    <div style={{ fontSize: 12, color: '#5a6478', marginTop: 6 }}>Auto-generated on 1st of month</div>
                </div>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['all', 'paid', 'due', 'overdue'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', border: '1.5px solid',
                        background: filter === f ? '#1a3263' : '#fff',
                        color: filter === f ? '#fff' : '#5a6478',
                        borderColor: filter === f ? 'transparent' : '#dce1ea',
                    }}>{f === 'all' ? 'All' : statusCfg[f].label}</button>
                ))}
            </div>

            {/* Invoice Table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e9f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: '#f8f9fb', borderBottom: '1px solid #e5e9f0' }}>
                            {['Invoice', 'Date', 'Period', 'Amount', 'GST (18%)', 'Total', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11.5, color: '#5a6478', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(inv => {
                            const sc = statusCfg[inv.status]
                            const Icon = sc.icon
                            return (
                                <tr key={inv.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1a3263' }}>{inv.id}</td>
                                    <td style={{ padding: '12px 14px' }}>{inv.date}</td>
                                    <td style={{ padding: '12px 14px' }}>{inv.period}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{inv.amount}</td>
                                    <td style={{ padding: '12px 14px', color: '#5a6478' }}>{inv.gst}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1a1a2e' }}>{inv.total}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                                            background: sc.bg, color: sc.color,
                                        }}><Icon size={12} /> {sc.label}</span>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <button onClick={() => alert(`Downloading ${inv.id}`)} style={{
                                            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                                            background: 'none', border: '1px solid #dce1ea', borderRadius: 6,
                                            fontSize: 12, color: '#1a3263', cursor: 'pointer', fontWeight: 600,
                                        }}><Download size={12} /> PDF</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
