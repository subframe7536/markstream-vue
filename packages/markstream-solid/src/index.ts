import type {
  CustomComponentDisplayMode,
  CustomComponentMap,
  MarkstreamSolidComponent,
} from './customComponents'
import type { NodeComponentProps, NodeRendererProps, RenderContext, RenderNodeFn } from './types'
import './index.css'

export type {
  CustomComponentDisplayMode,
  CustomComponentMap,
  MarkstreamSolidComponent,
  NodeComponentProps,
  NodeRendererProps,
  RenderContext,
  RenderNodeFn,
}
export {
  clearGlobalCustomComponents,
  getCustomComponentDisplay,
  getCustomComponentsRevision,
  getCustomNodeComponents,
  removeCustomComponents,
  setCustomComponents,
  subscribeCustomComponents,
  withMarkstreamComponentDisplay,
} from './customComponents'
export { hydrateCustomTagContent } from './hydrateCustomTagContent'
export { setDefaultI18nMap, useSafeI18n } from './i18n/useSafeI18n'
export { default, NodeRenderer } from './NodeRenderer'
export { default as MarkdownRender } from './NodeRenderer'
export { renderInline, renderNodeChildren } from './renderers/renderChildren'
export { createRenderNode } from './renderers/renderNode'
export { sanitizeHtmlContent } from './sanitizeHtmlContent'
export type { SmoothMarkdownStreamOptions, SmoothMarkdownStreamSnapshot } from './useSmoothMarkdownStream'
export { useSmoothMarkdownStream } from './useSmoothMarkdownStream'
