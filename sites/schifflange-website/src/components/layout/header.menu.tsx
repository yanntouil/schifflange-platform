"use client"

import { getServerTranslation } from "@/utils/localize"
import { cxm } from "@compo/utils"
import * as Primitive from "@radix-ui/react-navigation-menu"
import Image from "next/image"
import { Ui } from "../ui"
import { Container } from "./container"
import { type HeaderProps } from "./header"
import { LevelFirstList } from "./header.menu.level-first"
import LogoImage from "./logo.png"
import { Wrapper } from "./wrapper"

/**
 * display the header menu
 */
export const HeaderMenu = ({ lang, menu, isScrolled }: HeaderProps & { isScrolled: boolean }) => {
  const { _ } = getServerTranslation(lang, dictionary)
  return (
    <Wrapper
      className={cxm(
        "bg-white/0 text-foreground",
        "transition-all duration-300 ease-in-out",
        isScrolled ? "shadow-md bg-white" : ""
      )}
    >
      <Container className='flex justify-between items-start'>
        <div>
          <Ui.Link
            href='/'
            className={cxm("inline-block transition-all duration-300 ease-in-out", isScrolled ? "py-2" : "py-4")}
          >
            <Image
              src={LogoImage}
              alt={_("logo-alt")}
              className={cxm("transition-all duration-300 ease-in-out w-auto", isScrolled ? "h-12" : "h-20")}
              width={112}
              height={36}
              priority
            />
            <Ui.SrOnly>{_("homepage")}</Ui.SrOnly>
          </Ui.Link>
        </div>
        <Primitive.Root className='group/navigation-menu relative flex max-w-max flex-1 items-center justify-end'>
          <LevelFirstList items={menu} />
          <div className={cxm("absolute top-full right-0 isolate z-50 flex justify-center")}>
            <Primitive.Viewport
              className={cxm(
                "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden md:w-[var(--radix-navigation-menu-viewport-width)]",
                "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
                "data-[state=open]:animate-in data-[state=open]:zoom-in-90"
              )}
            />
          </div>
        </Primitive.Root>
      </Container>
    </Wrapper>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "logo-alt": "Commune de Schifflange",
    homepage: "Page d'accueil de la Commune de Schifflange",
  },
  en: {
    "logo-alt": "Municipality of Schifflange",
    homepage: "Homepage of the Municipality of Schifflange",
  },
  de: {
    "logo-alt": "Gemeinde Schifflingen",
    homepage: "Startseite der Gemeinde Schifflingen",
  },
  lb: {
    "logo-alt": "Gemeng Schëffleng",
    homepage: "Startsäit vun der Gemeng Schëffleng",
  },
}
