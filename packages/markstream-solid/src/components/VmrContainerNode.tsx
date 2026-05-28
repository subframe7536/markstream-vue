import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function VmrContainerNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default VmrContainerNode
