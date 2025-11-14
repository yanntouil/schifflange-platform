"use client"

import { Ui } from "@/components/ui"
import { LocalizeLanguage } from "@/lib/localize"
import { getServerTranslation } from "@/utils/localize"
import { cxm } from "@compo/utils"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const SCROLL_THRESHOLD = 140
const SCROLL_DOWN_AMOUNT = 200

/**
 * footer scroll top
 */
type FooterScrollTopProps = {
  lang: LocalizeLanguage
}
export const FooterScrollTop: React.FC<FooterScrollTopProps> = ({ lang }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [isParentInView, setIsParentInView] = useState(false)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track parent visibility using IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsParentInView(entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    )

    const parent = containerRef.current.parentElement
    if (parent) {
      observer.observe(parent)
    }

    return () => {
      if (parent) {
        observer.unobserve(parent)
      }
    }
  }, [])

  // Determine button state
  const isScrolledBeyondThreshold = scrollY > SCROLL_THRESHOLD
  const rotation = isScrolledBeyondThreshold ? 0 : 180

  // Handle click
  const handleClick = () => {
    if (isScrolledBeyondThreshold) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Scroll down 200px
      window.scrollTo({ top: scrollY + SCROLL_DOWN_AMOUNT, behavior: "smooth" })
    }
  }

  return (
    <motion.div
      ref={containerRef}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cxm("size-13", !isParentInView ? "fixed bottom-8 right-8 z-50" : "")}
    >
      <motion.button
        type='button'
        onClick={handleClick}
        animate={{ rotate: rotation }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1 }}
        className={cxm(
          "size-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center",
          Ui.variants.focus({ variant: "visible" })
        )}
      >
        <ArrowUp className='size-5 stroke-[1.5]' aria-hidden />
        <Ui.SrOnly>{isScrolledBeyondThreshold ? _("scroll-top") : _("scroll-down")}</Ui.SrOnly>
      </motion.button>
    </motion.div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "scroll-top": "Scroll to top",
    "scroll-down": "Scroll down",
  },
  fr: {
    "scroll-top": "Retour en haut de la page",
    "scroll-down": "Défiler vers le bas",
  },
  de: {
    "scroll-top": "Nach oben scrollen",
    "scroll-down": "Nach unten scrollen",
  },
  lb: {
    "scroll-top": "Zeréck op de Top",
    "scroll-down": "Erofscrolle",
  },
}
