import type { SolidRenderableNode, SolidRenderContext } from './node-helpers'
import { resolveCustomHtmlTag } from '../../utils/customHtmlTag'
import { clampPreviewHeight, estimateInfographicPreviewHeight, estimateMermaidPreviewHeight, parsePositiveNumber } from './diagram-height'
import { getHtmlTagFromContent, resolveCodeBlockLanguage, stripCustomHtmlWrapper } from './node-helpers'

export type CodeBlockMode = 'mermaid' | 'd2' | 'infographic' | 'pre' | 'code'

export function resolveNodeOutletCodeMode(
  node: SolidRenderableNode,
  context?: SolidRenderContext,
): CodeBlockMode {
  if (context?.renderCodeBlocksAsPre)
    return 'pre'

  const language = resolveCodeBlockLanguage(node)
  if (language === 'd2' || language === 'd2lang')
    return 'd2'
  if (language === 'infographic')
    return 'infographic'
  if (language === 'mermaid')
    return 'mermaid'
  return 'code'
}

export function resolveHtmlTag(node: SolidRenderableNode) {
  return String((node as any)?.tag || '').trim().toLowerCase() || getHtmlTagFromContent((node as any)?.content)
}

export function coerceCustomHtmlNode(node: SolidRenderableNode) {
  const tag = resolveHtmlTag(node)
  if (!tag)
    return node
  return {
    ...(node as any),
    type: tag,
    tag,
    content: stripCustomHtmlWrapper((node as any)?.content, tag),
  } as SolidRenderableNode
}

export function coerceBuiltinHtmlNode(node: SolidRenderableNode, resolvedType: string) {
  const tag = resolveHtmlTag(node)
  if (!tag)
    return node
  return {
    ...(node as any),
    type: resolvedType,
    tag,
  } as SolidRenderableNode
}

export function resolveNodeOutletCustomInputs(
  node: SolidRenderableNode,
  context?: SolidRenderContext,
) {
  if (String((node as any)?.type || '') !== 'code_block')
    return null

  const codeMode = resolveNodeOutletCodeMode(node, context)
  if (codeMode === 'mermaid') {
    return withEstimatedPreviewHeight(
      context?.mermaidProps,
      estimateMermaidPreviewHeight(getNodeCode(node)),
    )
  }
  if (codeMode === 'd2')
    return context?.d2Props ?? null
  if (codeMode === 'infographic') {
    return withEstimatedPreviewHeight(
      context?.infographicProps,
      estimateInfographicPreviewHeight(getNodeCode(node)),
    )
  }
  return context?.codeBlockProps ?? null
}

export function resolveNodeOutletCustomComponent(
  node: SolidRenderableNode,
  context?: SolidRenderContext,
  customComponents?: Record<string, any> | null,
) {
  const mapping = customComponents ?? context?.customComponents ?? null
  if (!mapping)
    return null

  const resolvedType = String((node as any)?.type || '')
  if (resolvedType === 'code_block') {
    const language = resolveCodeBlockLanguage(node)
    const customForLanguage = language ? mapping[language] : null
    if (customForLanguage)
      return customForLanguage

    const codeMode = resolveNodeOutletCodeMode(node, context)
    if (codeMode === 'mermaid' && mapping.mermaid)
      return mapping.mermaid
    if (codeMode === 'd2' && mapping.d2)
      return mapping.d2
    if (codeMode === 'infographic' && mapping.infographic)
      return mapping.infographic
    if (mapping.code_block)
      return mapping.code_block
  }

  const direct = mapping[resolvedType]
  if (direct)
    return direct

  const customHtml = resolveCustomHtmlTag(node as any, mapping, context?.customHtmlTags)
  return customHtml?.component ?? null
}

function getNodeCode(node: SolidRenderableNode) {
  return String((node as any)?.code ?? '')
}

function withEstimatedPreviewHeight(props: Record<string, any> | null | undefined, estimatedHeight: number) {
  const next = { ...(props || {}) }
  if (parsePositiveNumber(next.estimatedPreviewHeightPx) == null) {
    next.estimatedPreviewHeightPx = clampPreviewHeight(
      estimatedHeight,
      undefined,
      next.maxHeight === 'none' ? null : (parsePositiveNumber(next.maxHeight) ?? undefined),
    )
  }
  return next
}
