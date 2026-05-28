import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function HtmlInlineNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default HtmlInlineNode
