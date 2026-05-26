import type { JSX } from 'solid-js'
import type { BaseNode, HtmlPolicy, MarkdownIt, ParseOptions, ParsedNode } from 'stream-markdown-parser'
import type { CustomComponentMap } from './customComponents'
import type { SmoothMarkdownStreamOptions } from './useSmoothMarkdownStream'

export interface NodeRendererProps {
  content?: string
  nodes?: readonly BaseNode[] | null
  final?: boolean
  parseOptions?: ParseOptions
  customMarkdownIt?: (md: MarkdownIt) => MarkdownIt
  customHtmlTags?: readonly string[]
  htmlPolicy?: HtmlPolicy
  customId?: string
  customComponents?: CustomComponentMap
  isDark?: boolean
  class?: string
  smoothStreaming?: boolean | 'auto'
  smoothStreamingOptions?: SmoothMarkdownStreamOptions
}

export interface RenderContext {
  customId?: string
  customHtmlTags?: readonly string[]
  htmlPolicy?: HtmlPolicy
  customComponents?: CustomComponentMap
  isDark?: boolean
}

export interface NodeComponentProps<TNode = unknown> {
  node: TNode
  ctx?: RenderContext
  renderNode?: RenderNodeFn
  indexKey?: string
  customId?: string
  isDark?: boolean
  children?: JSX.Element
}

export type RenderNodeFn = (node: ParsedNode, key: string, ctx: RenderContext) => JSX.Element
