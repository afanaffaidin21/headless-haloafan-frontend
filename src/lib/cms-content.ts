import sanitizeHtml from "sanitize-html";

/** The single reading-speed assumption used for all CMS articles. */
export const READING_WORDS_PER_MINUTE = 200;

const CMS_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "div",
    "em",
    "figcaption",
    "figure",
    "h2",
    "h3",
    "h4",
    "hr",
    "i",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "s",
    "strong",
    "span",
    "sub",
    "sup",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    code: ["class"],
    figure: ["class"],
    img: ["src", "alt", "width", "height", "loading", "decoding"],
    pre: ["class"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
};

/**
 * Sanitizes trusted WordPress editorial HTML before it reaches the browser.
 * Gutenberg structure is retained, while executable or unsafe attributes are
 * removed by sanitize-html's allowlist rather than regular expressions.
 */
export function sanitizeCmsHtml(value: string | null | undefined): string {
  return sanitizeHtml(typeof value === "string" ? value : "", CMS_HTML_OPTIONS);
}

/** Returns visible article text for excerpts and deterministic reading time. */
export function extractVisibleText(value: string | null | undefined): string {
  const sanitized = sanitizeCmsHtml(value);
  return sanitizeHtml(sanitized, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
    textFilter: (text) => `${text} `,
  })
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateReadingMinutes(
  value: string | null | undefined
): number {
  const text = extractVisibleText(value);
  if (!text) return 0;

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / READING_WORDS_PER_MINUTE));
}

export function deriveExcerpt(
  excerpt: string | null | undefined,
  content: string | null | undefined,
  maximumLength = 240
): string {
  const fromExcerpt = extractVisibleText(excerpt);
  const source = fromExcerpt || extractVisibleText(content);
  if (source.length <= maximumLength) return source;
  return `${source.slice(0, maximumLength).trimEnd()}…`;
}
