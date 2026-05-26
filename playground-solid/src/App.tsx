import { createSignal } from 'solid-js'
import MarkdownRender from 'markstream-solid'

const SAMPLE = `# markstream-solid\n\nA baseline **SolidJS** port for Markstream.\n\n- content / nodes rendering\n- safe HTML handling\n- scoped custom components\n\n\`\`\`ts\nconsole.log('hello solid')\n\`\`\``

export default function App() {
  const [content, setContent] = createSignal(SAMPLE)
  return (
    <main style={{ margin: '0 auto', 'max-width': '960px', padding: '2rem 1.5rem' }}>
      <h1>markstream-solid playground</h1>
      <textarea
        value={content()}
        onInput={event => setContent(event.currentTarget.value)}
        style={{ width: '100%', height: '14rem', 'margin-bottom': '1.5rem', 'font-family': 'monospace' }}
      />
      <MarkdownRender content={content()} />
    </main>
  )
}
