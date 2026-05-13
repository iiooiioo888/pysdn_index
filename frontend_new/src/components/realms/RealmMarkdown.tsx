type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string; key: string }
  | { type: 'paragraph'; text: string; key: string }
  | { type: 'list'; ordered: boolean; items: string[]; key: string }
  | { type: 'code'; text: string; key: string }

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim()
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let code: string[] | null = null

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    blocks.push({ type: 'paragraph', text: stripInlineMarkdown(paragraph.join(' ')), key: `p-${blocks.length}` })
    paragraph = []
  }

  const flushList = () => {
    if (!list) return
    blocks.push({ type: 'list', ordered: list.ordered, items: list.items.map(stripInlineMarkdown), key: `l-${blocks.length}` })
    list = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      flushParagraph()
      flushList()
      if (code) {
        blocks.push({ type: 'code', text: code.join('\n'), key: `c-${blocks.length}` })
        code = null
      } else {
        code = []
      }
      continue
    }

    if (code) {
      code.push(line)
      continue
    }

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: heading[1].length as 1 | 2 | 3 | 4,
        text: stripInlineMarkdown(heading[2]),
        key: `h-${blocks.length}`,
      })
      continue
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/)
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/)
    if (bullet || ordered) {
      flushParagraph()
      const item = bullet?.[1] ?? ordered?.[1] ?? ''
      const isOrdered = !!ordered
      if (!list || list.ordered !== isOrdered) {
        flushList()
        list = { ordered: isOrdered, items: [] }
      }
      list.items.push(item)
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  flushParagraph()
  flushList()
  if (code) blocks.push({ type: 'code', text: code.join('\n'), key: `c-${blocks.length}` })

  return blocks
}

export function RealmMarkdown({
  markdown,
  textTransform,
}: {
  markdown: string
  /** 對標題／段落／清單套用轉換；不套用於程式碼區塊，避免破壞程式與資料格式 */
  textTransform?: (plain: string) => string
}) {
  const blocks = parseMarkdown(markdown)
  const tx = textTransform ?? ((plain: string) => plain)

  return (
    <div className="realms-md">
      {blocks.map((block) => {
        if (block.type === 'heading') {
          const Tag = `h${Math.min(block.level + 1, 5)}` as 'h2' | 'h3' | 'h4' | 'h5'
          return <Tag key={block.key}>{tx(block.text)}</Tag>
        }
        if (block.type === 'list') {
          if (block.ordered) {
            return (
              <ol key={block.key}>
                {block.items.map((item, index) => (
                  <li key={`${block.key}-${index}`}>{tx(item)}</li>
                ))}
              </ol>
            )
          }
          return (
            <ul key={block.key}>
              {block.items.map((item, index) => (
                <li key={`${block.key}-${index}`}>{tx(item)}</li>
              ))}
            </ul>
          )
        }
        if (block.type === 'code') {
          return (
            <pre key={block.key}>
              <code>{block.text}</code>
            </pre>
          )
        }
        return <p key={block.key}>{tx(block.text)}</p>
      })}
    </div>
  )
}
