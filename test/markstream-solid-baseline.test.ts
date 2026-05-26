import { describe, expect, it } from 'vitest'
import { getCustomNodeComponents, removeCustomComponents, setCustomComponents } from '../packages/markstream-solid/src/customComponents'
import { hydrateCustomTagContent } from '../packages/markstream-solid/src/hydrateCustomTagContent'
import { sanitizeHtmlContent } from '../packages/markstream-solid/src/sanitizeHtmlContent'

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
      } as any,
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
})
