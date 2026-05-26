import type { JSX } from 'solid-js'
import type { ParsedNode } from 'stream-markdown-parser'
import type { RenderContext, RenderNodeFn } from '../types'
import { For } from 'solid-js'

export function renderNodeChildren(
  children: readonly ParsedNode[] | undefined,
  ctx: RenderContext,
  prefix: string,
  renderNode: RenderNodeFn,
) {
  return (
    <For each={children || []}>
      {(child, index) => renderNode(child, `${prefix}-${index()}`, ctx)}
    </For>
  ) as unknown as JSX.Element
}

export function renderInline(
  children: readonly ParsedNode[] | undefined,
  ctx: RenderContext,
  prefix: string,
  renderNode: RenderNodeFn,
) {
  return renderNodeChildren(children, ctx, `${prefix}-inline`, renderNode)
}
