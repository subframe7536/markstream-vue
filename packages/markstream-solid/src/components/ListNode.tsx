import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function ListNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default ListNode
