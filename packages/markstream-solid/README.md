# markstream-solid

Experimental SolidJS renderer for Markstream.

## Install

```bash
pnpm add markstream-solid solid-js
```

## Usage

```tsx
import MarkdownRender from 'markstream-solid'
import 'markstream-solid/index.css'

export default function Article() {
  return <MarkdownRender content="# Hello from markstream-solid" />
}
```

## Status

This is a baseline SolidJS port focused on the core markdown renderer contract: `content` / `nodes`, safe HTML handling, scoped custom components, and shared CSS. Advanced Monaco / Mermaid / KaTeX rich blocks have not reached parity with the Vue and React packages yet.

## Custom components

```tsx
import MarkdownRender, { setCustomComponents } from 'markstream-solid'

function ThinkingNode(props: any) {
  return <section>{String(props.node?.content ?? '')}</section>
}

setCustomComponents('demo', { thinking: ThinkingNode })
```
