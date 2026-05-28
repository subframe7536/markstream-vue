import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function LinkNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default LinkNode
