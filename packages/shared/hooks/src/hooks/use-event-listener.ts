import React from "react"
/**
 * overload interface
 */
export function useEventListener<K extends keyof MediaQueryListEventMap>(
  // MediaQueryList Event based useEventListener interface
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: React.RefObject<MediaQueryList>,
  options?: boolean | AddEventListenerOptions,
): void
export function useEventListener<K extends keyof WindowEventMap>(
  // Window Event based useEventListener interface
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void
export function useEventListener<
  // Element Event based useEventListener interface
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions,
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  // Document Event based useEventListener interface
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: React.RefObject<Document>,
  options?: boolean | AddEventListenerOptions,
): void

/**
 * useEventListener
 */
export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | void = void,
>(
  eventName: KW | KH | KM,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | MediaQueryListEventMap[KM] | Event) => void,
  element?: React.RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores handler
  const savedHandler = React.useRef(handler)

  React.useLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  React.useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = savedHandler.current

    targetElement.addEventListener(eventName, listener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options])
}
