import { describe, expect, it } from 'vitest'
import {
  disableKatex,
  disableMermaid,
  enableKatex,
  enableMermaid,
  getCustomComponentDisplay,
  getCustomNodeComponents,
  getLanguageIcon,
  isKatexEnabled,
  isMermaidEnabled,
  normalizeKaTeXRenderInput,
  normalizeLanguageIdentifier,
  ParagraphNode,
  removeCustomComponents,
  setCustomComponents,
  SmoothStreamingContext,
  Tooltip,
  withMarkstreamComponentDisplay,
} from '../packages/markstream-solid/src'
import { hydrateCustomTagContent } from '../packages/markstream-solid/src/hydrateCustomTagContent'
import { setDefaultI18nMap, useSafeI18n } from '../packages/markstream-solid/src/i18n/useSafeI18n'
import { buildRenderContext, resolveParsedNodes } from '../packages/markstream-solid/src/NodeRenderer'
import { sanitizeHtmlContent } from '../packages/markstream-solid/src/sanitizeHtmlContent'
import { setMermaidWorker } from '../packages/markstream-solid/src/workers/mermaidWorkerClient'

interface ThinkingHtmlBlockNode {
  type: 'html_block'
  tag: 'thinking'
  raw: string
}

describe('markstream-solid baseline helpers', () => {
  it('sanitizes unsafe links from HTML content', () => {
    const html = '<a href="javascript:alert(1)">bad</a><a href="https://example.com">ok</a>'
    const output = sanitizeHtmlContent(html)
    expect(output).not.toContain('javascript:alert(1)')
    expect(output).toContain('https://example.com')
  })

  it('hydrates custom HTML tag content into parser nodes', () => {
    const nodes = hydrateCustomTagContent([
      {
        type: 'html_block',
        tag: 'thinking',
        raw: '<thinking>hello</thinking>',
      } satisfies ThinkingHtmlBlockNode,
    ], '<thinking>hello</thinking>', ['thinking'])

    expect(nodes[0]).toMatchObject({
      type: 'thinking',
      tag: 'thinking',
      content: 'hello',
      loading: false,
    })
  })

  it('keeps custom component registration scoped', () => {
    const globalComponent = (() => null) as any
    const scopedComponent = (() => null) as any
    setCustomComponents({ note: globalComponent })
    setCustomComponents('solid-test', { thinking: scopedComponent })

    expect(getCustomNodeComponents()).toMatchObject({ note: globalComponent })
    expect(getCustomNodeComponents('solid-test')).toMatchObject({
      note: globalComponent,
      thinking: scopedComponent,
    })

    removeCustomComponents('solid-test')
    expect(getCustomNodeComponents('solid-test')).toMatchObject({ note: globalComponent })
  })

  it('supports custom component display metadata helpers', () => {
    const component = (() => null) as any
    const displayed = withMarkstreamComponentDisplay(component, 'block')

    expect(displayed).toBe(component)
    expect(getCustomComponentDisplay(component)).toBe('block')
  })

  it('provides safe i18n fallbacks with overridable defaults', () => {
    const { t } = useSafeI18n()
    expect(t('common.copy')).toBe('Copy')
    expect(t('customMissingKey')).toBe('Custom Missing Key')

    setDefaultI18nMap({ 'common.copy': '复制' })
    expect(useSafeI18n().t('common.copy')).toBe('复制')
  })

  it('builds render context and resolves parsed nodes', () => {
    const ctx = buildRenderContext({
      content: '# Hello',
      customId: 'solid-test-context',
      isDark: true,
    })

    expect(ctx).toMatchObject({
      customId: 'solid-test-context',
      customHtmlTags: [],
      htmlPolicy: 'safe',
      isDark: true,
    })

    const nodes = resolveParsedNodes({
      content: '# Hello',
      customId: 'solid-test-context',
    }, '# Hello')

    expect(nodes[0]).toMatchObject({
      type: 'heading',
      level: 1,
    })
  })

  it('exposes the new Solid parity surface', () => {
    expect(typeof ParagraphNode).toBe('function')
    expect(typeof Tooltip).toBe('function')
    expect(SmoothStreamingContext).toBeTruthy()
    expect(typeof setMermaidWorker).toBe('function')
    expect(normalizeLanguageIdentifier('ts')).toBe('typescript')
    expect(getLanguageIcon('mermaid')).toContain('<svg')
    expect(normalizeKaTeXRenderInput('25℃ · x')).toBe('25°C ⋅ x')
  })

  it('supports optional runtime toggles', () => {
    disableKatex()
    disableMermaid()
    expect(isKatexEnabled()).toBe(false)
    expect(isMermaidEnabled()).toBe(false)

    enableKatex(() => ({ renderToString: () => '' }))
    enableMermaid(() => ({ parse: () => true }))
    expect(isKatexEnabled()).toBe(true)
    expect(isMermaidEnabled()).toBe(true)
  })
})
