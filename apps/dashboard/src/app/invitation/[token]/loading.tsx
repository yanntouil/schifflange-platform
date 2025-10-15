import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import React from "react"

/**
 * PageLoading
 */
export const PageLoading: React.FC = () => {
  const { _ } = useTranslation(dictionary)

  return (
    <Ui.Card.Root className="w-full max-w-md">
      <Ui.Card.Header className="text-center">
        <div className="mb-4 flex justify-center">
          <Ui.SpinIcon className="text-primary size-8" />
        </div>
        <Ui.Card.Title>{_("title")}</Ui.Card.Title>
        <Ui.Card.Description>{_("description")}</Ui.Card.Description>
      </Ui.Card.Header>
    </Ui.Card.Root>
  )
}

/**
 * translations
 */
const dictionary = {
  en: {
    title: "Verifying Your Email",
    description: "Please wait while we activate your account...",
  },
  fr: {
    title: "Vérification de votre email",
    description: "Veuillez patienter pendant l'activation de votre compte...",
  },
  de: {
    title: "E-Mail-Verifizierung",
    description: "Bitte warten Sie, während wir Ihr Konto aktivieren...",
  },
}
