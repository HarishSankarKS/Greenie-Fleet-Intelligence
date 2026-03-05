import { CheckCircle, Star, Zap, Shield, ArrowRight } from 'lucide-react'

const plans = [
    {
        name: 'Basic',
        price: '₹5,000',
        period: '/month',
        desc: 'For small businesses and pilot projects',
        color: 'teal',
        icon: Zap,
        features: ['Up to 10 collection sites', 'Basic dashboard', 'Map monitoring', 'Email support', 'Monthly reports'],
        current: false,
    },
    {
        name: 'Professional',
        price: '₹15,000',
        period: '/month',
        desc: 'For mid-sized city operations',
        color: 'blue',
        icon: Star,
        features: ['Up to 50 collection sites', 'Full fleet management', 'Real-time tracking', 'Analytics & reports', 'Priority support', 'Driver management', 'Maintenance tracking'],
        current: true,
    },
    {
        name: 'Enterprise',
        price: '₹35,000',
        period: '/month',
        desc: 'Full-scale smart city deployment',
        color: 'green',
        icon: Shield,
        features: ['Unlimited sites', 'Full AI integration', 'IoT sensor support', 'Custom reporting', '24/7 dedicated support', 'SLA guarantee (99.9%)', 'White-label option', 'API access'],
        current: false,
    },
]

export default function Subscriptions() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Subscriptions</div>
                    <div className="page-subtitle">Manage your plan, billing cycle, and access level</div>
                </div>
            </div>

            <div className="alert-strip info" style={{ marginBottom: 24 }}>
                <CheckCircle size={15} />
                <span>You are currently on the <strong>Professional Plan</strong> — renews on <strong>March 21, 2026</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
                {plans.map(plan => {
                    const Icon = plan.icon
                    return (
                        <div key={plan.name} style={{
                            background: plan.current ? 'linear-gradient(135deg, #0f766e, #0d5a54)' : '#fff',
                            borderRadius: 16,
                            padding: '28px 24px',
                            border: plan.current ? 'none' : '1.5px solid var(--color-border)',
                            boxShadow: plan.current ? '0 12px 40px rgba(15,118,110,0.3)' : 'var(--shadow)',
                            position: 'relative',
                            transition: 'all 0.2s',
                        }}>
                            {plan.current && (
                                <div style={{
                                    position: 'absolute', top: 16, right: 16,
                                    background: 'rgba(255,255,255,0.2)', color: '#fff',
                                    fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                                    textTransform: 'uppercase', letterSpacing: '0.05em'
                                }}>Current Plan</div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: plan.current ? 'rgba(255,255,255,0.2)' : 'rgba(15,118,110,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: plan.current ? '#fff' : 'var(--color-primary)'
                                }}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: plan.current ? '#fff' : 'var(--color-text)' }}>{plan.name}</div>
                                    <div style={{ fontSize: 12, color: plan.current ? 'rgba(255,255,255,0.65)' : 'var(--color-text-muted)' }}>{plan.desc}</div>
                                </div>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <span style={{ fontSize: 30, fontWeight: 800, color: plan.current ? '#fff' : 'var(--color-text)' }}>{plan.price}</span>
                                <span style={{ fontSize: 13, color: plan.current ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted)' }}>{plan.period}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <CheckCircle size={14} style={{ color: plan.current ? 'rgba(255,255,255,0.8)' : '#10b981', flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, color: plan.current ? 'rgba(255,255,255,0.85)' : 'var(--color-text)' }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <button style={{
                                width: '100%', padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                background: plan.current ? 'rgba(255,255,255,0.2)' : 'var(--color-primary)',
                                color: '#fff', fontWeight: 600, fontSize: 13,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                transition: 'all 0.2s',
                            }}>
                                {plan.current ? 'Current Plan' : 'Upgrade'} <ArrowRight size={14} />
                            </button>
                        </div>
                    )
                })}
            </div>

            <div className="card">
                <div className="card-header"><span className="card-title">Billing History</span></div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Invoice</th><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {[
                                { inv: 'INV-2026-002', date: '2026-02-01', plan: 'Professional', amount: '₹15,000', status: 'paid' },
                                { inv: 'INV-2026-001', date: '2026-01-01', plan: 'Professional', amount: '₹15,000', status: 'paid' },
                                { inv: 'INV-2025-012', date: '2025-12-01', plan: 'Professional', amount: '₹15,000', status: 'paid' },
                                { inv: 'INV-2025-011', date: '2025-11-01', plan: 'Basic', amount: '₹5,000', status: 'paid' },
                            ].map(r => (
                                <tr key={r.inv}>
                                    <td style={{ fontWeight: 500 }}>{r.inv}</td>
                                    <td style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{r.date}</td>
                                    <td>{r.plan}</td>
                                    <td style={{ fontWeight: 600 }}>{r.amount}</td>
                                    <td><span className="status-badge completed"><span className="dot" />Paid</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
