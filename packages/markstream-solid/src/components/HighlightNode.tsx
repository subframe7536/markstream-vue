import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function HighlightNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default HighlightNode
