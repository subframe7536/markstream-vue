import type { ParsedNode } from 'stream-markdown-parser'
import type { RenderContext, RenderNodeFn } from '../types'
import { renderNodeChildren } from '../renderers/renderChildren'
import { createRenderNode } from '../renderers/renderNode'

export interface RenderChildrenProps {
  nodes?: readonly ParsedNode[] | null
  context?: RenderContext
  prefix?: string
  renderNode?: RenderNodeFn
}

export function RenderChildren(props: RenderChildrenProps) {
  const context = props.context ?? {}
  const renderNode = props.renderNode ?? createRenderNode(() => context)
  return renderNodeChildren(
    props.nodes as readonly ParsedNode[] | undefined,
    context,
    props.prefix ?? 'markstream-solid-children',
    renderNode,
  )
}

export default RenderChildren
