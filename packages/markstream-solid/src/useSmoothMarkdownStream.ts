import type { SmoothMarkdownStreamOptions, SmoothMarkdownStreamSnapshot } from 'markstream-core'
import { createSmoothMarkdownStream } from 'markstream-core'
import { createMemo, createSignal, onCleanup } from 'solid-js'

export type { SmoothMarkdownStreamOptions, SmoothMarkdownStreamSnapshot }

export function useSmoothMarkdownStream(options: SmoothMarkdownStreamOptions = {}) {
  const controller = createSmoothMarkdownStream(options)
  const [snapshot, setSnapshot] = createSignal<SmoothMarkdownStreamSnapshot>(controller.getSnapshot())
  const unsubscribe = controller.subscribe(() => setSnapshot(controller.getSnapshot()))
  controller.resume()
  onCleanup(() => {
    unsubscribe()
    controller.pause()
  })
  return createMemo(() => ({
    ...snapshot(),
    enqueue: controller.enqueue,
    finish: controller.finish,
    flush: controller.flush,
    reset: controller.reset,
    pause: controller.pause,
    resume: controller.resume,
    getSnapshot: controller.getSnapshot,
  }))()
}
