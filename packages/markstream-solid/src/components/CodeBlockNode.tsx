import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function CodeBlockNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default CodeBlockNode
