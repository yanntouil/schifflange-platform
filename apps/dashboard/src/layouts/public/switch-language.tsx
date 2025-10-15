import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * SwitchLanguage
 */
export const SwitchLanguage: React.FC = () => {
  const { _, language, setLanguage } = useTranslation(dictionary)
  const { languages } = useTranslation()
  return (
    <Ui.DropdownMenu.Root>
      <Ui.DropdownMenu.Trigger asChild>
        <Ui.Button variant="ghost" className="uppercase" size="sm" icon>
          {language}
          <Ui.SrOnly>{_("change-language")}</Ui.SrOnly>
        </Ui.Button>
      </Ui.DropdownMenu.Trigger>
      <Ui.DropdownMenu.Content align="end">
        {languages.map((current) => (
          <Ui.DropdownMenu.Item key={current} onClick={() => setLanguage(current)} active={current === language}>
            {_(`languages-${current}`)} <Ui.SrOnly>{_(`switch-language-${current}`)}</Ui.SrOnly>
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
    "languages-fr": "Français",
    "languages-en": "Anglais",
    "languages-de": "Allemand",
    "change-language": "Changer la langue",
    "switch-language-fr": "Changer la langue vers le français",
    "switch-language-en": "Changer la langue vers l'anglais",
    "switch-language-de": "Changer la langue vers l'allemand",
  },
  en: {
    "languages-fr": "French",
    "languages-en": "English",
    "languages-de": "German",
    "change-language": "Change language",
    "switch-language-fr": "Switch to french language",
    "switch-language-en": "Switch to english language",
    "switch-language-de": "Switch to german language",
  },
  de: {
    "languages-fr": "Französisch",
    "languages-en": "Englisch",
    "languages-de": "Deutsch",
    "change-language": "Sprache ändern",
    "switch-language-fr": "Zu französisch wechseln",
    "switch-language-en": "Zu englisch wechseln",
    "switch-language-de": "Zu deutsch wechseln",
  },
}
