'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatedPage, AnimatedItem, AnimatedLogo } from '../components/PageAnimation';
import { supabase } from '../../lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setSuccess('Password updated! Log in with your new password.');
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) { setError(loginError.message); setLoading(false); return; }
    setLoading(false);
    router.push('/my-dashboard');
  }

  return (
    <main style={s.page}>
      <div style={s.container}>
        <AnimatedPage>

          {/* Logos */}
          <AnimatedItem>
            <AnimatedLogo style={s.header}>
              <div style={s.logoRow}>
                <a href="https://oceansidehospitality.com" target="_blank" rel="noopener noreferrer">
                  <img src="/oceanside-logo.webp" style={s.oceansideImage} alt="Oceanside Hospitality" />
                </a>
                <span style={s.cross}>✕</span>
                <img src="/valetotip-logo.jpg" style={s.logoImage} alt="ValetoTip" />
              </div>
              <div style={s.divider} className="gold-shimmer" />
              <p style={s.poweredLabel}>ValetoTip Powered By</p>
              <h1 style={s.poweredBrand}>Oceanside Hospitality</h1>
              <p style={s.tagline}>The quickest and easiest way to tip your favorite Valet!!</p>
              <div style={s.divider} className="gold-shimmer" />
            </AnimatedLogo>
          </AnimatedItem>

          {/* Form */}
          <AnimatedItem style={{ width: '100%' }}>
            <div style={s.card}>
              <h2 style={s.formTitle}>Welcome Back</h2>
              <form onSubmit={handleLogin} style={s.form}>
                <div style={s.group}>
                  <label style={s.label}>Email</label>
                  <input style={s.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Password</label>
                  <div style={s.inputWrapper}>
                    <input style={s.input} type={showPassword ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" style={s.eyeButton} onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                {error && <p style={s.error}>{error}</p>}
                {success && <p style={s.success}>{success}</p>}
                <button type="submit" style={s.button} disabled={loading}>
                  {loading ? 'Logging in...' : 'LOG IN'}
                </button>
                <a href="/forgot-password" style={s.forgotButton}>Forgot Password?</a>
              </form>
              <p style={s.signupText}>
                New valet?{' '}
                <a href="/signup" style={s.link}>Create an account</a>
              </p>
            </div>
          </AnimatedItem>

        </AnimatedPage>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

const NAVY = '#0B1F3A';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: NAVY,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  logoRow: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
    width: '100%',
  },
  logoImage: {
    width: '140px',
    height: '140px',
    borderRadius: '12px',
    objectFit: 'contain' as const,
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'block',
  },
  badge: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    border: `2px solid ${GOLD}`,
    backgroundColor: 'rgba(201,168,76,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: GOLD,
    fontSize: '20px',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  cross: {
    color: GOLD,
    fontSize: '18px',
    lineHeight: '1',
  },
  oceansideImage: {
    width: '160px',
    height: '160px',
    borderRadius: '12px',
    objectFit: 'contain' as const,
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'block',
  },
  brandNames: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    margin: 0,
  },
  divider: {
    width: '60%',
    height: '1px',
    backgroundColor: GOLD,
    opacity: 0.3,
    margin: '4px 0',
  },
  poweredLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    margin: 0,
  },
  poweredBrand: {
    color: WHITE,
    fontSize: '24px',
    fontWeight: '800',
    letterSpacing: '1px',
    margin: 0,
    textAlign: 'center' as const,
  },
  tagline: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '13px',
    textAlign: 'center' as const,
    fontStyle: 'italic',
    margin: 0,
    lineHeight: '1.6',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '8px',
    padding: '32px',
  },
  formTitle: {
    color: WHITE,
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '18px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '4px',
    padding: '14px 48px 14px 16px',
    color: WHITE,
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: 0,
    lineHeight: '1',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    margin: 0,
  },
  success: {
    color: GOLD,
    fontSize: '13px',
    margin: 0,
  },
  forgotButton: {
    color: GOLD,
    fontSize: '13px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    marginTop: '4px',
  },
  button: {
    backgroundColor: GOLD,
    color: NAVY,
    border: 'none',
    borderRadius: '4px',
    padding: '16px',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  signupText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    textAlign: 'center' as const,
    marginTop: '20px',
    marginBottom: 0,
  },
  link: {
    color: GOLD,
    textDecoration: 'none',
  },
};
