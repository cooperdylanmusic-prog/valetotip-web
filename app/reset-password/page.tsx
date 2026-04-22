'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const NAVY = '#0B1F3A';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      } else {
        setError('This link is invalid or has expired. Please request a new one.');
      }
    });
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !confirm) { setError('Please fill in both fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    router.push('/login?reset=success');
  }

  return (
    <main style={s.page}>
      <div style={s.container}>

        <div style={s.header}>
          <div style={s.logoRow}>
            <a href="https://oceansidehospitality.com" target="_blank" rel="noopener noreferrer">
              <img src="/oceanside-logo.webp" style={s.oceansideImage} alt="Oceanside Hospitality" />
            </a>
            <span style={s.cross}>✕</span>
            <img src="/valetotip-logo.jpg" style={s.logoImage} alt="ValetoTip" />
          </div>
          <div style={s.divider} />
          <p style={s.poweredLabel}>ValetoTip Powered By</p>
          <h1 style={s.poweredBrand}>Oceanside Hospitality</h1>
          <p style={s.tagline}>The quickest and easiest way to tip your favorite Valet!!</p>
          <div style={s.divider} />
        </div>

        <div style={s.card}>
          <h2 style={s.formTitle}>Set New Password</h2>

          {!ready && error ? (
            <div style={s.errorBox}>
              <p style={s.errorText}>{error}</p>
              <a href="/forgot-password" style={s.backLink}>Request a new reset link</a>
            </div>
          ) : (
            <form onSubmit={handleReset} style={s.form}>
              <p style={s.instructions}>Enter your new password below.</p>

              <div style={s.group}>
                <label style={s.label}>New Password</label>
                <div style={s.inputWrapper}>
                  <input
                    style={s.input}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" style={s.eyeButton} onClick={() => setShowPassword(v => !v)}>
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              <div style={s.group}>
                <label style={s.label}>Confirm New Password</label>
                <div style={s.inputWrapper}>
                  <input
                    style={s.input}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                  <button type="button" style={s.eyeButton} onClick={() => setShowConfirm(v => !v)}>
                    <EyeIcon visible={showConfirm} />
                  </button>
                </div>
              </div>

              {error && <p style={s.error}>{error}</p>}

              <button type="submit" style={s.button} disabled={loading || !ready}>
                {loading ? 'Saving...' : 'SET NEW PASSWORD'}
              </button>
              <a href="/login" style={s.backLink}>← Back to Log In</a>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}

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
  oceansideImage: {
    width: '160px',
    height: '160px',
    borderRadius: '12px',
    objectFit: 'contain' as const,
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'block',
  },
  cross: {
    color: GOLD,
    fontSize: '18px',
    lineHeight: '1',
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
    margin: '0 0 20px 0',
  },
  instructions: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 4px 0',
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
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
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
  eyeButton: {
    position: 'absolute' as const,
    right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: GOLD,
    opacity: 0.7,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
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
    marginTop: '4px',
  },
  backLink: {
    color: GOLD,
    fontSize: '13px',
    textDecoration: 'none',
    opacity: 0.7,
    textAlign: 'center' as const,
    display: 'block',
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
};
