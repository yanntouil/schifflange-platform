import React from "react"

/**
 * Returns true if the user is on a desktop
 */
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
    setIsDesktop(!isMobile)
  }, [])
  return isDesktop
}

/**
 * Returns true if the user is on a Mac
 */
export const useIsMac = () => {
  const [isMac, setIsMac] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsMac(/macintosh|mac os x/.test(userAgent))
  }, [])
  return isMac
}
