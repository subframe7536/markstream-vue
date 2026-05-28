import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function StrongNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default StrongNode
