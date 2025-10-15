import React from "react"

type CopiedValue = string | ClipboardItems | null
type CopyFn = (text: string | ClipboardItems) => Promise<boolean> // Return success

/**
 * useCopyToClipboard
 */
export const useCopyToClipboard = (delay: number = 1000): [CopiedValue, CopyFn, boolean] => {
  const [copiedText, setCopiedText] = React.useState<CopiedValue>(null)
  const [done, setDone] = React.useState<boolean>(false)
  React.useEffect(() => {
    if (!done) return
    const to = setTimeout(() => setDone(false), delay)
    return () => clearTimeout(to)
  }, [done, delay])
  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) return false
    try {
      if (typeof text === "string") await navigator.clipboard.writeText(text)
      else navigator.clipboard.write(text)
      setCopiedText(text)
      setDone(true)
      return true
    } catch (error) {
      setCopiedText(null)
      return false
    }
  }
  return [copiedText, copy, done]
}
