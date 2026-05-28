import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function ReferenceNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default ReferenceNode
