"use client"

import { useTranslation } from "@/lib/localize"
import { usePathname } from "next/navigation"
import { Ui } from "../ui"
import { type HeaderProps } from "./header"
import { itemVariants } from "./header.top.item"

/**
 * display a language selector in the header
 */
export const HeaderLanguages = (props: HeaderProps & { isScrolled: boolean }) => {
  const { isScrolled } = props
  const { _, language, languages } = useTranslation(dictionary)
  // Remove the language prefix from the current path
  const pathname = usePathname()
  const pathWithoutLang = pathname.replace(/^\/(fr|en|de)/, "") || "/"

  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger className={itemVariants({ isScrolled })}>
        {_(`language-code-${language}`)}
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content side='bottom' align='end' sideOffset={8}>
        {languages.map((lang) => (
          <Ui.DropdownMenu.Item key={lang} asChild>
            <Ui.Link href={pathWithoutLang} lang={lang}>
              {_(`language-${lang}`)}
            </Ui.Link>
          </Ui.DropdownMenu.Item>
        ))}
      </Ui.DropdownMenu.Content>
    </Ui.DropdownMenu.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  fr: {
    "language-fr": "Français",
    "language-code-fr": "FR",
    "language-en": "Anglais",
    "language-code-en": "EN",
    "language-de": "Allemand",
    "language-code-de": "DE",
    "language-lb": "Luxembourgeois",
    "language-code-lb": "LU",
  },
  en: {
    "language-fr": "French",
    "language-code-fr": "FR",
    "language-en": "English",
    "language-code-en": "EN",
    "language-de": "German",
    "language-code-de": "DE",
    "language-lb": "Luxembourgish",
    "language-code-lb": "LU",
  },
  de: {
    "language-fr": "Französisch",
    "language-code-fr": "FR",
    "language-en": "Englisch",
    "language-code-en": "EN",
    "language-de": "Deutsch",
    "language-code-de": "DE",
    "language-lb": "Luxemburgisch",
    "language-code-lb": "LU",
  },
  lb: {
    "language-fr": "Franséisch",
    "language-code-fr": "FR",
    "language-en": "Englesch",
    "language-code-en": "EN",
    "language-de": "Däitsch",
    "language-code-de": "DE",
    "language-lb": "Lëtzebuergesch",
    "language-code-lb": "LU",
  },
}
