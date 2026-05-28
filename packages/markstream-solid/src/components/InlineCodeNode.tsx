import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function InlineCodeNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default InlineCodeNode
