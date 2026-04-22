'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedPage, AnimatedItem, AnimatedLogo } from '../components/PageAnimation';
import { supabase } from '../../lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    const userId = data.user?.id;
    if (userId) {
      await supabase.from('profiles').upsert({ id: userId, name });
    }
    setLoading(false);
    if (!data.session) {
      setConfirmEmail(email);
      return;
    }
    router.push(`/onboard?name=${encodeURIComponent(name)}`);
  }

  if (confirmEmail) {
    return (
      <main style={s.page}>
        <div style={s.container}>
          <div style={s.card}>
            <h2 style={{ ...s.formTitle, marginBottom: '12px' }}>Check Your Email</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 8px 0', textAlign: 'center' }}>
              We sent a confirmation link to
            </p>
            <p style={{ color: GOLD, fontSize: '15px', fontWeight: '700', margin: '0 0 20px 0', textAlign: 'center', wordBreak: 'break-all' }}>
              {confirmEmail}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.7', margin: 0, textAlign: 'center' }}>
              Click the link in that email to activate your account, then come back to log in.
            </p>
            <a href="/login" style={{ ...s.button, display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '24px' }}>
              GO TO LOGIN
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={s.page}>
      <div style={s.container}>
        <AnimatedPage>

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

          <AnimatedItem style={{ width: '100%' }}>
            <div style={s.card}>
              <h2 style={s.formTitle}>Create Your Account</h2>
              <form onSubmit={handleSignUp} style={s.form}>
                <div style={s.group}>
                  <label style={s.label}>Full Name</label>
                  <input style={s.input} type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Email</label>
                  <input style={s.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={s.group}>
                  <label style={s.label}>Password</label>
                  <div style={s.inputWrapper}>
                    <input style={s.input} type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" style={s.eyeButton} onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                {error && <p style={s.error}>{error}</p>}
                <button type="submit" style={s.button} disabled={loading}>
                  {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
                </button>
              </form>
              <p style={s.loginText}>
                Already have an account?{' '}
                <a href="/login" style={s.link}>Log in</a>
              </p>
            </div>
          </AnimatedItem>

        </AnimatedPage>
      </div>
    </main>
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
  loginText: {
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
