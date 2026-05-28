import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function MathBlockNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default MathBlockNode
