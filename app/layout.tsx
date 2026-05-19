import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StoryCloud – Tolle Geschichten für Kinder',
  description: 'Spannende, KI-generierte Geschichten und Wissens-Artikel für neugierige Köpfe!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Quicksand:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: 'var(--color-bg)', minHeight: '100dvh' }}>
        {/* ── Global Nav ──────────────────────────────────────── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(233,255,236,0.88)', backdropFilter: 'blur(12px)',
          borderBottom: '2px solid var(--color-outline-variant)',
          padding: '0 24px',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'relative' }}>

            {/* ── Centered KInderBlog title ── */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: '-0.01em',
                color: 'var(--color-primary)',
              }}>
der <span style={{
                  color: 'var(--color-secondary)',
                  fontSize: 23,
                  letterSpacing: '-0.03em',
                }}>KI</span>nderBlog
              </span>
            </div>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>⭐</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 22,
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
              }}>
                Story<span style={{ color: 'var(--color-secondary)' }}>Cloud</span>
              </span>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a
                href="/"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  padding: '6px 16px',
                  borderRadius: 999,
                  transition: 'background 0.15s',
                }}
              >
                Alle Geschichten
              </a>
              <a
                href={process.env.NEXT_PUBLIC_CMCX_URL ?? 'https://cmcx.vercel.app'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: 13, padding: '8px 18px' }}
              >
                ✨ KI-Tool öffnen
              </a>
            </div>
          </div>
        </header>

        {children}

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer style={{
          borderTop: '2px solid var(--color-outline-variant)',
          background: 'var(--color-surface)',
          padding: '40px 24px',
          textAlign: 'center',
          marginTop: 80,
        }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⭐ 🌙 ☁️</div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--color-primary)', marginBottom: 6 }}>
            Story<span style={{ color: 'var(--color-secondary)' }}>Cloud</span>
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-muted)' }}>
            2026 · KI-generiert · Powered by CMCx Content Orchestration
          </p>
        </footer>
      </body>
    </html>
  );
}
