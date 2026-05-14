import { useEffect, useMemo, useRef } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * RealmMarkdown — full Markdown renderer with image / link / table / blockquote support.
 *
 * - Uses `marked` (already in bundle via mermaid) for parsing.
 * - Uses `dompurify` for XSS safety.
 * - Applies `textTransform` (OpenCC CN→TW) to visible text nodes only,
 *   preserving URLs, code blocks, and HTML attributes.
 */

interface RealmMarkdownProps {
  markdown: string
  /** Transform visible text (e.g. CN→TW conversion). Applied to text nodes only, not URLs or code. */
  textTransform?: (plain: string) => string
}

/* ── marked config ────────────────────────────────────────────────── */

marked.setOptions({
  gfm: true,
  breaks: false,
})

/* ── textTransform helper ─────────────────────────────────────────── */

/**
 * Walk the sanitized DOM tree and apply textTransform to visible text nodes.
 * Skips <code>, <pre>, and href/src attributes.
 */
function applyTransformToDOM(root: HTMLElement, transform: (s: string) => string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      const tag = parent.tagName.toLowerCase()
      if (tag === 'code' || tag === 'pre' || tag === 'script' || tag === 'style') {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const textNodes: Text[] = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text)
  }

  for (const node of textNodes) {
    const original = node.textContent ?? ''
    if (original.trim()) {
      node.textContent = transform(original)
    }
  }
}

/* ── Component ────────────────────────────────────────────────────── */

export function RealmMarkdown({ markdown, textTransform }: RealmMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse markdown → sanitized HTML (memoized)
  const html = useMemo(() => {
    if (!markdown) return ''
    const rawHtml = marked.parse(markdown) as string
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['target', 'rel', 'loading', 'decoding'],
    })
  }, [markdown])

  // Apply textTransform to text nodes after render
  useEffect(() => {
    if (!textTransform || !containerRef.current) return
    applyTransformToDOM(containerRef.current, textTransform)
  }, [html, textTransform])

  return (
    <div
      ref={containerRef}
      className="realms-md realms-md--rich"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
