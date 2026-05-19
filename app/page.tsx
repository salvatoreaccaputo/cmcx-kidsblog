import Image from 'next/image';
import { getKidsStories, storyDisplayTitle, storyExcerpt, storyImage, formatDate } from '../lib/supabase';
import type { KidsStory } from '../lib/supabase';

export const revalidate = 10;

/* ── Story Card ───────────────────────────────────────────────── */
function StoryCard({ story, index }: { story: KidsStory; index: number }) {
  const title   = storyDisplayTitle(story);
  const excerpt = storyExcerpt(story.kidsblog);
  const img     = storyImage(story, 600, 400);
  const isNew   = index === 0;

  const ACCENT_COLORS = [
    { bg: '#ffd93d', text: '#705d00' },
    { bg: '#6eb5ff', text: '#0061a2' },
    { bg: '#ffcfe3', text: '#92436d' },
    { bg: '#aef2c2', text: '#155724' },
  ];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <a href={`/artikel/${story.id}`} className="story-card">
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          style={{ transition: 'transform 0.4s ease' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,33,15,0.45) 0%, transparent 55%)',
        }} />
        {/* Badges */}
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 8 }}>
          {isNew && (
            <span className="badge" style={{ background: accent.bg, color: accent.text }}>
              ✨ Neu
            </span>
          )}
          <span className="badge badge-green">
            {story.language === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px 28px' }}>
        {/* Accent dot line */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: i === 0 ? 20 : 6, height: 6, borderRadius: 99,
              background: i === 0 ? accent.bg : 'var(--color-outline-variant)',
              transition: 'width 0.2s',
            }} />
          ))}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 18,
          lineHeight: 1.3,
          color: 'var(--color-text)',
          marginBottom: 10,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: 1.65,
          color: 'var(--color-muted)',
          marginBottom: 18,
        }}>
          {excerpt}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <time style={{ fontSize: 12, color: 'var(--color-outline)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            {formatDate(story.created_at)}
          </time>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
            color: accent.text,
          }}>
            Lesen
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── Empty State ──────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>📭</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--color-text)', marginBottom: 12 }}>
        Noch keine Geschichten!
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-muted)', maxWidth: 400, margin: '0 auto 32px' }}>
        Öffne das KI-Tool, wähle den Kanal <strong>Kids Blog</strong> aus und erstelle die erste Geschichte!
      </p>
      <a
        href={process.env.NEXT_PUBLIC_CMCX_URL ?? 'https://cmcx.vercel.app'}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ fontSize: 16, padding: '16px 36px' }}
      >
        ✨ KI-Tool öffnen
      </a>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function HomePage() {
  let stories: KidsStory[] = [];
  try {
    stories = await getKidsStories();
  } catch {
    stories = [];
  }

  const featured = stories[0] ?? null;
  const rest     = stories.slice(1);

  return (
    <main>
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '80px 24px 100px', overflow: 'hidden', textAlign: 'center' }}>
        {/* Decorative blobs */}
        <div className="blob blob-yellow" style={{ width: 500, height: 500, top: '-20%', left: '-10%' }} />
        <div className="blob blob-blue"   style={{ width: 400, height: 400, bottom: '-20%', right: '-8%' }} />
        <div className="blob blob-pink"   style={{ width: 300, height: 300, top: '10%', right: '20%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          {/* Floating stars */}
          <div style={{ fontSize: 40, marginBottom: 20, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <span className="float-anim" style={{ animationDelay: '0s' }}>⭐</span>
            <span className="float-anim" style={{ animationDelay: '0.5s' }}>🌟</span>
            <span className="float-anim" style={{ animationDelay: '1s' }}>✨</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            marginBottom: 20,
          }}>
            Tolle Geschichten<br />
            <span className="gradient-text">für neugierige</span>{' '}
            <span className="gradient-text-blue">Köpfe!</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 18,
            lineHeight: 1.7,
            color: 'var(--color-muted)',
            marginBottom: 36,
            maxWidth: 500,
            margin: '0 auto 36px',
          }}>
            Spannende Wissens-Artikel über alles, was die Welt bewegt — einfach erklärt für schlaue Köpfe!
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#stories" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
              📚 Alle Geschichten
            </a>
            <a
              href={process.env.NEXT_PUBLIC_CMCX_URL ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: 16 }}
            >
              ✨ Neue Geschichte
            </a>
          </div>
        </div>
      </section>

      {/* ── Wavy divider ──────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', lineHeight: 0, marginBottom: -2 }}>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
          <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z"
                fill="white" opacity="0.6" />
        </svg>
      </div>

      {/* ── Stories Section ───────────────────────────────────── */}
      <section id="stories" style={{ padding: '60px 24px 80px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {stories.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Section header */}
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <span className="badge badge-yellow" style={{ marginBottom: 16 }}>
                  📖 Alle Geschichten
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                }}>
                  Was möchtest du heute<br />
                  <span className="gradient-text">entdecken?</span>
                </h2>
              </div>

              {/* Featured story — large card */}
              {featured && (
                <a href={`/artikel/${featured.id}`} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 0,
                  background: '#fff',
                  borderRadius: 32,
                  overflow: 'hidden',
                  border: '2px solid var(--color-outline-variant)',
                  textDecoration: 'none',
                  color: 'inherit',
                  marginBottom: 40,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="story-card"
                >
                  {/* Image */}
                  <div style={{ position: 'relative', minHeight: 320 }}>
                    <Image
                      src={storyImage(featured, 800, 600)}
                      alt={storyDisplayTitle(featured)}
                      fill
                      sizes="50vw"
                      className="object-cover"
                      priority
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,217,61,0.2), transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: 20, left: 20 }}>
                      <span className="badge badge-yellow">⭐ Highlight</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                      <span className="badge badge-green">✨ Neu</span>
                      <span className="badge badge-green">{featured.language === 'de' ? '🇩🇪' : '🇬🇧'}</span>
                    </div>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                      lineHeight: 1.2,
                      color: 'var(--color-text)',
                      marginBottom: 16,
                      letterSpacing: '-0.02em',
                    }}>
                      {storyDisplayTitle(featured)}
                    </h2>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 16,
                      lineHeight: 1.7,
                      color: 'var(--color-muted)',
                      marginBottom: 28,
                    }}>
                      {storyExcerpt(featured.kidsblog, 180)}
                    </p>
                    <span className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 15, padding: '13px 28px' }}>
                      Geschichte lesen 📖
                    </span>
                  </div>
                </a>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 24,
                }}>
                  {rest.map((story, i) => (
                    <StoryCard key={story.id} story={story} index={i + 1} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Fun Banner ────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-primary-container)',
        padding: '60px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            color: 'var(--color-primary)',
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}>
            Neugier kennt keine Grenzen!
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-primary)', opacity: 0.8, marginBottom: 28 }}>
            Jede Geschichte öffnet ein neues Fenster zur Welt.
          </p>
        </div>
      </section>
    </main>
  );
}
