import slugifyLib from 'slugify';
import { supabase } from './supabase';

/**
 * Generate a URL-safe slug from a title.
 * Ensures uniqueness by appending a numeric suffix if needed.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugifyLib(title, {
    lower: true,
    strict: true,
    trim: true,
  }).substring(0, 80); // max 80 chars

  // Check if slug already exists
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .like('slug', `${base}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!data || data.length === 0) return base;

  // Find the next available suffix
  const existing = data.map((r) => r.slug as string);
  if (!existing.includes(base)) return base;

  let counter = 2;
  while (existing.includes(`${base}-${counter}`)) counter++;
  return `${base}-${counter}`;
}

/** Simple slug from title (no uniqueness check — use for reads/display only) */
export function toSlug(title: string): string {
  return slugifyLib(title, { lower: true, strict: true, trim: true });
}
