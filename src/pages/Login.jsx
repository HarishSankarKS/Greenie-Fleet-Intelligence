import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Shield, Truck, ChevronRight, Phone } from 'lucide-react'

const TRUST_BULLETS = [
    'Real-time fleet tracking across all zones',
    'SLA compliance reporting, audit-ready',
    'Trusted by 12+ enterprises across Tamil Nadu',
]

const CLIENTS = ['Ramky Enviro', 'L&T Realty', 'Ashoka Buildcon']

export default function Login() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('portal')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        setError('')
        if (!email || !password) { setError('Please enter your credentials.'); return }

        // Admin: must be @greenie.ac.in
        if (tab === 'admin') {
            if (!email.toLowerCase().endsWith('@greenie.ac.in')) {
                setError('Admin access requires a @greenie.ac.in email address.'); return
            }
        }

        // Client Portal: email or Indian phone (10 digits, starts with 6-9)
        if (tab === 'portal') {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            const isPhone = /^[6-9]\d{9}$/.test(email.replace(/\s/g, ''))
            if (!isEmail && !isPhone) {
                setError('Please enter a valid email address or 10-digit Indian phone number.'); return
            }
        }

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            navigate(tab === 'portal' ? '/portal/dashboard' : '/dashboard')
        }, 1000)
    }

    return (
        <div style={{
            display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif",
            background: '#f4f5f7',
        }}>
            {/* ── LEFT PANEL ── */}
            <div style={{
                width: '52%', background: 'linear-gradient(145deg, #0f2040 0%, #1a3263 50%, #1e3a72 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '48px 56px', position: 'relative', overflow: 'hidden',
            }}>
                {/* Geometric decorations */}
                <div style={{
                    position: 'absolute', top: -120, right: -120, width: 400, height: 400,
                    borderRadius: '50%', border: '1px solid rgba(200,169,81,0.12)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 250, height: 250,
                    borderRadius: '50%', border: '1px solid rgba(200,169,81,0.18)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -100, left: -80, width: 320, height: 320,
                    borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(200,169,81,0.04) 1px, transparent 1px)',
                    backgroundSize: '32px 32px', pointerEvents: 'none',
                }} />

                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 64 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: 'rgba(200,169,81,0.15)',
                            border: '1.5px solid rgba(200,169,81,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Truck size={22} color="#c8a951" />
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>GREENIE</div>
                            <div style={{ fontSize: 10, color: 'rgba(200,169,81,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Fleet Intelligence</div>
                        </div>
                    </div>

                    {/* Headline */}
                    <div style={{ marginBottom: 40 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(200,169,81,0.12)', border: '1px solid rgba(200,169,81,0.25)',
                            borderRadius: 20, padding: '4px 14px', marginBottom: 20,
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8a951' }} />
                            <span style={{ fontSize: 11, color: '#c8a951', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Private Platform</span>
                        </div>
                        <h1 style={{
                            fontSize: 40, fontWeight: 800, color: '#ffffff',
                            lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16,
                        }}>
                            Smart Fleet.<br />
                            <span style={{ color: '#c8a951' }}>Cleaner Cities.</span>
                        </h1>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 380 }}>
                            The complete operations platform for C&D waste logistics — built for scale, designed for accountability.
                        </p>
                    </div>

                    {/* Trust bullets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {TRUST_BULLETS.map(b => (
                            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 22, height: 22, borderRadius: '50%',
                                    background: 'rgba(200,169,81,0.15)',
                                    border: '1px solid rgba(200,169,81,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <CheckCircle size={12} color="#c8a951" />
                                </div>
                                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom client strip */}
                <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                        Trusted by
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {CLIENTS.map(c => (
                            <div key={c} style={{
                                padding: '6px 14px', borderRadius: 6,
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600,
                            }}>{c}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                background: '#ffffff',
            }}>
                {/* Tab switcher */}
                <div style={{
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                    padding: '24px 48px', borderBottom: '1px solid #eaecf0',
                    gap: 4,
                }}>
                    {[
                        { id: 'admin', label: 'Admin Login' },
                        { id: 'portal', label: 'Client Portal' },
                    ].map(t => (
                        <button key={t.id} onClick={() => { setTab(t.id); setError('') }} style={{
                            padding: '8px 18px', borderRadius: 8, border: 'none',
                            cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            transition: 'all 0.18s ease',
                            background: tab === t.id ? '#1a3263' : 'transparent',
                            color: tab === t.id ? '#ffffff' : '#5a6478',
                        }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Form area */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '40px 48px',
                }}>
                    <div style={{ width: '100%', maxWidth: 400 }}>

                        {/* Role badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: tab === 'portal' ? 'rgba(26,50,99,0.07)' : 'rgba(200,169,81,0.1)',
                            borderRadius: 20, padding: '5px 14px', marginBottom: 24,
                            border: tab === 'portal' ? '1px solid rgba(26,50,99,0.15)' : '1px solid rgba(200,169,81,0.3)',
                        }}>
                            <Shield size={12} color={tab === 'portal' ? '#1a3263' : '#b8860b'} />
                            <span style={{
                                fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                                color: tab === 'portal' ? '#1a3263' : '#b8860b',
                            }}>
                                {tab === 'portal' ? 'Client Portal Access' : 'Administrator Access'}
                            </span>
                        </div>

                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.03em', marginBottom: 6 }}>
                            Welcome back
                        </h2>
                        <p style={{ fontSize: 14, color: '#5a6478', marginBottom: 36 }}>
                            {tab === 'portal'
                                ? "Sign in to your organisation\u2019s client portal"
                                : 'Sign in to the fleet operations dashboard'}
                        </p>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.2)',
                                borderRadius: 8, padding: '10px 14px', marginBottom: 20,
                                fontSize: 13, color: '#b91c1c', fontWeight: 500,
                            }}>{error}</div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {/* Email / Phone */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e' }}>
                                    {tab === 'admin' ? 'Admin Email' : 'Email or Phone Number'}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    {tab === 'admin'
                                        ? <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9aa3b2', pointerEvents: 'none' }} />
                                        : <Phone size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9aa3b2', pointerEvents: 'none' }} />
                                    }
                                    <input
                                        type="text"
                                        placeholder={tab === 'admin' ? 'yourname@greenie.ac.in' : 'email@example.com or 9876543210'}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{
                                            width: '100%', padding: '11px 13px 11px 38px',
                                            border: '1.5px solid #dce1ea', borderRadius: 8,
                                            fontSize: 13.5, outline: 'none', fontFamily: 'inherit',
                                            background: '#fff', color: '#1a1a2e',
                                            transition: 'border-color 0.18s, box-shadow 0.18s',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#1a3263'; e.target.style.boxShadow = '0 0 0 3px rgba(26,50,99,0.1)' }}
                                        onBlur={e => { e.target.style.borderColor = '#dce1ea'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                                {tab === 'admin' && (
                                    <span style={{ fontSize: 11, color: '#5a6478', marginTop: 2 }}>Only @greenie.ac.in emails are allowed</span>
                                )}
                            </div>

                            {/* Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1a2e' }}>Password</label>
                                    <button type="button" style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: 12, color: '#c8a951', fontWeight: 600, padding: 0,
                                    }}>Forgot password?</button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={15} style={{
                                        position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                                        color: '#9aa3b2', pointerEvents: 'none',
                                    }} />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{
                                            width: '100%', padding: '11px 40px 11px 38px',
                                            border: '1.5px solid #dce1ea', borderRadius: 8,
                                            fontSize: 13.5, outline: 'none', fontFamily: 'inherit',
                                            background: '#fff', color: '#1a1a2e',
                                            transition: 'border-color 0.18s, box-shadow 0.18s',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = '#1a3263'; e.target.style.boxShadow = '0 0 0 3px rgba(26,50,99,0.1)' }}
                                        onBlur={e => { e.target.style.borderColor = '#dce1ea'; e.target.style.boxShadow = 'none' }}
                                    />
                                    <button type="button" onClick={() => setShowPass(s => !s)} style={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#9aa3b2',
                                        display: 'flex', alignItems: 'center',
                                    }}>
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '13px',
                                background: loading ? '#6b7280' : 'linear-gradient(135deg, #1a3263, #0f2040)',
                                color: '#fff', border: 'none', borderRadius: 8,
                                fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.18s', letterSpacing: '-0.01em',
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(26,50,99,0.3)',
                                marginTop: 4,
                            }}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{
                                            width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                                            borderTop: '2px solid #fff', borderRadius: '50%',
                                            animation: 'spin 0.7s linear infinite', display: 'inline-block',
                                        }} />
                                        Signing in…
                                    </span>
                                ) : (
                                    <><span>Sign In</span><ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>

                        {/* Trust line */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            marginTop: 24, paddingTop: 24, borderTop: '1px solid #eaecf0',
                        }}>
                            <Shield size={12} color="#9aa3b2" />
                            <span style={{ fontSize: 11.5, color: '#9aa3b2' }}>
                                256-bit SSL · SOC 2 Compliant · Private Platform
                            </span>
                        </div>

                        {/* Cross-link */}
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            {tab === 'portal' ? (
                                <button onClick={() => setTab('admin')} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 12.5, color: '#5a6478',
                                }}>
                                    Operations team? <span style={{ color: '#1a3263', fontWeight: 600 }}>Admin Login <ChevronRight size={11} style={{ verticalAlign: 'middle' }} /></span>
                                </button>
                            ) : (
                                <button onClick={() => setTab('portal')} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    fontSize: 12.5, color: '#5a6478',
                                }}>
                                    Business client? <span style={{ color: '#1a3263', fontWeight: 600 }}>Client Portal <ChevronRight size={11} style={{ verticalAlign: 'middle' }} /></span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom footer */}
                <div style={{
                    padding: '16px 48px', borderTop: '1px solid #eaecf0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <span style={{ fontSize: 11.5, color: '#9aa3b2' }}>© 2026 GREENIE Fleet Intelligence. Private & Confidential.</span>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Privacy Policy', 'Terms', 'Support'].map(l => (
                            <button key={l} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: '#9aa3b2' }}>{l}</button>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
            `}</style>
        </div>
    )
}
