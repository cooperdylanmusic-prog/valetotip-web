'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const NAVY = '#0B1F3A';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';

const METHODS = [
  { key: 'venmo',   label: 'Venmo',   placeholder: 'venmo.com/u/YourUsername',  color: '#3D95CE' },
  { key: 'cashapp', label: 'CashApp', placeholder: 'cash.app/$YourCashtag',      color: '#00D54B' },
  { key: 'paypal',  label: 'PayPal',  placeholder: 'paypal.me/YourName',         color: '#0070BA' },
  { key: 'zelle',   label: 'Zelle',   placeholder: 'Your phone number or email', color: '#6D1ED4' },
];

function OnboardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameFromUrl = searchParams.get('name') ?? '';
  const isEditing = !nameFromUrl;
  const [profileName, setProfileName] = useState(nameFromUrl);
  const [links, setLinks] = useState({ venmo: '', cashapp: '', paypal: '', zelle: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return; }
      const { data } = await supabase.from('profiles').select('name,venmo,cashapp,paypal,zelle').eq('id', user.id).single();
      if (data) {
        if (!nameFromUrl && data.name) setProfileName(data.name);
        setLinks({ venmo: data.venmo ?? '', cashapp: data.cashapp ?? '', paypal: data.paypal ?? '', zelle: data.zelle ?? '' });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not logged in. Please sign up again.'); setSaving(false); return; }
    const { error: saveError } = await supabase.from('profiles').upsert({ id: user.id, name: profileName, ...links });
    if (saveError) { setError(saveError.message); setSaving(false); return; }
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/my-dashboard'), 1200);
  }

  return (
    <main style={s.page}>
      <div style={s.container}>

        <div style={s.topLine} />

        <p style={s.eyebrow}>{isEditing ? 'Your Account' : 'Step 2 of 2'}</p>
        <h1 style={s.title}>{isEditing ? 'Edit Payment Links' : 'Payment Links'}</h1>
        <div style={s.divider} />
        <p style={s.subtitle}>Customers will use these to tip you. Add as many as you like.</p>

        <div style={s.card}>
          <form onSubmit={handleSave} style={s.form}>
            {METHODS.map((m) => (
              <div key={m.key} style={s.group}>
                <label style={s.labelRow}>
                  <span style={{ ...s.dot, backgroundColor: m.color }} />
                  <span style={s.label}>{m.label.toUpperCase()}</span>
                </label>
                <input
                  style={s.input}
                  type="text"
                  placeholder={m.placeholder}
                  value={links[m.key as keyof typeof links]}
                  onChange={e => setLinks(prev => ({ ...prev, [m.key]: e.target.value }))}
                  autoCapitalize="none"
                />
              </div>
            ))}
            {error && <p style={s.error}>{error}</p>}
            {saved && <p style={s.success}>✓ Saved! Redirecting to dashboard...</p>}
            <button type="submit" style={s.button} disabled={saving || loading || saved}>
              {saving ? 'Saving...' : 'SAVE PAYMENT LINKS'}
            </button>
            <a href="/my-dashboard" style={s.backLink}>← Back to Dashboard</a>
          </form>
        </div>

        <div style={s.bottomLine} />

      </div>
    </main>
  );
}

export default function OnboardPage() {
  return (
    <Suspense>
      <OnboardForm />
    </Suspense>
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
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
    position: 'relative' as const,
    paddingTop: '8px',
  },
  topLine: {
    width: '80%',
    height: '1px',
    backgroundColor: GOLD,
    opacity: 0.4,
    marginBottom: '8px',
  },
  bottomLine: {
    width: '80%',
    height: '1px',
    backgroundColor: GOLD,
    opacity: 0.4,
    marginTop: '16px',
  },
  eyebrow: {
    color: GOLD,
    fontSize: '11px',
    letterSpacing: '4px',
    textTransform: 'uppercase' as const,
    margin: 0,
    opacity: 0.8,
  },
  title: {
    color: WHITE,
    fontSize: '36px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    margin: '4px 0 0 0',
    textAlign: 'center' as const,
  },
  divider: {
    width: '60%',
    height: '1px',
    backgroundColor: GOLD,
    opacity: 0.25,
    margin: '8px 0',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    textAlign: 'center' as const,
    lineHeight: '1.6',
    margin: 0,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '8px',
    padding: '28px',
    marginTop: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    display: 'inline-block',
    flexShrink: 0,
  },
  label: {
    color: GOLD,
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '2px',
    opacity: 0.85,
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
  success: {
    color: '#C9A84C',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.5px',
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
};
