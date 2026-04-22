import { supabase } from '../../../lib/supabase';
import PaymentButtons from './PaymentButtons';
import { AnimatedTipPage, TipItem } from './TipAnimations';

export const dynamic = 'force-dynamic';

const NAVY = '#0B1F3A';
const GOLD = '#C9A84C';
const WHITE = '#FFFFFF';

const METHODS = [
  { key: 'venmo',   label: 'Venmo',    color: '#3D95CE', prefix: 'https://' },
  { key: 'cashapp', label: 'Cash App', color: '#00D54B', prefix: 'https://' },
  { key: 'paypal',  label: 'PayPal',   color: '#0070BA', prefix: 'https://' },
  { key: 'zelle',   label: 'Zelle',    color: '#6D1ED4', prefix: null },
];

type Profile = {
  id: string;
  name: string;
  venmo: string;
  cashapp: string;
  paypal: string;
  zelle: string;
};

export default async function TipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!profile) {
    return (
      <main style={s.page}>
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Tip page not found.</p>
      </main>
    );
  }

  const linkedMethods = METHODS.filter((m) => profile[m.key as keyof Profile]);

  return (
    <main style={s.page}>
      <div style={s.card}>
        <AnimatedTipPage>

          <TipItem><div style={s.topLine} className="gold-shimmer" /></TipItem>

          <TipItem>
            <a href="https://oceansidehospitality.com" target="_blank" rel="noopener noreferrer" style={s.oceansideLink}>
              <img src="/oceanside-logo.webp" style={s.oceansideLogo} alt="Oceanside Hospitality" />
              <span style={s.oceansideText}>Visit Oceanside Hospitality</span>
            </a>
          </TipItem>

          <TipItem><div style={s.divider} /></TipItem>

          <TipItem>
            <div style={s.profileBlock}>
              {(profile as any).avatar_url ? (
                <img src={(profile as any).avatar_url} style={s.avatarImg} alt={profile.name} />
              ) : (
                <div style={s.avatar}>{profile.name?.charAt(0).toUpperCase()}</div>
              )}
              <h1 style={s.name}>{profile.name}</h1>
            </div>
          </TipItem>

          <TipItem><p style={s.company}>Oceanside Hospitality</p></TipItem>
          <TipItem><p style={s.message}>We appreciate the opportunity to serve you — have a wonderful day!</p></TipItem>

          <TipItem><div style={s.divider} /></TipItem>

          {linkedMethods.length === 0 ? (
            <TipItem>
              <div style={s.emptyState}>
                <p style={s.emptyTitle}>No payment methods yet</p>
                <p style={s.emptySubtitle}>This valet hasn&apos;t linked any payment methods. Ask them to set up their account.</p>
              </div>
            </TipItem>
          ) : (
            <>
              <TipItem><p style={s.subtitle}>Choose how to tip</p></TipItem>
              <TipItem style={{ width: '100%' }}>
                <PaymentButtons
                  methods={linkedMethods.map((m) => ({
                    key: m.key,
                    label: m.label,
                    value: profile[m.key as keyof Profile] as string,
                  }))}
                />
              </TipItem>
            </>
          )}

          <TipItem><div style={s.bottomLine} className="gold-shimmer" /></TipItem>

        </AnimatedTipPage>
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
  card: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '14px',
    position: 'relative' as const,
    paddingTop: '16px',
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
  oceansideLink: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  oceansideLogo: {
    width: '90px',
    height: '90px',
    borderRadius: '10px',
    objectFit: 'contain' as const,
  },
  oceansideText: {
    color: GOLD,
    fontSize: '10px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    opacity: 0.8,
  },
  profileBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '88px',
    height: '88px',
    borderRadius: '44px',
    backgroundColor: 'rgba(201,168,76,0.15)',
    border: `3px solid ${GOLD}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '800',
    color: GOLD,
  },
  avatarImg: {
    width: '88px',
    height: '88px',
    borderRadius: '44px',
    objectFit: 'cover' as const,
    border: `3px solid ${GOLD}`,
  },
  name: {
    fontSize: '28px',
    fontWeight: '800',
    color: WHITE,
    margin: '4px 0 0 0',
    textAlign: 'center' as const,
    letterSpacing: '-0.5px',
  },
  company: {
    fontSize: '11px',
    color: GOLD,
    margin: '0',
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    opacity: 0.85,
  },
  message: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    margin: '0',
    textAlign: 'center' as const,
    fontStyle: 'italic',
    lineHeight: '1.6',
    padding: '0 8px',
  },
  subtitle: {
    fontSize: '11px',
    color: GOLD,
    margin: '0',
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    opacity: 0.7,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
    padding: '28px 16px',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    width: '100%',
    boxSizing: 'border-box' as const,
    textAlign: 'center' as const,
  },
  emptyTitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '15px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '0.5px',
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: '13px',
    margin: 0,
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
};
