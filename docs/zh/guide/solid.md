# SolidJS

`markstream-solid` 是实验性的 SolidJS 基线版 port，先覆盖核心渲染器契约：Markdown `content` / 预解析 `nodes`、安全 HTML 策略、scoped custom components，以及共享的 Markstream CSS。

安装：

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

自定义组件继续使用与其它框架 port 一致的 scoped registry：

```tsx
import MarkdownRender, { setCustomComponents } from 'markstream-solid'

function ThinkingNode(props: any) {
  return <section>{String(props.node?.content ?? '')}</section>
}

setCustomComponents('demo', {
  thinking: ThinkingNode,
})
```

本地 playground：

```bash
pnpm play:solid
```

## 当前范围

- 标准 Markdown 节点的基线渲染能力
- 通过 `htmlPolicy` 控制安全 HTML 转义 / 清洗
- 通过 `setCustomComponents()` 做 scoped custom component 注册
- 复用 Markstream CSS 入口（`index.css` / `index.px.css` / `index.tailwind.css`）

## 暂未对齐

当前 SolidJS port 仍然比 Vue 3 / React 版更窄：Monaco 富代码块、Mermaid / KaTeX 富渲染，以及更重的 worker 驱动节点还没有迁移完成。
