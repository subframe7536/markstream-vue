import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function PreCodeNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default PreCodeNode
