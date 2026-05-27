import type { ParsedNode } from 'stream-markdown-parser'
import type { NodeComponentProps, RenderContext } from '../types'
import { createRenderNode } from '../renderers/renderNode'

function resolveRenderContext(props: NodeComponentProps<any>): RenderContext {
  if (props.ctx)
    return props.ctx
  return {
    customId: props.customId,
    isDark: props.isDark,
  }
}

export function renderStandaloneNode<TNode = ParsedNode>(props: NodeComponentProps<TNode>) {
  const ctx = resolveRenderContext(props)
  const renderNode = props.renderNode ?? createRenderNode(() => ctx)
  const key = String(props.indexKey ?? (props.node as any)?.type ?? 'node')
  return renderNode(props.node as ParsedNode, key, ctx)
}

export function createNodeComponent<TNode = ParsedNode>() {
  return function NodeComponent(props: NodeComponentProps<TNode>) {
    return renderStandaloneNode(props)
  }
}
