'use client';

const METHOD_COLORS: Record<string, string> = {
  venmo:   '#3D95CE',
  cashapp: '#00D54B',
  paypal:  '#0070BA',
  zelle:   '#6D1ED4',
};

type Method = {
  key: string;
  label: string;
  value: string;
};

function getDeepLink(key: string, value: string): { appLink: string | null; webLink: string } {
  const raw = value.trim();

  if (key === 'venmo') {
    // Extract username from venmo.com/u/username or venmo.com/username
    const match = raw.match(/venmo\.com\/(?:u\/)?([^/?#]+)/i);
    const username = match ? match[1] : raw.replace(/^[@/]+/, '');
    return {
      appLink: `venmo://paycharge?txn=pay&recipients=${username}`,
      webLink: `https://venmo.com/u/${username}`,
    };
  }

  if (key === 'cashapp') {
    // Extract $cashtag from cash.app/$tag or just $tag
    const match = raw.match(/cash\.app\/(\$?[^/?#]+)/i);
    const tag = match ? match[1] : raw;
    const cashtag = tag.startsWith('$') ? tag : `$${tag}`;
    return {
      appLink: null, // cash.app https URL opens the app directly
      webLink: `https://cash.app/${cashtag}`,
    };
  }

  if (key === 'paypal') {
    // Extract name from paypal.me/name
    const match = raw.match(/paypal\.me\/([^/?#]+)/i);
    const name = match ? match[1] : raw;
    return {
      appLink: null, // paypal.me https URL opens the app directly
      webLink: `https://paypal.me/${name}`,
    };
  }

  return { appLink: null, webLink: raw };
}

function PaymentButton({ methodKey, label, value }: { methodKey: string; label: string; value: string }) {
  const color = METHOD_COLORS[methodKey];
  const { appLink, webLink } = getDeepLink(methodKey, value);

  function handleClick(e: React.MouseEvent) {
    if (!appLink) return; // let the <a> handle it normally
    e.preventDefault();
    // Try opening the app; fall back to web after 1.5s if app isn't installed
    window.location.href = appLink;
    setTimeout(() => { window.location.href = webLink; }, 1500);
  }

  return (
    <a
      href={webLink}
      onClick={appLink ? handleClick : undefined}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '18px',
        borderRadius: '4px',
        backgroundColor: color,
        color: '#FFFFFF',
        fontSize: '15px',
        fontWeight: '700',
        textDecoration: 'none',
        textAlign: 'center',
        letterSpacing: '1px',
      }}
    >
      {label}
    </a>
  );
}

function ZelleDisplay({ value }: { value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px',
      borderRadius: '4px',
      backgroundColor: METHOD_COLORS.zelle,
      color: '#FFFFFF',
      fontSize: '15px',
      fontWeight: '700',
      letterSpacing: '1px',
    }}>
      <span>Zelle</span>
      <span style={{ fontSize: '13px', opacity: 0.85 }}>{value}</span>
    </div>
  );
}

export default function PaymentButtons({ methods }: { methods: Method[] }) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {methods.map((m) =>
        m.key === 'zelle' ? (
          <ZelleDisplay key={m.key} value={m.value} />
        ) : (
          <PaymentButton key={m.key} methodKey={m.key} label={m.label} value={m.value} />
        )
      )}
    </div>
  );
}
