import type { JSX } from 'solid-js'
import type { ParsedNode } from 'stream-markdown-parser'
import type { RenderContext, RenderNodeFn } from '../types'
import { For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  getHtmlTagFromContent,
  sanitizeHtmlAttrs,
  sanitizeImageSrc,
  shouldOpenLinkInNewTab,
  stripCustomHtmlWrapper,
} from 'stream-markdown-parser'
import { getCustomNodeComponents } from '../customComponents'
import { sanitizeHtmlContent } from '../sanitizeHtmlContent'
import { renderNodeChildren } from './renderChildren'

const AUTO_DIR: JSX.HTMLAttributes<HTMLElement>['dir'] = 'auto'

function text(value: unknown) {
  return String(value ?? '')
}

function isNodeArray(value: unknown): value is ParsedNode[] {
  return Array.isArray(value)
}

function renderCodeBlock(node: any) {
  const language = text(node.language).trim().toLowerCase()
  const className = language ? `language-${language}` : undefined
  return (
    <pre class="code-block-node" data-language={language || undefined}>
      <code class={className}>{text(node.code || node.content || node.raw)}</code>
    </pre>
  )
}

function renderTable(node: any, ctx: RenderContext, prefix: string, renderNode: RenderNodeFn) {
  const headers = Array.isArray(node.headers) ? node.headers : []
  const rows = Array.isArray(node.rows) ? node.rows : []
  return (
    <div class="table-node-wrapper">
      <table class="table-node">
        <Show when={headers.length > 0}>
          <thead>
            <tr>
              <For each={headers}>
                {(cell: any, idx) => (
                  <th dir={AUTO_DIR}>
                    {renderNodeChildren(cell.children || [], ctx, `${prefix}-th-${idx()}`, renderNode)}
                  </th>
                )}
              </For>
            </tr>
          </thead>
        </Show>
        <tbody>
          <For each={rows}>
            {(row: any, rowIndex) => (
              <tr>
                <For each={row.cells || []}>
                  {(cell: any, cellIndex) => (
                    <td dir={AUTO_DIR}>
                      {renderNodeChildren(cell.children || [], ctx, `${prefix}-td-${rowIndex()}-${cellIndex()}`, renderNode)}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  )
}

function renderHtmlNode(node: any, ctx: RenderContext, renderNode: RenderNodeFn) {
  const rawContent = text(node.content || node.raw)
  const tag = text(node.tag || getHtmlTagFromContent(rawContent)).toLowerCase()
  const customComponents = ctx.customComponents ?? getCustomNodeComponents(ctx.customId)
  const custom = tag ? customComponents[tag] : undefined
  const isCustomAllowed = tag && (ctx.customHtmlTags || []).includes(tag)
  if (isCustomAllowed && custom) {
    const coerced = {
      ...node,
      type: tag,
      tag,
      content: stripCustomHtmlWrapper(rawContent, tag),
    }
    return <Dynamic component={custom} node={coerced} ctx={ctx} renderNode={renderNode} indexKey={tag} customId={ctx.customId} isDark={ctx.isDark} />
  }
  const safeHtml = sanitizeHtmlContent(rawContent, ctx.htmlPolicy ?? 'safe')
  return node.type === 'html_block'
    ? <div class="html-block-node" innerHTML={safeHtml} />
    : <span class="html-inline-node" innerHTML={safeHtml} />
}

export function createRenderNode(ctxAccessor: () => RenderContext): RenderNodeFn {
  const renderNode: RenderNodeFn = (node, key, passedCtx) => {
    const ctx = passedCtx || ctxAccessor()
    const customComponents = ctx.customComponents ?? getCustomNodeComponents(ctx.customId)
    const custom = customComponents[node.type]
    if (custom)
      return <Dynamic component={custom} node={node} ctx={ctx} renderNode={renderNode} indexKey={key} customId={ctx.customId} isDark={ctx.isDark} />

    switch (node.type) {
      case 'text':
      case 'text_special':
        return <>{text((node as any).content)}</>
      case 'paragraph':
        return <p dir={AUTO_DIR}>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</p>
      case 'heading': {
        const level = Math.min(6, Math.max(1, Number((node as any).level || 1)))
        const Tag = `h${level}` as keyof JSX.IntrinsicElements
        return <Dynamic component={Tag} {...{ dir: AUTO_DIR }}>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</Dynamic>
      }
      case 'blockquote':
        return <blockquote>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</blockquote>
      case 'list': {
        const ordered = !!(node as any).ordered
        const Tag = ordered ? 'ol' : 'ul'
        return (
          <Dynamic component={Tag} start={ordered ? (node as any).start : undefined}>
            <For each={(node as any).items || []}>{(item: any, index) => renderNode(item, `${key}-${index()}`, ctx)}</For>
          </Dynamic>
        )
      }
      case 'list_item':
        return <li>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</li>
      case 'strong':
        return <strong>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</strong>
      case 'emphasis':
        return <em>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</em>
      case 'strikethrough':
        return <del>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</del>
      case 'highlight':
        return <mark>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</mark>
      case 'insert':
        return <ins>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</ins>
      case 'subscript':
        return <sub>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</sub>
      case 'superscript':
        return <sup>{renderNodeChildren((node as any).children, ctx, key, renderNode)}</sup>
      case 'inline_code':
        return <code>{text((node as any).code || (node as any).content || (node as any).raw)}</code>
      case 'hardbreak':
        return <br />
      case 'link': {
        const href = sanitizeHtmlAttrs({ href: text((node as any).href) }).href
        const rel = href && shouldOpenLinkInNewTab(href) ? 'noreferrer noopener' : undefined
        const target = rel ? '_blank' : undefined
        return (
          <a href={href || undefined} rel={rel} target={target} title={text((node as any).title) || undefined}>
            {isNodeArray((node as any).children) && (node as any).children.length > 0
              ? renderNodeChildren((node as any).children, ctx, key, renderNode)
              : text((node as any).text || href)}
          </a>
        )
      }
      case 'image': {
        const src = sanitizeImageSrc(text((node as any).src || (node as any).url || (node as any).href))
        return <img src={src || undefined} alt={text((node as any).alt)} title={text((node as any).title) || undefined} loading="lazy" />
      }
      case 'table':
        return renderTable(node as any, ctx, key, renderNode)
      case 'definition_list':
        return (
          <dl>
            <For each={(node as any).items || []}>
              {(item: any, index) => (
                <>
                  <dt>{renderNodeChildren(item.term || [], ctx, `${key}-term-${index()}`, renderNode)}</dt>
                  <dd>{renderNodeChildren(item.definition || [], ctx, `${key}-def-${index()}`, renderNode)}</dd>
                </>
              )}
            </For>
          </dl>
        )
      case 'footnote':
        return <div class="footnote-node">{renderNodeChildren((node as any).children, ctx, key, renderNode)}</div>
      case 'footnote_reference':
        return <sup class="footnote-reference"><a href={`#fn-${text((node as any).id)}`}>{text((node as any).id)}</a></sup>
      case 'footnote_anchor':
        return <a href={`#fnref-${text((node as any).id)}`}>↩</a>
      case 'admonition':
        return (
          <div class={`admonition admonition-${text((node as any).kind || 'note')}`}>
            <div class="admonition-header">{text((node as any).title || (node as any).kind || 'note')}</div>
            <div class="admonition-body">{renderNodeChildren((node as any).children, ctx, key, renderNode)}</div>
          </div>
        )
      case 'checkbox':
      case 'checkbox_input':
        return <input type="checkbox" checked={!!(node as any).checked} disabled readOnly />
      case 'emoji':
        return <>{text((node as any).raw || (node as any).content || (node as any).markup)}</>
      case 'math_inline':
        return <code class="math-inline-node">{text((node as any).content || (node as any).raw)}</code>
      case 'math_block':
        return <pre class="math-block-node"><code>{text((node as any).content || (node as any).raw)}</code></pre>
      case 'reference':
        return <span class="reference-node">{text((node as any).id || (node as any).label)}</span>
      case 'html_block':
      case 'html_inline':
        return renderHtmlNode(node, ctx, renderNode)
      case 'thematic_break':
        return <hr />
      case 'code_block':
        return renderCodeBlock(node)
      default:
        return <div class="fallback-node">{text((node as any).raw || (node as any).content || node.type)}</div>
    }
  }
  return renderNode
}
