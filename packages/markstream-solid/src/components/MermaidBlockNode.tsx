import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function MermaidBlockNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default MermaidBlockNode
