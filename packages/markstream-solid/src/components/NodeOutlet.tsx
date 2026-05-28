import type { ParsedNode } from 'stream-markdown-parser'
import type { NodeComponentProps, RenderContext } from '../types'
import { renderStandaloneNode } from './shared'

export type NodeOutletProps<TNode = ParsedNode> = NodeComponentProps<TNode> & {
  context?: RenderContext
}

export function NodeOutlet<TNode = ParsedNode>(props: NodeOutletProps<TNode>) {
  return renderStandaloneNode({
    ...props,
    ctx: props.context ?? props.ctx,
  })
}

export default NodeOutlet
