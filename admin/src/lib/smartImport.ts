import { marked } from 'marked';

// ── Section headings that should always render as H2 ──────────────────────────
const KNOWN_SECTION_HEADERS = new Set([
  'introduction',
  'what happened',
  'why this matters',
  'why it matters',
  'key highlights',
  'key highlight',
  'how it works',
  'how the system works',
  'pros & cons',
  'pros and cons',
  'pros',
  'cons',
  'expert reaction',
  'expert and industry impact',
  'comparison',
  'future impact',
  'faqs',
  'frequently asked questions',
  'faq',
  'conclusion',
  'sources',
  'source',
  'list of new ai agents',
  'research and client coverage agents',
  'finance and operations agents',
  'microsoft 365 integration',
  'claude managed agents vs desktop plugins',
  'desktop plugin mode',
  'new financial data connectors',
]);

// Metadata key patterns near the start of a document
const METADATA_LINE_RE = /^(\*{0,2})(published|date|author|category|tags|source|by|updated)(\*{0,2})\s*:/i;
const DIVIDER_RE = /^-{3,}$|^\*{3,}$|^_{3,}$/;

// ── Step 1: strip frontmatter / metadata block ─────────────────────────────────
function stripMetadata(raw: string): { body: string; title: string; category?: string } {
  const lines = raw.split('\n');
  let title = '';
  let category: string | undefined;
  const bodyLines: string[] = [];

  // State machine: we're in a "preamble" zone until we hit substantive content
  let preambleDone = false;
  let consecutiveEmpty = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // ── Extract title from first # heading ────────────────────────────────────
    if (!title && line.startsWith('#')) {
      const match = line.match(/^#{1,3}\s+(.+)$/);
      if (match) {
        title = match[1].replace(/\*+/g, '').trim();
        // Don't add the main title to body (it goes into the title field)
        continue;
      }
    }

    // ── If we haven't finished the preamble yet, filter metadata lines ─────────
    if (!preambleDone) {
      // Blank line tracking
      if (!line) {
        consecutiveEmpty++;
        // After 2+ consecutive blanks following the title, we're done with preamble
        if (consecutiveEmpty >= 2 && title) {
          preambleDone = true;
        }
        continue; // don't add empty preamble lines to body
      } else {
        consecutiveEmpty = 0;
      }

      // Pure --- / *** dividers → skip
      if (DIVIDER_RE.test(line)) continue;

      // Metadata key-value lines like *Published: May 5, 2026* → skip & extract
      if (METADATA_LINE_RE.test(line)) {
        const catMatch = line.match(/^(\*{0,2})category(\*{0,2})\s*:\s*(.+)/i);
        if (catMatch) {
          category = catMatch[3].replace(/\*+/g, '').trim();
        }
        continue;
      }

      // If we've seen the title and this is a normal content line, preamble is done
      if (title) {
        preambleDone = true;
        bodyLines.push(rawLine);
      } else {
        // No title found yet — this is a content line, not metadata
        // Start including content immediately (title will be extracted from HTML later)
        preambleDone = true;
        bodyLines.push(rawLine);
      }
      continue;
    }

    bodyLines.push(rawLine);
  }

  return { body: bodyLines.join('\n').trim(), title, category };
}

