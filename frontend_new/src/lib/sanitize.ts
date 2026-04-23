import DOMPurify from 'dompurify'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'span', 'ul', 'li', 'ol', 'code', 'pre', 'h3', 'h4', 'h5', 'h6', 'div'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  })
}
