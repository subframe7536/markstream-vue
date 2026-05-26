import type { HtmlPolicy } from 'stream-markdown-parser'
import {
  BLOCKED_HTML_TAGS as BLOCKED_TAGS,
  isHtmlTagBlocked,
  isHtmlTagHardBlocked,
  sanitizeHtmlAttrs,
  VOID_HTML_TAGS as VOID_ELEMENTS,
} from 'stream-markdown-parser'

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}

function escapeAttr(input: string) {
  return escapeHtml(input)
}

interface HtmlToken {
  type: 'text' | 'tag_open' | 'tag_close' | 'self_closing'
  tagName?: string
  attrs?: Record<string, string>
  content?: string
}

function tokenizeHtml(html: string): HtmlToken[] {
  const tokens: HtmlToken[] = []
  let pos = 0
  while (pos < html.length) {
    const tagStart = html.indexOf('<', pos)
    if (tagStart === -1) {
      if (pos < html.length)
        tokens.push({ type: 'text', content: html.slice(pos) })
      break
    }
    if (tagStart > pos)
      tokens.push({ type: 'text', content: html.slice(pos, tagStart) })
    const tagEnd = html.indexOf('>', tagStart)
    if (tagEnd === -1)
      break
    const tagContent = html.slice(tagStart + 1, tagEnd).trim()
    if (!tagContent) {
      pos = tagEnd + 1
      continue
    }
    if (tagContent.startsWith('/')) {
      tokens.push({ type: 'tag_close', tagName: tagContent.slice(1).trim() })
      pos = tagEnd + 1
      continue
    }
    const isSelfClosing = tagContent.endsWith('/')
    const normalized = isSelfClosing ? tagContent.slice(0, -1).trim() : tagContent
    const spaceIndex = normalized.indexOf(' ')
    const tagName = spaceIndex === -1 ? normalized : normalized.slice(0, spaceIndex)
    const attrsPart = spaceIndex === -1 ? '' : normalized.slice(spaceIndex + 1)
    const attrs: Record<string, string> = {}
    if (attrsPart) {
      const attrRegex = /([^\s=]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S*)))?/g
      let match: RegExpExecArray | null
      while ((match = attrRegex.exec(attrsPart)) !== null) {
        const name = match[1]
        if (name)
          attrs[name] = match[2] ?? match[3] ?? match[4] ?? ''
      }
    }
    tokens.push({
      type: isSelfClosing || VOID_ELEMENTS.has(tagName.toLowerCase()) ? 'self_closing' : 'tag_open',
      tagName,
      attrs,
    })
    pos = tagEnd + 1
  }
  return tokens
}

function serializeAttrs(attrs: Record<string, string>) {
  return Object.entries(attrs).map(([name, value]) => value === '' ? ` ${name}` : ` ${name}="${escapeAttr(value)}"`).join('')
}

export function sanitizeHtmlContent(content: string, policy: HtmlPolicy = 'safe'): string {
  if (!content)
    return ''
  if (policy === 'escape')
    return escapeHtml(content)

  const output: string[] = []
  const stack: string[] = []
  let blockedDepth = 0

  for (const token of tokenizeHtml(content)) {
    if (token.type === 'text') {
      if (blockedDepth === 0)
        output.push(escapeHtml(token.content ?? ''))
      continue
    }

    const tagName = String(token.tagName ?? '').trim().toLowerCase()
    if (!tagName)
      continue

    if (BLOCKED_TAGS.has(tagName) || isHtmlTagHardBlocked(tagName, policy)) {
      if (token.type === 'tag_open')
        blockedDepth += 1
      else if (token.type === 'tag_close' && blockedDepth > 0)
        blockedDepth -= 1
      continue
    }

    if (blockedDepth > 0)
      continue

    if (policy === 'safe' && isHtmlTagBlocked(tagName, policy)) {
      output.push(escapeHtml(token.type === 'tag_close' ? `</${tagName}>` : `<${tagName}>`))
      continue
    }

    if (token.type === 'self_closing') {
      output.push(`<${tagName}${serializeAttrs(sanitizeHtmlAttrs(token.attrs ?? {}, policy, tagName))}>`)
      continue
    }
    if (token.type === 'tag_open') {
      output.push(`<${tagName}${serializeAttrs(sanitizeHtmlAttrs(token.attrs ?? {}, policy, tagName))}>`)
      if (!VOID_ELEMENTS.has(tagName))
        stack.push(tagName)
      continue
    }
    const matchedIndex = stack.lastIndexOf(tagName)
    if (matchedIndex === -1)
      continue
    while (stack.length > matchedIndex + 1) {
      const dangling = stack.pop()
      if (dangling)
        output.push(`</${dangling}>`)
    }
    stack.pop()
    output.push(`</${tagName}>`)
  }

  while (stack.length > 0) {
    const dangling = stack.pop()
    if (dangling)
      output.push(`</${dangling}>`)
  }
  return output.join('')
}
