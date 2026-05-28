import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function CheckboxNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default CheckboxNode
