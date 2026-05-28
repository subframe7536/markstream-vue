import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function HtmlBlockNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default HtmlBlockNode
