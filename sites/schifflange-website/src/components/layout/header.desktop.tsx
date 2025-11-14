"use client"

import React from "react"
import { type HeaderProps } from "./header"
import { HeaderMenu } from "./header.menu"
import { HeaderTop } from "./header.top"

const SCROLL_THRESHOLD = 20

/**
 * header
 * the header of the page
 */
export const HeaderDesktop = (props: HeaderProps) => {
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Track if the page is scrolled beyond the threshold
  React.useEffect(() => {
    const handleScroll = () => {
      const newIsScrolled = window.scrollY > SCROLL_THRESHOLD
      setIsScrolled((prev) => (prev !== newIsScrolled ? newIsScrolled : prev))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className='fixed top-0 inset-x-0 w-full'>
      <HeaderTop {...props} isScrolled={isScrolled} />
      <HeaderMenu {...props} isScrolled={isScrolled} />
    </div>
  )
}
