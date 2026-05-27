import type { JSX } from 'solid-js'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { createEffect, createMemo, createSignal, onCleanup, Show } from 'solid-js'
import { Portal } from 'solid-js/web'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  visible: boolean
  anchorEl: HTMLElement | null
  content: string
  placement?: TooltipPlacement
  offset?: number
  originX?: number | null
  originY?: number | null
  id?: string | null
  isDark?: boolean | null
}

function detectDarkModeHint(hint?: boolean | null) {
  if (typeof hint === 'boolean')
    return hint
  if (typeof document !== 'undefined') {
    try {
      if (document.documentElement.classList.contains('dark'))
        return true
    }
    catch {}
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    catch {}
  }
  return false
}

export function Tooltip(props: TooltipProps) {
  let tooltipRef: HTMLDivElement | undefined
  const [ready, setReady] = createSignal(false)
  const [style, setStyle] = createSignal<JSX.CSSProperties>({
    transform: 'translate3d(0px, 0px, 0px)',
    left: '0px',
    position: 'fixed',
    top: '0px',
  })

  const isDarkEffective = createMemo(() => detectDarkModeHint(props.isDark))

  createEffect(() => {
    if (!props.visible) {
      setReady(false)
      return
    }
    if (!props.anchorEl || !tooltipRef) {
      setReady(true)
      return
    }

    let cancelled = false
    const update = async () => {
      if (!props.anchorEl || !tooltipRef)
        return
      const { x, y } = await computePosition(props.anchorEl, tooltipRef, {
        placement: props.placement ?? 'top',
        middleware: [offset(props.offset ?? 8), flip(), shift({ padding: 8 })],
        strategy: 'fixed',
      })
      if (cancelled)
        return
      setStyle({
        left: '0px',
        position: 'fixed',
        top: '0px',
        transform: `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`,
      })
    }

    void update().then(() => {
      if (!cancelled)
        setReady(true)
    })

    const cleanup = autoUpdate(props.anchorEl, tooltipRef, update)
    onCleanup(() => {
      cancelled = true
      cleanup?.()
    })
  })

  if (typeof document === 'undefined')
    return null

  return (
    <Show when={props.visible && ready()}>
      <Portal>
        <div
          id={props.id ?? undefined}
          ref={tooltipRef}
          style={style()}
          class={[
            'ms-tooltip z-[9999] inline-block text-base py-2 px-3 rounded-md shadow-md whitespace-nowrap pointer-events-none border tooltip-element',
            isDarkEffective() ? 'bg-gray-900 text-white border-gray-700 is-dark' : 'bg-white text-gray-900 border-gray-200',
          ].join(' ')}
          role="tooltip"
        >
          {props.content}
        </div>
      </Portal>
    </Show>
  )
}

export default Tooltip
