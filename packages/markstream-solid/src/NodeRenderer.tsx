import type { ParsedNode, ParseOptions } from 'stream-markdown-parser'
import type { NodeRendererProps, RenderContext } from './types'
import { createMemo, For, useContext } from 'solid-js'
import { getMarkdown, normalizeCustomHtmlTags, parseMarkdownToStructure } from 'stream-markdown-parser'
import { SmoothStreamingContext } from './context/smoothStreaming'
import { getCustomNodeComponents } from './customComponents'
import { hydrateCustomTagContent } from './hydrateCustomTagContent'
import { createRenderNode } from './renderers/renderNode'
import { useSmoothMarkdownStream } from './useSmoothMarkdownStream'

function text(value: unknown) {
  return String(value ?? '')
}

const markdownCache = new Map<string, ReturnType<typeof getMarkdown>>()

export function buildRenderContext(props: NodeRendererProps): RenderContext {
  const scopedCustomComponents = getCustomNodeComponents(props.customId)
  return {
    customId: props.customId,
    customHtmlTags: normalizeCustomHtmlTags(props.customHtmlTags),
    htmlPolicy: props.htmlPolicy ?? 'safe',
    customComponents: props.customComponents
      ? { ...scopedCustomComponents, ...props.customComponents }
      : scopedCustomComponents,
    isDark: props.isDark,
  }
}

export function resolveParsedNodes(props: NodeRendererProps, content: string) {
  if (Array.isArray(props.nodes))
    return props.nodes as ParsedNode[]
  if (!content)
    return []

  const customHtmlTags = normalizeCustomHtmlTags([
    ...(props.customHtmlTags || []),
    ...(props.parseOptions?.customHtmlTags || []),
  ])
  const cacheKey = `${props.customId || 'markstream-solid'}::${customHtmlTags.join(',')}`
  let markdown = markdownCache.get(cacheKey)
  if (!markdown) {
    markdown = getMarkdown(cacheKey, { customHtmlTags })
    markdownCache.set(cacheKey, markdown)
  }
  const parser = props.customMarkdownIt ? props.customMarkdownIt(markdown) : markdown
  const parseOptions: ParseOptions = {
    ...(props.parseOptions ?? {}),
    final: props.final,
    customHtmlTags,
  }
  return hydrateCustomTagContent(
    parseMarkdownToStructure(content, parser, parseOptions) as ParsedNode[],
    content,
    customHtmlTags,
  )
}

export function NodeRenderer(props: NodeRendererProps) {
  const parentSmoothStreaming = useContext(SmoothStreamingContext)
  const smoothStream = useSmoothMarkdownStream(props.smoothStreamingOptions)
  const smoothStreamingEnabled = createMemo(() => {
    if (props.smoothStreaming === false || Array.isArray(props.nodes))
      return false
    if (parentSmoothStreaming?.())
      return false
    return props.smoothStreaming === true || props.smoothStreaming === 'auto'
  })
  const content = createMemo(() => {
    const raw = text(props.content)
    if (!smoothStreamingEnabled())
      return raw
    if (smoothStream.source !== raw) {
      if (raw.startsWith(smoothStream.source))
        smoothStream.enqueue(raw.slice(smoothStream.source.length))
      else
        smoothStream.reset(raw)
    }
    if (props.final)
      smoothStream.finish()
    return smoothStream.visible
  })

  const renderContext = createMemo<RenderContext>(() => buildRenderContext(props))
  const parsedNodes = createMemo(() => resolveParsedNodes(props, content()))
  const renderNode = createRenderNode(renderContext)

  return (
    <SmoothStreamingContext.Provider value={smoothStreamingEnabled}>
      <div class={`markstream-solid markdown-renderer${props.class ? ` ${props.class}` : ''}`}>
        <For each={parsedNodes()}>
          {(node, index) => renderNode(node as ParsedNode, `${props.customId || 'solid'}-${index()}`, renderContext())}
        </For>
      </div>
    </SmoothStreamingContext.Provider>
  )
}

export default NodeRenderer
