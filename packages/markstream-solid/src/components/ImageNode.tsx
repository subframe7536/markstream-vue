import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function ImageNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default ImageNode
