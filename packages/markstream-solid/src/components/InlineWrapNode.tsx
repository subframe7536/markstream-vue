import type { JSX } from 'solid-js'
import type { ParsedNode } from 'stream-markdown-parser'
import type { RenderContext } from '../types'
import { Dynamic } from 'solid-js/web'
import RenderChildren from './RenderChildren'
import { getNodeList } from './shared/node-helpers'

export interface InlineWrapNodeProps {
  node: (ParsedNode & Record<string, unknown>) | null | undefined
  context?: RenderContext
  indexKey?: string | number
  tag?: keyof JSX.IntrinsicElements | string
}

export function InlineWrapNode(props: InlineWrapNodeProps) {
  const tag = () => props.tag || 'span'
  return (
    <Dynamic component={tag()}>
      <RenderChildren
        nodes={getNodeList((props.node as any)?.children)}
        context={props.context}
        prefix={`${String(props.indexKey ?? tag())}-${String(tag())}`}
      />
    </Dynamic>
  )
}

export default InlineWrapNode
