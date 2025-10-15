/**
 * Functions to manage scripts and iframes
 */
export const activeAppEl = (element: Element) => {
  const dataSrc = element.getAttribute("data-src")

  if (dataSrc) {
    const replacement = element.cloneNode(true) as Element
    // Enable the element by setting src to data-src
    replacement.setAttribute("src", dataSrc)
    replacement.removeAttribute("data-src")
    // Change type back to original if necessary
    const originalType = element.getAttribute("data-type")
    if (originalType) {
      replacement.setAttribute("type", originalType)
      replacement.removeAttribute("data-type")
    }
    if (replacement.tagName === "IFRAME") (replacement as HTMLElement).style.display = ""
    element.replaceWith(replacement)
  }
}
export const disableAppEl = (element: Element) => {
  const src = element.getAttribute("src")
  if (src) {
    // Disable the element by setting data-src to src
    element.setAttribute("data-src", src)
    element.removeAttribute("src")
    if (element.tagName === "IFRAME") (element as HTMLElement).style.display = "none"

    // Change type to text/plain if necessary
    const type = element.getAttribute("type")
    if (type) {
      element.setAttribute("data-type", type)
      element.setAttribute("type", "text/plain")
    }
  }
}
export const getAppName = (element: Element) => element.getAttribute("data-app") as string | null
export const getAppElements = () =>
  Array.from(document.querySelectorAll("script[data-app], iframe[data-app]"))
