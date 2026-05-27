import type {
  CustomComponentDisplayMode,
  CustomComponentMap,
  MarkstreamSolidComponent,
} from './customComponents'
import type { NodeComponentProps, NodeRendererProps, RenderContext, RenderNodeFn } from './types'
import './index.css'
import './workers/katexRenderer.worker?worker'
import './workers/mermaidParser.worker?worker'

export type {
  CustomComponentDisplayMode,
  CustomComponentMap,
  MarkstreamSolidComponent,
  NodeComponentProps,
  NodeRendererProps,
  RenderContext,
  RenderNodeFn,
}
export { AdmonitionNode } from './components/AdmonitionNode'
export { BlockquoteNode } from './components/BlockquoteNode'
export { CheckboxNode } from './components/CheckboxNode'
export { CodeBlockNode } from './components/CodeBlockNode'
export { D2BlockNode } from './components/D2BlockNode'
export { DefinitionListNode } from './components/DefinitionListNode'
export { EmojiNode } from './components/EmojiNode'
export { EmphasisNode } from './components/EmphasisNode'
export { FallbackComponent } from './components/FallbackComponent'
export { FootnoteAnchorNode } from './components/FootnoteAnchorNode'
export { FootnoteNode } from './components/FootnoteNode'
export { FootnoteReferenceNode } from './components/FootnoteReferenceNode'
export { HardBreakNode } from './components/HardBreakNode'
export { HeadingNode } from './components/HeadingNode'
export { HighlightNode } from './components/HighlightNode'
export { HtmlBlockNode } from './components/HtmlBlockNode'
export { HtmlInlineNode } from './components/HtmlInlineNode'
export { ImageNode } from './components/ImageNode'
export { InfographicBlockNode } from './components/InfographicBlockNode'
export { InlineCodeNode } from './components/InlineCodeNode'
export { InsertNode } from './components/InsertNode'
export { LinkNode } from './components/LinkNode'
export { ListItemNode } from './components/ListItemNode'
export { ListNode } from './components/ListNode'
export { MarkdownCodeBlockNode } from './components/MarkdownCodeBlockNode'
export { MathBlockNode } from './components/MathBlockNode'
export { MathInlineNode } from './components/MathInlineNode'
export { MermaidBlockNode } from './components/MermaidBlockNode'
export { default, NodeRenderer } from './components/NodeRenderer'
export { default as MarkdownRender } from './components/NodeRenderer'
export { ParagraphNode } from './components/ParagraphNode'
export { PreCodeNode } from './components/PreCodeNode'
export { ReferenceNode } from './components/ReferenceNode'
export { StrikethroughNode } from './components/StrikethroughNode'
export { StrongNode } from './components/StrongNode'
export { SubscriptNode } from './components/SubscriptNode'
export { SuperscriptNode } from './components/SuperscriptNode'
export { TableNode } from './components/TableNode'
export { TextNode } from './components/TextNode'
export { ThematicBreakNode } from './components/ThematicBreakNode'
export { Tooltip } from './components/Tooltip'
export type { TooltipPlacement, TooltipProps } from './components/Tooltip'
export { VmrContainerNode } from './components/VmrContainerNode'
export type {
  SmoothMarkdownStreamOptions,
  SmoothMarkdownStreamSnapshot,
} from './composables/useSmoothMarkdownStream'
export { useSmoothMarkdownStream } from './composables/useSmoothMarkdownStream'
export { SmoothStreamingContext } from './context/smoothStreaming'
export type { SmoothStreamingContextValue } from './context/smoothStreaming'
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
export type { D2Loader } from './optional/d2'
export { disableD2, enableD2, getD2, isD2Enabled, setD2Loader } from './optional/d2'
export { getInfographic } from './optional/infographic'
export type { KatexLoader } from './optional/katex'
export { disableKatex, enableKatex, getKatex, isKatexEnabled, setKatexLoader } from './optional/katex'
export type { MermaidLoader } from './optional/mermaid'
export { disableMermaid, enableMermaid, getMermaid, isMermaidEnabled, setMermaidLoader } from './optional/mermaid'
export {
  isCodeBlockRuntimeReady,
  preloadCodeBlockRuntime,
  resetCodeBlockRuntimeReadyForTest,
} from './optional/monaco'
export { renderInline, renderNodeChildren } from './renderers/renderChildren'
export { createRenderNode } from './renderers/renderNode'
export { sanitizeHtmlContent } from './sanitizeHtmlContent'
export type {
  CodeBlockNodeProps,
  CodeBlockPreviewPayload,
  D2BlockNodeProps,
  ImageNodeProps,
  InfographicBlockNodeProps,
  LinkNodeProps,
  MathBlockNodeProps,
  MathInlineNodeProps,
  MermaidBlockEvent,
  MermaidBlockNodeProps,
  PreCodeNodeProps,
} from './types/component-props'
export type {
  CodeBlockDiffAppearance,
  CodeBlockDiffHideUnchangedRegions,
  CodeBlockDiffHunkActionContext,
  CodeBlockDiffHunkActionKind,
  CodeBlockDiffHunkSide,
  CodeBlockDiffLineStyle,
  CodeBlockDiffUnchangedRegionStyle,
  CodeBlockMonacoLanguage,
  CodeBlockMonacoOptions,
  CodeBlockMonacoTheme,
  CodeBlockMonacoThemeObject,
} from './types/monaco'
export type { NodeComponentProps as SolidNodeComponentProps } from './types/node-component'
export {
  getLanguageIcon,
  isLikelyIncompleteLanguageIdentifier,
  languageMap,
  normalizeLanguageIdentifier,
  resolveMonacoLanguageId,
  setLanguageIconResolver,
} from './utils/languageIcon'
export type { LanguageIconResolver } from './utils/languageIcon'
export { normalizeKaTeXRenderInput } from './utils/normalizeKaTeXRenderInput'
export * from './workers/katexCdnWorker'
export * from './workers/katexWorkerClient'
export * from './workers/mermaidCdnWorker'
export * from './workers/mermaidWorkerClient'
export { KATEX_COMMANDS, normalizeStandaloneBackslashT, setDefaultMathOptions } from 'stream-markdown-parser'
export type { MathOptions } from 'stream-markdown-parser'
