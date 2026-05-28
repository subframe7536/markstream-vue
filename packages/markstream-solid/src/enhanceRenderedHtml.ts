import { hideTooltip, showTooltipForAnchor } from './tooltip/singletonTooltip'

export interface EnhanceRenderedHtmlOptions {
  final?: boolean
  isDark?: boolean
  showTooltips?: boolean
  isCancelled?: () => boolean
}

export interface RenderedHtmlEnhancementHandle {
  dispose: () => void
}

const rootHandles = new WeakMap<HTMLElement, RenderedHtmlEnhancementHandle>()

export async function enhanceRenderedHtml(
  root: HTMLElement,
  options: EnhanceRenderedHtmlOptions = {},
): Promise<RenderedHtmlEnhancementHandle> {
  disposeRenderedHtmlEnhancements(root)

  const cleanupFns: Array<() => void> = []
  let disposed = false
  const handle: RenderedHtmlEnhancementHandle = {
    dispose: () => {
      if (disposed)
        return
      disposed = true
      for (let index = cleanupFns.length - 1; index >= 0; index -= 1) {
        try {
          cleanupFns[index]?.()
        }
        catch {
          // Best-effort cleanup only.
        }
      }
      if (rootHandles.get(root) === handle)
        rootHandles.delete(root)
      hideTooltip(true)
    },
  }

  rootHandles.set(root, handle)
  if (options.isCancelled?.())
    return handle

  if (options.showTooltips !== false)
    wireAnchorTooltips(root, cleanupFns, options)

  return handle
}

export function disposeRenderedHtmlEnhancements(root: HTMLElement | null | undefined) {
  if (!root)
    return
  rootHandles.get(root)?.dispose()
}

function wireAnchorTooltips(
  root: HTMLElement,
  cleanupFns: Array<() => void>,
  options: EnhanceRenderedHtmlOptions,
) {
  const anchors = Array.from(root.querySelectorAll<HTMLElement>('a[title], a[aria-label]'))
  for (const anchor of anchors) {
    const content = (anchor.getAttribute('title') || anchor.getAttribute('aria-label') || '').trim()
    if (!content)
      continue

    const onEnter = () => showTooltipForAnchor(anchor, content, 'top', false, undefined, options.isDark)
    const onLeave = () => hideTooltip()
    anchor.addEventListener('mouseenter', onEnter)
    anchor.addEventListener('focus', onEnter)
    anchor.addEventListener('mouseleave', onLeave)
    anchor.addEventListener('blur', onLeave)
    cleanupFns.push(() => {
      anchor.removeEventListener('mouseenter', onEnter)
      anchor.removeEventListener('focus', onEnter)
      anchor.removeEventListener('mouseleave', onLeave)
      anchor.removeEventListener('blur', onLeave)
    })
  }
}
