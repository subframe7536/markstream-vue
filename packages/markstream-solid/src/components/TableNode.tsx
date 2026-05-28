import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function TableNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default TableNode
