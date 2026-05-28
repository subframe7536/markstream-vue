import type { BaseNode, HtmlPolicy, MarkdownIt, ParsedNode, ParseOptions } from 'stream-markdown-parser'
import type { CustomComponentMap } from './customComponents'
import type { RenderContext } from './types'
import { renderToString } from 'solid-js/web'
import { parseNestedMarkdownToNodes } from './parseNestedMarkdownToNodes'
import { createRenderNode } from './renderers/renderNode'

export interface MarkstreamSolidRenderOptions {
  cacheKey?: string
  final?: boolean
  parseOptions?: ParseOptions
  customMarkdownIt?: (markdown: MarkdownIt) => MarkdownIt
  customHtmlTags?: readonly string[]
  htmlPolicy?: HtmlPolicy
  allowHtml?: boolean
  customId?: string
  customComponents?: CustomComponentMap
  isDark?: boolean
}

export type RenderableMarkdownNode = (ParsedNode | BaseNode) & Record<string, unknown>
export type NestedMarkdownHtmlInput = Parameters<typeof parseNestedMarkdownToNodes>[0]
export type NestedMarkdownHtmlOptions = MarkstreamSolidRenderOptions

function buildRenderContext(options: MarkstreamSolidRenderOptions = {}): RenderContext {
  return {
    customId: options.customId,
    customHtmlTags: options.customHtmlTags,
    customComponents: options.customComponents,
    htmlPolicy: options.allowHtml === false ? 'escape' : (options.htmlPolicy ?? 'safe'),
    isDark: options.isDark,
  }
}

export function renderMarkdownNodesToHtml(
  nodes: readonly RenderableMarkdownNode[] | null | undefined,
  options: MarkstreamSolidRenderOptions = {},
) {
  const list = Array.isArray(nodes) ? nodes : []
  if (!list.length)
    return ''
  const ctx = buildRenderContext(options)
  const renderNode = createRenderNode(() => ctx)
  const prefix = options.cacheKey || options.customId || 'markstream-solid-html'
  return renderToString(() => list.map((node, index) => renderNode(node as ParsedNode, `${prefix}-${index}`, ctx)))
}

export function renderMarkdownNodeToHtml(
  node: RenderableMarkdownNode | null | undefined,
  options: MarkstreamSolidRenderOptions = {},
) {
  return node ? renderMarkdownNodesToHtml([node], options) : ''
}

export function renderMarkdownToHtml(
  content: string,
  options: MarkstreamSolidRenderOptions = {},
) {
  return renderNestedMarkdownToHtml({ content }, options)
}

export function renderNestedMarkdownToHtml(
  input: NestedMarkdownHtmlInput,
  options: NestedMarkdownHtmlOptions = {},
) {
  const nodes = parseNestedMarkdownToNodes(input, {
    cacheKey: options.cacheKey,
    final: options.final,
    parseOptions: options.parseOptions,
    customHtmlTags: options.customHtmlTags,
    customMarkdownIt: options.customMarkdownIt,
  })
  return renderMarkdownNodesToHtml(nodes as RenderableMarkdownNode[], options)
}
