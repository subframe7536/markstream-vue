import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function MathInlineNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default MathInlineNode
