import type { NodeComponentProps } from '../types'
import { renderStandaloneNode } from './shared'

export function HeadingNode(props: NodeComponentProps<any>) {
  return renderStandaloneNode(props)
}

export default HeadingNode
