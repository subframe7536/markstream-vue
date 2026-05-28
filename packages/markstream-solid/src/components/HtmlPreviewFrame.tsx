import { createMemo } from 'solid-js'

export interface HtmlPreviewFrameProps {
  code: string
  isDark?: boolean
  htmlPreviewAllowScripts?: boolean
  htmlPreviewSandbox?: string
  onClose?: () => void
  title?: string
}

function resolveHtmlPreviewSandboxValue(htmlPreviewSandbox: unknown, htmlPreviewAllowScripts?: boolean) {
  if (typeof htmlPreviewSandbox === 'string')
    return htmlPreviewSandbox
  if (htmlPreviewSandbox !== undefined)
    return ''
  return htmlPreviewAllowScripts === true ? 'allow-scripts' : ''
}

export function HtmlPreviewFrame(props: HtmlPreviewFrameProps) {
  const srcdoc = createMemo(() => {
    const base = props.code || ''
    const lowered = base.trim().toLowerCase()
    if (lowered.startsWith('<!doctype') || lowered.startsWith('<html') || lowered.startsWith('<body'))
      return base
    const bg = props.isDark ? '#020617' : '#ffffff'
    const fg = props.isDark ? '#e5e7eb' : '#020617'
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        background-color: ${bg};
        color: ${fg};
      }
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', ui-sans-serif, sans-serif;
      }
    </style>
  </head>
  <body>
    ${base}
  </body>
</html>`
  })

  return (
    <iframe
      class="html-preview-frame__iframe"
      sandbox={resolveHtmlPreviewSandboxValue(props.htmlPreviewSandbox, props.htmlPreviewAllowScripts)}
      referrerPolicy="no-referrer"
      src="about:blank"
      srcdoc={srcdoc()}
      title={props.title || 'Preview'}
    />
  )
}

export default HtmlPreviewFrame
