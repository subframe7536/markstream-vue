import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function BlockquoteNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default BlockquoteNode
