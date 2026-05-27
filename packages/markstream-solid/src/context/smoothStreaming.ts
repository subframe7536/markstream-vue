import { createContext } from 'solid-js'

export type SmoothStreamingContextValue = () => boolean

export const SmoothStreamingContext = createContext<SmoothStreamingContextValue | undefined>(undefined)
