import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function InsertNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default InsertNode
