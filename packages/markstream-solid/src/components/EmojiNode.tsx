import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function EmojiNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default EmojiNode
