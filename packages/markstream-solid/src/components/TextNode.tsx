import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function TextNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default TextNode