// ── Step 2: normalise headings ────────────────────────────────────────────────
// Demote any subsequent H1 headings (after the first) to H2,
// and promote known section-name lines to ## headings.
// When titleExtracted=true, ALL H1s in the body are demoted to H2 (title was already removed).
function normaliseHeadings(text: string, titleExtracted = false): string {
  const lines = text.split('\n');
  let h1Count = 0;
  const out: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Markdown heading?
    if (line.startsWith('#')) {
      const m = line.match(/^(#+)\s+(.+)$/);
      if (m) {
        const level = m[1].length;
        const headingText = m[2];

        if (level === 1) {
          h1Count++;
          // If title was already extracted, ALL H1s in the body become H2
          // Otherwise only demote H1s after the first one
          if (titleExtracted || h1Count > 1) {
            out.push(`## ${headingText}`);
          } else {
            out.push(rawLine);
          }
        } else {
          out.push(rawLine);
        }
        continue;
      }
    }

    // Plain text that matches a known section name → convert to ## heading
    if (line && !line.startsWith('#')) {
      const normalised = line.toLowerCase().replace(/[^a-z0-9\s&]/g, '').trim();
      if (KNOWN_SECTION_HEADERS.has(normalised) && line.length < 80) {
        out.push(`## ${line.replace(/\*+/g, '').trim()}`);
        continue;
      }
    }

    out.push(rawLine);
  }

  return out.join('\n');
}

// ── Step 3: convert to HTML ────────────────────────────────────────────────────
function toHtml(markdown: string): string {
  marked.use({ gfm: true, breaks: false });
  return marked.parse(markdown) as string;
}

// ── Step 4: inject id slugs onto h2/h3/h4 for TOC ─────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function injectHeadingIds(html: string): string {
  const used: Record<string, number> = {};
  return html.replace(
    /<(h[2-4])(\s[^>]*)?>([^<]*)<\/h[2-4]>/gi,
    (match, tag: string, attrs = '', inner: string) => {
      if (/\bid=/.test(attrs)) return match;
      let slug = slugify(inner);
      if (!slug) return match;
      if (used[slug]) {
        used[slug]++;
        slug = `${slug}-${used[slug]}`;
      } else {
        used[slug] = 1;
      }
      return `<${tag}${attrs} id="${slug}">${inner}</${tag}>`;
    }
  );
}

// ── Step 5: extract snippet from first real paragraph in the HTML ──────────────
function extractSnippet(html: string): string {
  // Find all <p> tags and pick the first one that isn't just metadata or short
  const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  for (const m of pMatches) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
    // Skip empty, very short, or metadata-looking snippets
    if (
      text.length < 30 ||
      /^(published|category|date|author|source|by)\s*:/i.test(text)
    ) {
      continue;
    }
    return text.substring(0, 300);
  }
  return '';
}

// ── Step 6: extract tags from headings ────────────────────────────────────────
function extractTags(html: string): string {
  const matches = [...html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi)];
  return matches
    .slice(0, 6)
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim())
    .filter((t) => t.length > 2 && t.length < 45)
    .join(', ');
}

// ── Public API ─────────────────────────────────────────────────────────────────

export interface SmartImportResult {
  html: string;
  title: string;
  snippet: string;
  tags: string;
  category?: string;
}

/**
 * smartImport — convert raw markdown / HTML / plain text into a clean article.
 *
 * Steps:
 *  1. Strip frontmatter metadata (Published:, Category:, --- dividers)
 *  2. Extract main title from the first # heading
 *  3. Normalise remaining headings (demote extra H1s, convert known section names)
 *  4. Parse with marked → HTML
 *  5. Inject heading IDs for TOC
 *  6. Extract title / snippet / tags
 */
export function smartImport(raw: string): SmartImportResult {
  const trimmed = raw.trim();
  if (!trimmed) return { html: '', title: '', snippet: '', tags: '' };

  // 1. Strip metadata block, extract title & category from preamble
  const { body, title: preambleTitle, category } = stripMetadata(trimmed);

  // 2. Check for inline "Headline: xxx" or "Title: xxx" pattern in the body
  let title = preambleTitle;
  let bodyForProcessing = body;

  if (!title) {
    const bodyLines = body.split('\n');
    for (let i = 0; i < Math.min(bodyLines.length, 5); i++) {
      const l = bodyLines[i].trim();
      const m = l.match(/^(headline|title)\s*:\s*(.+)$/i);
      if (m) {
        title = m[2].trim();
        bodyLines.splice(i, 1);
        bodyForProcessing = bodyLines.join('\n').trim();
        break;
      }
    }
  }

  // 3. Normalise headings (demote extra H1s, known section names → ##)
  // Pass titleExtracted=true so all H1 body sections are demoted to H2
  const normalised = normaliseHeadings(bodyForProcessing, !!title);

  // 4. Convert to HTML
  const rawHtml = toHtml(normalised);

  // 5. Inject heading IDs
  let html = injectHeadingIds(rawHtml);

  // 6. If title not found from preamble, grab from first <h1> in rendered HTML
  if (!title) {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) {
      title = h1[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
      html = html.replace(h1[0], '').trim();
    } else {
      const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (h2) {
        title = h2[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
        html = html.replace(h2[0], '').trim();
      }
    }
  }

  const snippet = extractSnippet(html);
  const tags = extractTags(html);

  return {
    html: html.trim(),
    title: title.trim(),
    snippet: snippet.trim(),
    tags,
    category,
  };
}
