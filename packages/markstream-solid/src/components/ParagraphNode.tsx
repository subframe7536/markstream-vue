import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function ParagraphNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default ParagraphNode
