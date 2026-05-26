# SolidJS

`markstream-solid` is the experimental baseline SolidJS port. It focuses on the core renderer contract: Markdown `content` / parsed `nodes`, safe HTML policy handling, scoped custom components, and the shared Markstream CSS surface.

Install the package with Solid:

```bash
pnpm add markstream-solid solid-js
```

```tsx
import MarkdownRender from 'markstream-solid'
import 'markstream-solid/index.css'

export default function Article() {
  return <MarkdownRender content="# Hello from markstream-solid" />
}
```

Scoped custom components use the same registry shape as the other framework ports:

```tsx
import MarkdownRender, { setCustomComponents } from 'markstream-solid'

function ThinkingNode(props: any) {
  return <section>{String(props.node?.content ?? '')}</section>
}

setCustomComponents('demo', {
  thinking: ThinkingNode,
})
```

Local playground:

```bash
pnpm play:solid
```

## Current scope

- Baseline renderer parity for standard Markdown node rendering
- Safe HTML sanitization / escaping via `htmlPolicy`
- Scoped custom component registration via `setCustomComponents()`
- Shared Markstream CSS entrypoints (`index.css`, `index.px.css`, `index.tailwind.css`)

## Not yet at parity

The SolidJS port is intentionally narrower than the Vue 3 and React packages right now. Monaco-backed code blocks, Mermaid / KaTeX rich rendering, and the heavier worker-assisted nodes have not been ported yet.
