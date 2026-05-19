import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getKidsStory, getKidsStories,
  storyDisplayTitle, storyExcerpt, storyImage, formatDate,
  parseStory, inlineMarkdown,
} from '../../../lib/supabase';

export const revalidate = 10;

export async function generateStaticParams() {
  try {
    const stories = await getKidsStories();
    return stories.map((s) => ({ id: s.id }));
  } catch { return []; }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const story = await getKidsStory(id);
  if (!story) return { title: 'Nicht gefunden' };
  return {
    title: storyDisplayTitle(story) + ' · StoryCloud',
    description: storyExcerpt(story.kidsblog, 160),
  };
}

/* ── Section renderer ────────────────────────────────────────── */
function renderSection(s: ReturnType<typeof parseStory>[number], i: number) {
  if (s.type === 'heading') {
    /* Skip h1 — it's rendered separately as hero title */
    if (s.level === 1) return null;

    if (s.level === 2) {
      return (
        <h2 key={i} style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: 'var(--color-text)',
          marginTop: 44,
          marginBottom: 16,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 12,
            background: 'var(--color-primary-container)',
            fontSize: 16, flexShrink: 0,
          }}>
            {getHeadingEmoji(s.content)}
          </span>
          <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(s.content) }} />
        </h2>
      );
    }

    /* h3 */
    return (
      <h3 key={i} style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
        color: 'var(--color-secondary)',
        marginTop: 28,
        marginBottom: 10,
        letterSpacing: '-0.01em',
      }}>
        <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(s.content) }} />
      </h3>
    );
  }

  if (s.type === 'paragraph') {
    return (
      <p key={i} style={{
        fontFamily: 'var(--font-body)',
        fontSize: 18,
        lineHeight: 1.85,
        color: 'var(--color-text)',
        marginBottom: 18,
      }}
        dangerouslySetInnerHTML={{ __html: inlineMarkdown(s.content) }}
      />
    );
  }

  if (s.type === 'blockquote') {
    return (
      <div key={i} className="fun-fact" style={{ margin: '28px 0' }}>
        <span style={{ fontSize: 20, marginRight: 8 }}>💡</span>
        <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(s.content) }} />
      </div>
    );
  }

  if (s.type === 'bullet') {
    return (
      <div key={i} style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        marginBottom: 12,
        padding: '14px 18px',
        background: 'var(--color-surface)',
        borderRadius: 16,
        border: '1px solid var(--color-outline-variant)',
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 999, flexShrink: 0,
          background: 'var(--color-primary-container)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: 'var(--color-primary)',
        }}>
          ★
        </span>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}
           dangerouslySetInnerHTML={{ __html: inlineMarkdown(s.content) }}
        />
      </div>
    );
  }

  return null;
}

/* Map section headings to fitting emojis */
function getHeadingEmoji(heading: string): string {
  const h = heading.toLowerCase();
  if (h.includes('wusstest') || h.includes('did you know') || h.includes('fact')) return '🤔';
  if (h.includes('was kannst') || h.includes('what can') || h.includes('tun')) return '🚀';
  if (h.includes('warum') || h.includes('why')) return '💭';
  if (h.includes('wie') || h.includes('how')) return '🔍';
  if (h.includes('was') || h.includes('what')) return '📖';
  if (h.includes('zukunft') || h.includes('future')) return '🔭';
  return '✨';
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function ArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getKidsStory(id);
  if (!story) notFound();

  const title    = storyDisplayTitle(story);
  const img      = storyImage(story, 1200, 600);
  const sections = parseStory(story.kidsblog);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Hero image */}
        <div style={{ position: 'relative', width: '100%', height: 'clamp(280px, 45vh, 500px)', overflow: 'hidden' }}>
          <Image
            src={img}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center 35%' }}
            priority
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(233,255,236,0.15) 0%, rgba(233,255,236,0.9) 85%, var(--color-bg) 100%)' }} />

          {/* Decorative stars */}
          <div style={{ position: 'absolute', top: 20, right: 24 }}>
            <span className="float-anim" style={{ fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>⭐</span>
          </div>
        </div>

        {/* Title block */}
        <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto', padding: '0 24px', marginTop: -20 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            <span className="badge badge-yellow">⭐ KI-Geschichte</span>
            <span className="badge badge-green">{story.language === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}</span>
            <span className="badge badge-blue">📅 {formatDate(story.created_at)}</span>
          </div>

          {/* Main title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            marginBottom: 20,
          }}>
            {title}
          </h1>

          {/* Reading time estimate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 32, borderBottom: '2px dashed var(--color-outline-variant)', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-muted)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              <span>⏱️</span>
              {Math.ceil(story.kidsblog.split(/\s+/).length / 120)} Min. lesen
            </div>
            <div style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--color-outline-variant)' }} />
            <div style={{ fontSize: 13, color: 'var(--color-muted)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              🧒 Für schlaue Köpfe
            </div>
          </div>
        </div>
      </section>

      {/* ── Article Content ───────────────────────────────────── */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 80px' }}>
        {sections.map((s, i) => renderSection(s, i))}

        {/* Back button */}
        <div style={{ marginTop: 60, paddingTop: 40, borderTop: '2px dashed var(--color-outline-variant)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="/" className="btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
            ← Alle Geschichten
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_CMCX_URL ?? 'https://cmcx.vercel.app'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ fontSize: 15 }}
          >
            ✨ Neue Geschichte erstellen
          </a>
        </div>
      </section>

      {/* ── Fun Facts Teaser ──────────────────────────────────── */}
      <section style={{
        background: 'var(--color-surface-mid)',
        borderTop: '2px solid var(--color-outline-variant)',
        borderBottom: '2px solid var(--color-outline-variant)',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌟</div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 20,
          color: 'var(--color-text)',
          marginBottom: 8,
        }}>
          Hat dir die Geschichte gefallen?
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--color-muted)' }}>
          Entdecke alle weiteren Geschichten auf StoryCloud!
        </p>
      </section>
    </main>
  );
}
