'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const NAVY = '#0B1F3A';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://valetotip-web.vercel.app/reset-password',
    });
    setLoading(false);
    if (resetError) { setError(resetError.message); return; }
    setSent(true);
  }

  return (
    <main style={s.page}>
      <div style={s.container}>

        <div style={s.header}>
          <div style={s.logoRow}>
            <img src="/valetotip-logo.jpg" style={s.logoImage} alt="ValetoTip" />
            <a href="https://oceansidehospitality.com" target="_blank" rel="noopener noreferrer">
              <img src="/oceanside-logo.webp" style={s.oceansideImage} alt="Oceanside Hospitality" />
            </a>
          </div>
          <div style={s.divider} />
          <p style={s.poweredLabel}>ValetoTip Powered By</p>
          <h1 style={s.poweredBrand}>Oceanside Hospitality</h1>
          <div style={s.divider} />
        </div>

        <div style={s.card}>
          <h2 style={s.formTitle}>Reset Password</h2>

          {sent ? (
            <div style={s.successBox}>
              <p style={s.successTitle}>Check your email</p>
              <p style={s.successText}>A password reset link has been sent to <strong>{email}</strong>. Follow the link to set a new password.</p>
              <a href="/login" style={s.backLink}>← Back to Log In</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={s.form}>
              <p style={s.instructions}>Enter your email and we'll send you a link to reset your password.</p>
              <div style={s.group}>
                <label style={s.label}>Email</label>
                <input
                  style={s.input}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              {error && <p style={s.error}>{error}</p>}
              <button type="submit" style={s.button} disabled={loading}>
                {loading ? 'Sending...' : 'SEND RESET LINK'}
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
    margin: '0 0 20px 0',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '4px',
    padding: '14px 16px',
    color: WHITE,
    fontSize: '15px',
    outline: 'none',
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
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  successTitle: {
    color: WHITE,
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
  },
  successText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
};
