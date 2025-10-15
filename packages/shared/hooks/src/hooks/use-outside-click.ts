import React from "react"

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  callback: (e: MouseEvent) => void,
  event: "mouseup" | "mousedown" = "mousedown"
) => {
  React.useEffect(() => {
    const listener = (e: MouseEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref]

      const contains = (r: React.RefObject<HTMLElement>) => !r.current || r.current.contains(e.target as Node)

      if (refs.some(contains)) return
      callback(e)
    }
    document.addEventListener(event, listener)
    return () => {
      document.removeEventListener(event, listener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, callback])
}
