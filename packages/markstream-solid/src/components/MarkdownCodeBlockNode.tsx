import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function MarkdownCodeBlockNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default MarkdownCodeBlockNode
