'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

const NAVY = '#0B1F3A';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';

const METHOD_COLORS: Record<string, string> = {
  venmo:   '#3D95CE',
  cashapp: '#00D54B',
  paypal:  '#0070BA',
  zelle:   '#6D1ED4',
};

type Profile = {
  id: string;
  name: string;
  venmo: string;
  cashapp: string;
  paypal: string;
  zelle: string;
  avatar_url: string;
};

export default function MyDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
      setLoading(false);
    });
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${user.id}/avatar.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: true });
    if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
    setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev);
    setUploading(false);
  }

  function copyLink() {
    const url = `https://valetotip-web.vercel.app/tip/${profile?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSaveName() {
    if (!newName.trim() || !profile) return;
    setSavingName(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ name: newName.trim() }).eq('id', user.id);
      setProfile(prev => prev ? { ...prev, name: newName.trim() } : prev);
    }
    setSavingName(false);
    setEditingName(false);
  }

  if (loading) {
    return (
      <main style={s.page}>
        <p style={{ color: GOLD, letterSpacing: '2px', fontSize: '12px', textTransform: 'uppercase' }}>Loading...</p>
      </main>
    );
  }

  if (!profile) return null;

  const tipUrl = `https://valetotip-web.vercel.app/tip/${profile.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tipUrl)}&bgcolor=C9A84C&color=0B1F3A&margin=10`;
  const linkedMethods = Object.keys(METHOD_COLORS).filter(k => profile[k as keyof Profile]);

  return (
    <main style={s.page}>
      <div style={s.card}>

        <div style={s.topLine} />

        {/* Profile photo */}
        <label style={s.avatarWrapper} title="Click to change photo">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} disabled={uploading} />
          {profile.avatar_url ? (
            <img src={profile.avatar_url} style={s.avatar} alt={profile.name} />
          ) : (
            <div style={s.avatarPlaceholder}>
              <span style={s.avatarInitial}>{profile.name?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div style={s.avatarBadge}>{uploading ? '…' : '+'}</div>
        </label>

        {editingName ? (
          <div style={s.nameEditRow}>
            <input
              style={s.nameInput}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
              autoFocus
              maxLength={60}
            />
            <button onClick={handleSaveName} disabled={savingName} style={s.nameSaveBtn}>
              {savingName ? '…' : '✓'}
            </button>
            <button onClick={() => setEditingName(false)} style={s.nameCancelBtn}>✕</button>
          </div>
        ) : (
          <div style={s.nameRow}>
            <h1 style={s.name}>{profile.name}</h1>
            <button
              onClick={() => { setNewName(profile.name); setEditingName(true); }}
              style={s.nameEditBtn}
              title="Edit name"
            >
              ✎
            </button>
          </div>
        )}
        <p style={s.company}>Oceanside Hospitality</p>

        <div style={s.divider} />

        {/* QR Code */}
        <p style={s.sectionLabel}>Your Tip QR Code</p>
        <img src={qrUrl} style={s.qr} alt="Your QR code" />

        <button onClick={copyLink} style={s.copyButton}>
          {copied ? '✓ COPIED!' : 'COPY TIP LINK'}
        </button>

        <div style={s.divider} />

        {/* Payment Methods */}
        <p style={s.sectionLabel}>Payment Methods</p>
        <div style={s.methods}>
          {linkedMethods.length === 0 ? (
            <a href="/onboard" style={s.addButton}>+ Add Payment Methods</a>
          ) : (
            linkedMethods.map(key => (
              <div key={key} style={s.methodItem}>
                <div style={{ ...s.dot, backgroundColor: METHOD_COLORS[key] }} />
                <span style={s.methodName}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span style={s.linked}>Linked</span>
              </div>
            ))
          )}
        </div>

        {linkedMethods.length > 0 && (
          <a href="/onboard" style={s.editLink}>Edit Payment Methods</a>
        )}

        <div style={s.divider} />

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to log out?')) {
              supabase.auth.signOut().then(() => { window.location.href = '/login'; });
            }
          }}
          style={s.logoutButton}
        >
          Log Out
        </button>

        <div style={s.bottomLine} />

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
    alignItems: 'flex-start',
    padding: '40px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '14px',
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
    marginTop: '8px',
  },
  divider: {
    width: '60%',
    height: '1px',
    backgroundColor: GOLD,
    opacity: 0.25,
    margin: '4px 0',
  },
  avatarWrapper: {
    position: 'relative' as const,
    cursor: 'pointer',
    display: 'inline-block',
  },
  avatar: {
    width: '90px',
    height: '90px',
    borderRadius: '45px',
    objectFit: 'cover' as const,
    border: `3px solid ${GOLD}`,
    display: 'block',
  },
  avatarPlaceholder: {
    width: '90px',
    height: '90px',
    borderRadius: '45px',
    backgroundColor: 'rgba(201,168,76,0.1)',
    border: `3px solid ${GOLD}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: '36px',
    fontWeight: '800',
    color: GOLD,
  },
  avatarBadge: {
    position: 'absolute' as const,
    bottom: '0',
    right: '0',
    width: '26px',
    height: '26px',
    borderRadius: '13px',
    backgroundColor: GOLD,
    color: NAVY,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '800',
    border: `2px solid ${NAVY}`,
  },
  name: {
    fontSize: '26px',
    fontWeight: '800',
    color: WHITE,
    margin: '4px 0 0 0',
    textAlign: 'center' as const,
    letterSpacing: '-0.5px',
  },
  company: {
    fontSize: '11px',
    color: GOLD,
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    margin: 0,
    opacity: 0.85,
  },
  sectionLabel: {
    fontSize: '10px',
    color: GOLD,
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    margin: '0',
    opacity: 0.8,
    alignSelf: 'flex-start' as const,
  },
  qr: {
    width: '200px',
    height: '200px',
    borderRadius: '12px',
    border: `3px solid rgba(201,168,76,0.4)`,
  },
  copyButton: {
    backgroundColor: 'transparent',
    color: GOLD,
    border: `1px solid ${GOLD}`,
    borderRadius: '4px',
    padding: '14px 32px',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '2px',
    cursor: 'pointer',
    width: '100%',
  },
  methods: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  methodItem: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '4px',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  methodName: {
    color: WHITE,
    fontSize: '15px',
    flex: 1,
  },
  linked: {
    color: GOLD,
    fontSize: '12px',
    fontWeight: '600',
    opacity: 0.8,
  },
  addButton: {
    backgroundColor: GOLD,
    color: NAVY,
    borderRadius: '4px',
    padding: '14px 16px',
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '2px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    width: '100%',
    boxSizing: 'border-box' as const,
    display: 'block',
  },
  editLink: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    textDecoration: 'none',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.3)',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px',
    letterSpacing: '1px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  nameEditBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(201,168,76,0.5)',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '2px 4px',
    lineHeight: '1',
  },
  nameEditRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    justifyContent: 'center',
  },
  nameInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(201,168,76,0.5)',
    borderRadius: '4px',
    padding: '8px 12px',
    color: WHITE,
    fontSize: '20px',
    fontWeight: '800',
    outline: 'none',
    textAlign: 'center' as const,
    width: '200px',
  },
  nameSaveBtn: {
    backgroundColor: GOLD,
    color: NAVY,
    border: 'none',
    borderRadius: '4px',
    width: '32px',
    height: '32px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    flexShrink: 0,
  },
  nameCancelBtn: {
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    width: '32px',
    height: '32px',
    fontSize: '14px',
    cursor: 'pointer',
    flexShrink: 0,
  },
};
