import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function HardBreakNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default HardBreakNode
