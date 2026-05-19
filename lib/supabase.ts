import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isConfigured = !!(url && key);
export const supabase = isConfigured ? createClient(url, key) : null;

export interface KidsStory {
  id: string;
  created_at: string;
  title: string;
  idea: string;
  tone: string;
  language: string;
  channels: string[];
  kidsblog: string;
  image_url: string | null;
  image_prompt: string | null;
}

export async function getKidsStories(): Promise<KidsStory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, created_at, title, idea, tone, language, channels, kidsblog, image_url, image_prompt')
    .not('kidsblog', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as KidsStory[];
}

export async function getKidsStory(id: string): Promise<KidsStory | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, created_at, title, idea, tone, language, channels, kidsblog, image_url, image_prompt')
    .eq('id', id)
    .not('kidsblog', 'is', null)
    .single();

  if (error) return null;
  return data as KidsStory;
}

/** Extract the first # heading from kidsblog content as display title */
export function storyDisplayTitle(story: KidsStory): string {
  const m = story.kidsblog?.match(/^#\s+(.+)/m);
  if (m?.[1]) return m[1].replace(/^\[[A-Z_]+\]\s*/, '').trim();
  return story.title;
}

/** Get the first prose paragraph after the title for card previews */
export function storyExcerpt(kidsblog: string, max = 120): string {
  const lines = kidsblog.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;
    const clean = trimmed.replace(/\*\*/g, '').replace(/\*/g, '');
    return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
  }
  return '';
}

/** Deterministic Picsum seed image */
export function storyImage(story: KidsStory, w = 600, h = 400): string {
  if (story.image_url?.startsWith('http')) return story.image_url;
  const seed = story.id.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'kids';
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/** Format date in German, child-friendly */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

/** Parse kidsblog markdown into sections for rendering */
export interface StorySection {
  type: 'heading' | 'paragraph' | 'blockquote' | 'bullet' | 'image';
  level?: number; /* for heading */
  content: string;
  alt?: string; /* for image */
}

export function parseStory(content: string): StorySection[] {
  const sections: StorySection[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const h3    = trimmed.match(/^###\s+(.*)/);
    const h2    = trimmed.match(/^##\s+(.*)/);
    const h1    = trimmed.match(/^#\s+(.*)/);
    const bq    = trimmed.match(/^>\s*(.*)/);
    const bullet = trimmed.match(/^[-*]\s+(.*)/);
    /* Embedded markdown image: ![alt](url) */
    const img   = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

    if (h1) {
      sections.push({ type: 'heading', level: 1, content: h1[1] });
    } else if (h2) {
      sections.push({ type: 'heading', level: 2, content: h2[1] });
    } else if (h3) {
      sections.push({ type: 'heading', level: 3, content: h3[1] });
    } else if (img) {
      sections.push({ type: 'image', content: img[2], alt: img[1] || 'Illustration' });
    } else if (bq) {
      sections.push({ type: 'blockquote', content: bq[1] });
    } else if (bullet) {
      sections.push({ type: 'bullet', content: bullet[1] });
    } else {
      sections.push({ type: 'paragraph', content: trimmed });
    }
  }
  return sections;
}

/** Apply **bold** inline markdown */
export function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
