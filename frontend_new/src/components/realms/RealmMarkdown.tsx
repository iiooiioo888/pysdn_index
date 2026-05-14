import { useEffect, useMemo, useRef, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

/**
 * RealmMarkdown — rich Markdown renderer with interactive features.
 *
 * Features:
 * - Full GFM markdown (images, links, tables, blockquotes, code, etc.)
 * - Image lightbox (click to zoom)
 * - Copy button on code blocks
 * - Auto-generated heading anchors with permalink
 * - Auto Table of Contents sidebar
 * - OpenCC CN→TW text transform on visible text only
 * - DOMPurify XSS protection
 */

interface RealmMarkdownProps {
  markdown: string
  textTransform?: (plain: string) => string
  showToc?: boolean
}

/* ── Types ────────────────────────────────────────────────────────── */

interface TocEntry {
  id: string
  level: number
  text: string
}

/* ── Helpers ──────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'heading'
}

function extractTocFromHtml(html: string): TocEntry[] {
  const toc: TocEntry[] = []
  const re = /<h([2-4])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/h[2-4]>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const level = Number(m[1])
    const id = m[2]
    const text = m[3].replace(/<[^>]+>/g, '').trim()
    if (id && text) toc.push({ id, level, text })
  }
  return toc
}

/** Safely extract text content from marked tokens */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tokensToText(tokens: any[]): string {
  return tokens.map((t: any) => {
    if (t.text !== undefined) return String(t.text)
    if (t.raw !== undefined) return String(t.raw)
    return ''
  }).join('')
}

/* ── marked renderer with IDs & lazy images ───────────────────────── */

/* eslint-disable @typescript-eslint/no-explicit-any */
function createRenderer() {
  const renderer = new marked.Renderer()

  renderer.heading = ({ tokens, depth }: any) => {
    const text = tokensToText(tokens)
    const id = slugify(text.replace(/<[^>]+>/g, ''))
    return `<h${depth} id="${id}">${tokensToText(tokens)}</h${depth}>`
  }

  renderer.image = ({ href, title, text }: any) => {
    const titleAttr = title ? ` title="${title}"` : ''
    return `<img src="${href}" alt="${text}" loading="lazy" decoding="async"${titleAttr} />`
  }

  renderer.link = ({ href, title, tokens }: any) => {
    const text = tokensToText(tokens)
    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    const titleAttr = title ? ` title="${title}"` : ''
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${href}"${titleAttr}${target}>${text}</a>`
  }

  renderer.table = ({ header, rows }: any) => {
    const headerCells = header.map((cell: any) => `<th>${tokensToText(cell.tokens)}</th>`).join('')
    const bodyRows = rows.map((row: any) => {
      const cells = row.map((cell: any) => `<td>${tokensToText(cell.tokens)}</td>`).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    return `<div class="realms-md-table-wrap"><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`
  }

  return renderer
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── marked config ────────────────────────────────────────────────── */

marked.setOptions({
  gfm: true,
  breaks: false,
})

/* ── textTransform helper ─────────────────────────────────────────── */

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

/* ── Sub-components ───────────────────────────────────────────────── */

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="realms-md-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt}>
      <div className="realms-md-lightbox-backdrop" />
      <div className="realms-md-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
        {alt ? <p className="realms-md-lightbox-caption">{alt}</p> : null}
        <button type="button" className="realms-md-lightbox-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
    </div>
  )
}

function TableOfContents({ entries, label }: { entries: TocEntry[]; label: string }) {
  if (entries.length < 2) return null

  return (
    <nav className="realms-md-toc" aria-label={label}>
      <h4 className="realms-md-toc-title">{label}</h4>
      <ul className="realms-md-toc-list">
        {entries.map((entry) => (
          <li key={entry.id} className={`realms-md-toc-item realms-md-toc-item--h${entry.level}`}>
            <a href={`#${entry.id}`}>{entry.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ── Main Component ───────────────────────────────────────────────── */

export function RealmMarkdown({ markdown, textTransform, showToc = false }: RealmMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  // Parse markdown → sanitized HTML
  const html = useMemo(() => {
    if (!markdown) return ''
    const renderer = createRenderer()
    const rawHtml = marked.parse(markdown, { renderer }) as string
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['img'],
      ADD_ATTR: ['target', 'rel', 'loading', 'decoding', 'id'],
    })
  }, [markdown])

  // Extract TOC from rendered HTML
  const toc = useMemo(() => extractTocFromHtml(html), [html])

  // Apply textTransform to text nodes after render
  useEffect(() => {
    if (!textTransform || !containerRef.current) return
    applyTransformToDOM(containerRef.current, textTransform)
  }, [html, textTransform])

  // Delegate click events for images
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement
        setLightbox({ src: img.src, alt: img.alt || '' })
      }
    }

    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [])

  // Inject copy buttons into <pre> blocks after render
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const pres = el.querySelectorAll('pre')
    for (const pre of pres) {
      if (pre.querySelector('.realms-md-copy-btn')) continue
      pre.style.position = 'relative'

      const code = pre.querySelector('code')
      const text = code?.textContent ?? pre.textContent ?? ''

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'realms-md-copy-btn'
      btn.setAttribute('aria-label', 'Copy code')
      btn.textContent = '⧉'
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const ta = document.createElement('textarea')
          ta.value = text
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          document.body.removeChild(ta)
        }
        btn.textContent = '✓'
        setTimeout(() => { btn.textContent = '⧉' }, 1500)
      })

      const slot = document.createElement('div')
      slot.className = 'realms-md-copy-btn-slot'
      slot.appendChild(btn)
      pre.appendChild(slot)
    }
  }, [html])

  return (
    <>
      <div className={`realms-md realms-md--rich${showToc && toc.length >= 2 ? ' realms-md--with-toc' : ''}`}>
        {showToc && toc.length >= 2 ? (
          <TableOfContents entries={toc} label="目錄" />
        ) : null}
        <div
          ref={containerRef}
          className="realms-md-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {lightbox ? (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </>
  )
}
