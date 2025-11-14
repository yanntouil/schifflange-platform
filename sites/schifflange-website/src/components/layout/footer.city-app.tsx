"use client"

import { Ui } from "@/components/ui"
import { LocalizeLanguage } from "@/lib/localize"
import { getServerTranslation } from "@/utils/localize"
import { cxm } from "@compo/utils"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import CityAppQRCode from "./footer.city-app.png"

/**
 * city app link
 */
const cityAppLink = "https://qrco.de/bdWfUj"

/**
 * footer city app
 */
type FooterCityAppProps = {
  lang: LocalizeLanguage
}
export const FooterCityApp: React.FC<FooterCityAppProps> = ({ lang }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isParentInView, setIsParentInView] = useState(false)

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

  return (
    <motion.div
      ref={containerRef}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cxm("size-18", !isParentInView && "fixed bottom-[160px] left-0 z-50")}
    >
      <motion.a
        href={cityAppLink}
        target='_blank'
        rel='noopener noreferrer nofollow'
        whileHover={{ scale: 1.1 }}
        className={cxm("inline-block size-20 rounded-[2px] bg-white", Ui.variants.focus({ variant: "visible" }))}
      >
        <Image src={CityAppQRCode} alt={_("city-app-alt")} className='size-full' width={80} height={80} priority />
        <Ui.SrOnly>{_("city-app")}</Ui.SrOnly>
      </motion.a>
    </motion.div>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    "city-app": "Click to open a link to download the app",
    "city-app-alt": "QR Code for the City App",
  },
  fr: {
    "city-app": "Cliquez pour ouvrir un lien pour télécharger l'application",
    "city-app-alt": "QR Code pour l'application de la ville",
  },
  de: {
    "city-app": "Klicken Sie, um einen Link zum Herunterladen der App zu öffnen",
    "city-app-alt": "QR-Code für die Stadt-App",
  },
  lb: {
    "city-app": "Klickt fir e Link opzemaachen fir d'App erofzelueden",
    "city-app-alt": "QR-Code fir d'Stad-App",
  },
}
