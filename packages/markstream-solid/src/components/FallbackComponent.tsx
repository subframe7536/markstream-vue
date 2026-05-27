import type { NodeComponentProps } from '../types'

export function FallbackComponent(props: NodeComponentProps<{ type: string }>) {
  return (
    <div class="unknown-node text-sm text-gray-500 italic">
      Unsupported node type:
      {' '}
      {String((props.node as any)?.type)}
    </div>
  )
}

export default FallbackComponent
